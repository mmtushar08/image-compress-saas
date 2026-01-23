<?php

/**
 * Define the internationalization functionality
 *
 * @package    Shrinkix_WP
 * @subpackage Shrinkix_WP/includes
 */

class Shrinkix_i18n {

	public function load_plugin_textdomain() {
		load_plugin_textdomain(
			'shrinkix-wp',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);
	}

}
