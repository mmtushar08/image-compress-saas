<?php

/**
 * Fired during plugin deactivation
 *
 * @since      1.0.0
 * @package    Shrinkix_WP
 * @subpackage Shrinkix_WP/includes
 */

class Shrinkix_Deactivator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function deactivate() {
		// Clear scheduled cron jobs
		$timestamp = wp_next_scheduled( 'shrinkix_cron_event' );
		if ( $timestamp ) {
			wp_unschedule_event( $timestamp, 'shrinkix_cron_event' );
		}
	}

}
