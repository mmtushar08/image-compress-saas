<?php

/**
 * API Client for Shrinkix
 *
 * @package    Shrinkix_WP
 * @subpackage Shrinkix_WP/includes
 */

class Shrinkix_API {

    private $api_url = 'http://localhost:5000/api'; // Dev URL, should be configurable or production URL
    private $api_key;

    public function __construct() {
        $this->api_key = get_option('shrinkix_api_key');
    }

    /**
     * Compress an image
     *
     * @param string $file_path Absolute path to the image file.
     * @param string $format Optional format to convert to (webp, etc).
     * @return array|WP_Error Response with content and stats, or WP_Error on failure.
     */
    public function compress_image( $file_path, $format = null ) {
        if ( ! file_exists( $file_path ) ) {
            return new WP_Error( 'file_missing', 'Image file not found.' );
        }

        $url = $this->api_url . '/compress';
        if ( $format ) {
            $url = add_query_arg( 'format', $format, $url );
        }

        $args = array(
            'method'    => 'POST',
            'timeout'   => 60, // Long timeout for valid processing
            'headers'   => array(
                'X-API-Key' => $this->api_key,
            ),
            'body'      => array(
                'image' => new CURLFile( $file_path ) // simplified for PHP > 5.5
            )
        );

        // WP's wp_remote_post doesn't handle multipart/form-data efficiently with simplified body array for files in all versions.
        // We need to construct the boundary manually or use a helper if we want to be strictly WP standard.
        // However, standard PHP CURLFile usually works if the transport layer uses curl.
        // Re-implementing with `wp_remote_post` properly for file upload is slightly verbose.
        
        // Let's use a cleaner approach for WP: reading file content. 
        // Note: Sending raw bytes as body is NOT what the API expects (it expects multipart).
        // For simplicity in this environment, using the boundary construction:
        
        $boundary = wp_generate_password( 24 );
        $headers  = array(
            'content-type' => 'multipart/form-data; boundary=' . $boundary,
            'X-API-Key'    => $this->api_key,
        );
        
        $file_content = file_get_contents( $file_path );
        $filename     = basename( $file_path );
        $mime_type    = mime_content_type( $file_path );

        $payload = '';
        $payload .= '--' . $boundary . "\r\n";
        $payload .= 'Content-Disposition: form-data; name="image"; filename="' . $filename . '"' . "\r\n";
        $payload .= 'Content-Type: ' . $mime_type . "\r\n\r\n";
        $payload .= $file_content . "\r\n";
        $payload .= '--' . $boundary . '--';

        $response = wp_remote_post( $url, array(
            'headers' => $headers,
            'body'    => $payload,
            'timeout' => 60,
        ) );

        if ( is_wp_error( $response ) ) {
            return $response;
        }

        $response_code = wp_remote_retrieve_response_code( $response );
        if ( $response_code !== 200 ) {
            $body = json_decode( wp_remote_retrieve_body( $response ), true );
            $msg = isset( $body['error'] ) ? $body['error'] : 'Unknown API Error';
            return new WP_Error( 'api_error', $msg, array( 'status' => $response_code ) );
        }

        return array(
            'content'         => wp_remote_retrieve_body( $response ),
            'original_size'   => wp_remote_retrieve_header( $response, 'X-Original-Size' ),
            'compressed_size' => wp_remote_retrieve_header( $response, 'X-Compressed-Size' ),
            'saved_percent'   => wp_remote_retrieve_header( $response, 'X-Saved-Percent' ),
        );
    }

    public function check_limit() {
        $url = $this->api_url . '/check-limit';
        $response = wp_remote_get( $url, array(
            'headers' => array( 'X-API-Key' => $this->api_key )
        ));

        if ( is_wp_error( $response ) ) {
            return $response;
        }

        return json_decode( wp_remote_retrieve_body( $response ), true );
    }

}
