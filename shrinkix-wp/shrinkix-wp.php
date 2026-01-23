<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * administrative area. This file also includes all of the plugin dependencies.
 *
 * @link              https://example.com
 * @since             1.0.0
 * @package           Shrinkix_WP
 *
 * @wordpress-plugin
 * Plugin Name:       Shrinkix Image Optimizer
 * Plugin URI:        https://example.com/plugin-name
 * Description:       Automated image optimization powered by the Shrinkix API.
 * Version:           1.0.0
 * Author:            Shrinkix
 * Author URI:        https://example.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       shrinkix-wp
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 */
define( 'SHRINKIX_WP_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 */
function activate_shrinkix_wp() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-shrinkix-activator.php';
	Shrinkix_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 */
function deactivate_shrinkix_wp() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-shrinkix-deactivator.php';
	Shrinkix_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_shrinkix_wp' );
register_deactivation_hook( __FILE__, 'deactivate_shrinkix_wp' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-shrinkix-core.php';

/**
 * Begins execution of the plugin.
 */
function run_shrinkix_wp() {
	$plugin = new Shrinkix_Core();
	$plugin->run();
}

run_shrinkix_wp();
