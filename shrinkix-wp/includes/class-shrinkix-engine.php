<?php

/**
 * The optimization engine logic.
 *
 * @package    Shrinkix_WP
 * @subpackage Shrinkix_WP/includes
 */

class Shrinkix_Engine {

    private $api;

    public function __construct() {
        $this->api = new Shrinkix_API();
    }

    /**
     * Hook: wp_generate_attachment_metadata
     * Marks a new upload as pending optimization.
     */
    public function handle_upload( $metadata, $attachment_id, $context = null ) {
        // Check if auto-optimization is enabled
        if ( get_option( 'shrinkix_auto_optimize' ) !== '1' ) {
            return $metadata;
        }

        // Avoid double marking if updated
        if ( get_post_meta( $attachment_id, '_shrinkix_status', true ) ) {
            return $metadata;
        }

        // Validate mime type (images only)
        $post = get_post( $attachment_id );
        if ( ! $post || ! in_array( $post->post_mime_type, array( 'image/jpeg', 'image/png', 'image/webp' ) ) ) {
            return $metadata;
        }

        // Initialize meta
        update_post_meta( $attachment_id, '_shrinkix_status', 'pending' );

        // Schedule immediate run if no cron is running, or just let the recurring cron pick it up.
        // For better UX, we might want to schedule a single event if the queue was empty?
        // Let's stick to the 5-min interval for robustness, or schedule a single event soon.
        if ( ! wp_next_scheduled( 'shrinkix_cron_event' ) ) {
            wp_schedule_event( time(), 'shrinkix_5min', 'shrinkix_cron_event' );
        }

        return $metadata;
    }

    /**
     * Cron Callback: Process the queue.
     * Fetches pending attachments and optimizes them.
     */
    public function process_queue() {
        // Find 5 pending images
        $query = new WP_Query( array(
            'post_type'      => 'attachment',
            'post_status'    => 'inherit', // Attachments usually have 'inherit'
            'posts_per_page' => 5,
            'meta_query'     => array(
                array(
                    'key'   => '_shrinkix_status',
                    'value' => 'pending',
                ),
            ),
            'fields'         => 'ids',
        ) );

        if ( ! $query->have_posts() ) {
            return;
        }

        foreach ( $query->posts as $attachment_id ) {
            $this->optimize_attachment( $attachment_id );
        }
    }

    /**
     * Optimize a single attachment.
     */
    public function optimize_attachment( $attachment_id ) {
        $file_path = get_attached_file( $attachment_id );
        
        if ( ! $file_path || ! file_exists( $file_path ) ) {
            update_post_meta( $attachment_id, '_shrinkix_status', 'failed' );
            update_post_meta( $attachment_id, '_shrinkix_error', 'File not found' );
            return;
        }

        // Backup if enabled
        if ( get_option( 'shrinkix_backup_original' ) === '1' ) {
            $backup_path = $file_path . '.shrinkix.bak';
            if ( ! file_exists( $backup_path ) ) {
                copy( $file_path, $backup_path );
            }
        }

        // Call API
        $result = $this->api->compress_image( $file_path ); // Defaults to auto-format (same as input usually) or API logic

        if ( is_wp_error( $result ) ) {
            update_post_meta( $attachment_id, '_shrinkix_status', 'failed' );
            update_post_meta( $attachment_id, '_shrinkix_error', $result->get_error_message() );
            return;
        }

        // Save optimized file
        $bytes_written = file_put_contents( $file_path, $result['content'] );
        if ( $bytes_written === false ) {
            update_post_meta( $attachment_id, '_shrinkix_status', 'failed' );
            update_post_meta( $attachment_id, '_shrinkix_error', 'Could not write file' );
            return;
        }

        // Generate WebP if enabled
        if ( get_option( 'shrinkix_generate_webp' ) === '1' ) {
            $webp_result = $this->api->compress_image( $file_path, 'webp' );
            if ( ! is_wp_error( $webp_result ) ) {
                $webp_path = $file_path . '.webp';
                file_put_contents( $webp_path, $webp_result['content'] );
                update_post_meta( $attachment_id, '_shrinkix_webp_path', $webp_path );
                update_post_meta( $attachment_id, '_shrinkix_webp_size', $webp_result['compressed_size'] );
            }
        }

        // Update Meta
        update_post_meta( $attachment_id, '_shrinkix_status', 'optimized' );
        update_post_meta( $attachment_id, '_shrinkix_stats', array(
            'original_size'   => $result['original_size'],
            'compressed_size' => $result['compressed_size'],
            'saved_percent'   => $result['saved_percent'],
            'timestamp'       => time(),
        ));
        
        // Also optimize thumbnails? 
        // For MVP, we only optimize the full size. 
        // To optimize thumbnails, we'd need to iterate through metadata['sizes'] and upload each.
        // This is complex for V1. Start with full image.
    }

}
