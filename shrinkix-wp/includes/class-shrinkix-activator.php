<?php

/**
 * Fired during plugin activation
 *
 * @since      1.0.0
 * @package    Shrinkix_WP
 * @subpackage Shrinkix_WP/includes
 */

class Shrinkix_Activator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {
		// Initialize default options if not present
		if ( false === get_option( 'shrinkix_api_key' ) ) {
			add_option( 'shrinkix_api_key', '' );
		}
		if ( false === get_option( 'shrinkix_auto_optimize' ) ) {
			add_option( 'shrinkix_auto_optimize', '1' );
		}
		if ( false === get_option( 'shrinkix_backup_original' ) ) {
			add_option( 'shrinkix_backup_original', '1' );
		}
        if ( false === get_option( 'shrinkix_generate_webp' ) ) {
			add_option( 'shrinkix_generate_webp', '0' );
		}
	}

}
