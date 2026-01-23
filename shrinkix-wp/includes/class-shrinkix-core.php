<?php

/**
 * The core plugin class.
 *
 * @package    Shrinkix_WP
 * @subpackage Shrinkix_WP/includes
 */

class Shrinkix_Core {

	protected $loader;
	protected $plugin_name;
	protected $version;

	public function __construct() {
		if ( defined( 'SHRINKIX_WP_VERSION' ) ) {
			$this->version = SHRINKIX_WP_VERSION;
		} else {
			$this->version = '1.0.0';
		}
		$this->plugin_name = 'shrinkix-wp';

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		// $this->define_public_hooks();
	}

	private function load_dependencies() {
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-shrinkix-loader.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-shrinkix-i18n.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-shrinkix-admin.php';
        
        require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-shrinkix-api.php';
        require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-shrinkix-engine.php';
	}

	private function set_locale() {
		$plugin_i18n = new Shrinkix_i18n();
		$this->loader = new Shrinkix_Loader();
		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );
	}

	private function define_admin_hooks() {
		$plugin_admin = new Shrinkix_Admin( $this->plugin_name, $this->version );

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );
        $this->loader->add_action( 'admin_menu', $plugin_admin, 'add_plugin_admin_menu' );
        $this->loader->add_action( 'admin_init', $plugin_admin, 'register_settings' );
        
        // Add settings link to plugins page
        $plugin_basename = plugin_basename( plugin_dir_path( __DIR__ ) . $this->plugin_name . '.php' );
        $this->loader->add_filter( 'plugin_action_links_' . $plugin_basename, $plugin_admin, 'add_action_links' );
        
        // Media Library Columns
        $this->loader->add_filter( 'manage_media_columns', $plugin_admin, 'add_media_columns' );
        $this->loader->add_action( 'manage_media_custom_column', $plugin_admin, 'manage_media_columns', 10, 2 ); // Using same callback name for simplicity, though slightly unconventional naming
	}

    private function define_public_hooks() {
        $plugin_engine = new Shrinkix_Engine();

        // Catch uploads
        $this->loader->add_filter( 'wp_generate_attachment_metadata', $plugin_engine, 'handle_upload', 10, 2 );

        // Cron event
        $this->loader->add_action( 'shrinkix_cron_event', $plugin_engine, 'process_queue' );
        
        // Add custom cron interval if needed
        $this->loader->add_filter( 'cron_schedules', $this, 'add_cron_interval' );
    }
    
    public function add_cron_interval( $schedules ) {
        $schedules['shrinkix_5min'] = array(
            'interval' => 300,
            'display'  => __( 'Every 5 Minutes' )
        );
        return $schedules;
    }

	public function run() {
        $this->define_public_hooks(); // Missed calling this in original code
		$this->loader->run();
	}

	public function get_plugin_name() {
		return $this->plugin_name;
	}

	public function get_loader() {
		return $this->loader;
	}

	public function get_version() {
		return $this->version;
	}

}
