<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @package    Shrinkix_WP
 * @subpackage Shrinkix_WP/admin
 */

class Shrinkix_Admin {

	private $plugin_name;
	private $version;

	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version     = $version;
	}

	public function enqueue_styles() {
		// wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/shrinkix-wp-admin.css', array(), $this->version, 'all' );
	}

	public function enqueue_scripts() {
		// wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/shrinkix-wp-admin.js', array( 'jquery' ), $this->version, false );
	}

    /**
     * Register the administration menu for this plugin into the WordPress Dashboard menu.
     */
    public function add_plugin_admin_menu() {
        add_options_page(
            'Shrinkix Settings', 
            'Shrinkix', 
            'manage_options', 
            $this->plugin_name, 
            array($this, 'display_plugin_setup_page')
        );
    }

    /**
     * Add settings action link to the plugins page.
     */
    public function add_action_links( $links ) {
        $settings_link = array(
            '<a href="' . admin_url( 'options-general.php?page=' . $this->plugin_name ) . '">' . __('Settings', 'shrinkix-wp') . '</a>',
        );
        return array_merge( $settings_link, $links );
    }

    /**
     * Register the settings and sections.
     */
    public function register_settings() {
        register_setting( $this->plugin_name, 'shrinkix_api_key' );
        register_setting( $this->plugin_name, 'shrinkix_auto_optimize' );
        register_setting( $this->plugin_name, 'shrinkix_backup_original' );
        register_setting( $this->plugin_name, 'shrinkix_generate_webp' );

        add_settings_section(
            'shrinkix_general_section',
            __( 'General Settings', 'shrinkix-wp' ),
            array( $this, 'section_callback' ),
            $this->plugin_name
        );

        add_settings_field(
            'shrinkix_api_key',
            __( 'API Key', 'shrinkix-wp' ),
            array( $this, 'render_api_key_field' ),
            $this->plugin_name,
            'shrinkix_general_section'
        );

        add_settings_field(
            'shrinkix_auto_optimize',
            __( 'Auto-Optimize on Upload', 'shrinkix-wp' ),
            array( $this, 'render_auto_optimize_field' ),
            $this->plugin_name,
            'shrinkix_general_section'
        );

        add_settings_field(
            'shrinkix_backup_original',
            __( 'Backup Original Images', 'shrinkix-wp' ),
            array( $this, 'render_backup_original_field' ),
            $this->plugin_name,
            'shrinkix_general_section'
        );

        add_settings_field(
            'shrinkix_generate_webp',
            __( 'Generate WebP', 'shrinkix-wp' ),
            array( $this, 'render_generate_webp_field' ),
            $this->plugin_name,
            'shrinkix_general_section'
        );
    }

    public function section_callback( $args ) {
        echo __( 'Configure your Shrinkix settings below.', 'shrinkix-wp' );
    }

    public function render_api_key_field() {
        $api_key = get_option( 'shrinkix_api_key' );
        echo '<input type="text" id="shrinkix_api_key" name="shrinkix_api_key" value="' . esc_attr( $api_key ) . '" class="regular-text" />';
        echo '<p class="description">' . __( 'Enter your Shrinkix API Key.', 'shrinkix-wp' ) . '</p>';
    }

    public function render_auto_optimize_field() {
        $auto_optimize = get_option( 'shrinkix_auto_optimize' );
        echo '<input type="checkbox" id="shrinkix_auto_optimize" name="shrinkix_auto_optimize" value="1" ' . checked( 1, $auto_optimize, false ) . ' />';
        echo '<label for="shrinkix_auto_optimize">' . __( 'Automatically optimize new uploads.', 'shrinkix-wp' ) . '</label>';
    }

    public function render_backup_original_field() {
        $backup = get_option( 'shrinkix_backup_original' );
        echo '<input type="checkbox" id="shrinkix_backup_original" name="shrinkix_backup_original" value="1" ' . checked( 1, $backup, false ) . ' />';
        echo '<label for="shrinkix_backup_original">' . __( 'Keep a backup of the original image.', 'shrinkix-wp' ) . '</label>';
    }

    public function render_generate_webp_field() {
        $webp = get_option( 'shrinkix_generate_webp' );
        echo '<input type="checkbox" id="shrinkix_generate_webp" name="shrinkix_generate_webp" value="1" ' . checked( 1, $webp, false ) . ' />';
        echo '<label for="shrinkix_generate_webp">' . __( 'Create a separate WebP version of the image.', 'shrinkix-wp' ) . '</label>';
    }

    /**
     * Render the settings page for this plugin.
     */
    public function display_plugin_setup_page() {
        // Handle Actions
        if ( isset( $_POST['shrinkix_bulk_action'] ) && check_admin_referer( 'shrinkix_bulk_action_nonce' ) ) {
            $this->handle_bulk_actions();
        }
        
        // Get Stats
        $pending_count = $this->get_pending_count();
        ?>
        <div class="wrap">
            <h2><?php echo esc_html( get_admin_page_title() ); ?></h2>
            
            <div class="card" style="max-width: 800px; margin-top: 20px; padding: 20px;">
                <h3><?php _e('Bulk Optimization', 'shrinkix-wp'); ?></h3>
                <p><?php printf( __('Pending Images in Queue: <strong>%d</strong>', 'shrinkix-wp'), $pending_count ); ?></p>
                <form method="post" action="">
                    <?php wp_nonce_field( 'shrinkix_bulk_action_nonce' ); ?>
                    <input type="hidden" name="shrinkix_bulk_action" value="scan_library">
                    <p>
                        <button type="submit" class="button button-secondary" name="action_type" value="scan"><?php _e('Add All Unoptimized Images to Queue', 'shrinkix-wp'); ?></button>
                        <button type="submit" class="button button-secondary" name="action_type" value="reset_failed"><?php _e('Retry Failed Images', 'shrinkix-wp'); ?></button>
                    </p>
                    <p class="description"><?php _e('Images will be processed in the background via WP-Cron.', 'shrinkix-wp'); ?></p>
                </form>
            </div>

            <!-- Account Status Card -->
            <?php
            $api_key = get_option('shrinkix_api_key');
            if ( $api_key ) {
                $status = $this->fetch_account_status($api_key);
                ?>
                <div class="card" style="max-width: 800px; margin-top: 20px; padding: 20px;">
                    <h3><?php _e('Account Status', 'shrinkix-wp'); ?></h3>
                    <?php if ( is_wp_error( $status ) ) : ?>
                         <p style="color: #c0392b;"><?php echo esc_html( $status->get_error_message() ); ?></p>
                    <?php else : ?>
                        <p>
                            <strong><?php _e('Your Plan:', 'shrinkix-wp'); ?></strong> <?php echo ucfirst( esc_html( $status['plan'] ) ); ?>
                            <span style="display:inline-block; width: 20px;"></span>
                            <strong><?php _e('Remaining Credits:', 'shrinkix-wp'); ?></strong> 
                            <?php echo $status['remaining'] === -1 ? __('Unlimited', 'shrinkix-wp') : esc_html( $status['remaining'] ); ?>
                        </p>
                    <?php endif; ?>
                </div>
                <?php
            }
            ?>

            <form action="options.php" method="post">
                <?php
                settings_fields( $this->plugin_name );
                do_settings_sections( $this->plugin_name );
                submit_button();
                ?>
            </form>
        </div>
        <?php
    }

    private function get_pending_count() {
        $query = new WP_Query( array(
            'post_type'      => 'attachment',
            'post_status'    => 'inherit',
            'meta_query'     => array(
                array(
                    'key'   => '_shrinkix_status',
                    'value' => 'pending',
                ),
            ),
            'fields'         => 'ids',
            'posts_per_page' => -1, // Just count
        ) );
        return $query->found_posts;
    }

    private function handle_bulk_actions() {
        $action = isset($_POST['action_type']) ? $_POST['action_type'] : '';
        
        if ( $action === 'scan' ) {
            // Find all attachments NOT having _shrinkix_status
            $query = new WP_Query( array(
                'post_type'      => 'attachment',
                'post_status'    => 'inherit',
                'posts_per_page' => -1,
                'fields'         => 'ids',
                'meta_query'     => array(
                    array(
                        'key'     => '_shrinkix_status',
                        'compare' => 'NOT EXISTS',
                    )
                ),
            ) );
            
            if ( $query->have_posts() ) {
                foreach ( $query->posts as $id ) {
                    // Check mime type again just in case
                    $post = get_post($id);
                    if ( in_array( $post->post_mime_type, array( 'image/jpeg', 'image/png', 'image/webp' ) ) ) {
                        update_post_meta( $id, '_shrinkix_status', 'pending' );
                    }
                }
                
                // Ensure Cron is scheduled
                if ( ! wp_next_scheduled( 'shrinkix_cron_event' ) ) {
                    wp_schedule_event( time(), 'shrinkix_5min', 'shrinkix_cron_event' );
                }
                
                add_settings_error( 'shrinkix_messages', 'shrinkix_scan', __('Scanned library. Images added to queue.', 'shrinkix-wp'), 'updated' );
            } else {
                 add_settings_error( 'shrinkix_messages', 'shrinkix_scan', __('No new images found.', 'shrinkix-wp'), 'updated' );
            }
        } elseif ( $action === 'reset_failed' ) {
            // Find all failed
             $query = new WP_Query( array(
                'post_type'      => 'attachment',
                'post_status'    => 'inherit',
                'posts_per_page' => -1,
                'fields'         => 'ids',
                'meta_query'     => array(
                    array(
                        'key'   => '_shrinkix_status',
                        'value' => 'failed',
                    )
                ),
            ) );
            
             if ( $query->have_posts() ) {
                foreach ( $query->posts as $id ) {
                    update_post_meta( $id, '_shrinkix_status', 'pending' );
                }
                add_settings_error( 'shrinkix_messages', 'shrinkix_reset', __('Failed images reset to pending.', 'shrinkix-wp'), 'updated' );
             } else {
                 add_settings_error( 'shrinkix_messages', 'shrinkix_reset', __('No failed images found.', 'shrinkix-wp'), 'updated' );
             }
        }
    }

    /**
     * Add columns to Media Library
     */
    public function add_media_columns( $columns ) {
        $columns['shrinkix'] = __( 'Compression', 'shrinkix-wp' );
        return $columns;
    }

    public function manage_media_columns( $column_name, $id ) {
        if ( 'shrinkix' !== $column_name ) {
            return;
        }

        $status = get_post_meta( $id, '_shrinkix_status', true );
        
        // Skip non-images
        $mime = get_post_mime_type( $id );
        if ( ! in_array( $mime, array('image/jpeg', 'image/png', 'image/webp') ) ) {
            echo '-';
            return;
        }

        if ( ! $status ) {
            echo '<span style="color: #999;">' . __('Unoptimized', 'shrinkix-wp') . '</span>';
        } elseif ( $status === 'pending' ) {
             echo '<span style="color: #e67e22;">' . __('Pending', 'shrinkix-wp') . '</span>';
        } elseif ( $status === 'active' ) { // Optional: if we track executing state
             echo '<span style="color: #2980b9;">' . __('Compressing...', 'shrinkix-wp') . '</span>';
        } elseif ( $status === 'failed' ) {
             $error = get_post_meta( $id, '_shrinkix_error', true );
             echo '<span style="color: #c0392b;">' . __('Failed', 'shrinkix-wp') . '</span>';
             if ( $error ) echo '<br><small>' . esc_html($error) . '</small>';
        } elseif ( $status === 'optimized' ) {
             $stats = get_post_meta( $id, '_shrinkix_stats', true );
             if ( $stats ) {
                 echo '<span style="color: #27ae60; font-weight:bold;">' . esc_html($stats['saved_percent']) . '</span>';
                 echo '<br><small>' . size_format($stats['original_size'], 1) . ' &rarr; ' . size_format($stats['compressed_size'], 1) . '</small>';
             } else {
                 echo '<span style="color: #27ae60;">' . __('Optimized', 'shrinkix-wp') . '</span>';
             }
        }
    }



    private function fetch_account_status( $api_key ) {
        
        if ( ! class_exists( 'Shrinkix_API' ) ) {
             require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-shrinkix-api.php';
        }
        
        $api_client = new Shrinkix_API();
        return $api_client->check_limit();
    }

}
