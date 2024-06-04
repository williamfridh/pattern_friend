<?php
/**
 * Plugin Name:       Pattern Friend
 * Description:       Extends the post, page, and theme editor by adding a block visibility option based on device type. Supports mobile, tablet, and desktop.
 * Requires at least: 6.5.3
 * Requires PHP:      7.3.5
 * Version:           1.0.0
 * Author:            William Fridh
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       pattern_friend
 * 
 * TODO:
 * 1. Improve error handling.
 */

namespace pattern_friend;

if ( ! defined( 'ABSPATH' ) ) { exit; }

if ( ! @include_once( plugin_dir_path( __FILE__ ) . 'api.php' ) ) {
    // Handle error...
}
if ( ! @include_once( plugin_dir_path( __FILE__ ) . 'render.php' ) ) {
    // Handle error...
}

const DEFAULT_MOBILE_MAX_THRESHOLD = 600;
const DEFAULT_TABLET_MAX_THRESHOLD = 1024;

class Pattern_Friend {

	/**
	 * Initialize the plugin.
	 */
	public function __construct() {
		
		// Add the menu option to the admin menu.
		add_action('admin_menu', array($this, 'menu_option'));

		// Add the API endpoints when the REST API is initialized.
		add_action('rest_api_init', array($this, 'activate_pattern_friend_api'));

		// Enqueue the block assets for both viewing and editing.
		add_action('enqueue_block_assets', array($this, 'enqueue_block_visibility'));
		add_action('enqueue_block_editor_assets', array($this, 'enqueue_block_visibility'));

		// Enqueue the admin scripts.
		$page = filter_input(INPUT_GET, 'page', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
		if ($page === 'pattern_friend') {
			add_action('admin_enqueue_scripts', [$this, 'enqueue_page_scripts']);
		}

		// Add the filter
		add_filter('render_block', array(__NAMESPACE__ . '\Pattern_Friend_Render', 'device_visibility_wrapper'), 10, 2);

		// Register the activation hook.
		register_activation_hook(__FILE__, [$this, 'activation']);

	}

	/**
	 * Generate menu page.
	 */
	function menu_option() {
		global $screen_id_options;
		$screen_id_options = add_menu_page(
			'Pattern Friend',
			'Pattern Friend',
			'manage_options',
			'pattern_friend',
			array($this, 'options_page'),
		);
	}

	/**
	 * Generate options page and set default values.
	 */
	function options_page() {
		add_option('mobile_max_threshold', DEFAULT_MOBILE_MAX_THRESHOLD);
		add_option('tablet_max_threshold', DEFAULT_TABLET_MAX_THRESHOLD);
		include_once( 'options_page.php' );
	}

	/**
	 * Register API endpoints.
	 */
	function activate_pattern_friend_api() {
		$api = new Pattern_Friend_API();
		$api->register_routes();
	}

	/**
	 * Enqueue block visiblity only JavaScript and CSS.
	 */
	function enqueue_block_visibility(){

		$asset_file = include( plugin_dir_path( __FILE__ ) . 'build/block-options.asset.php');

		// Enqueue the bundled block JS file.
		wp_enqueue_script(
			__NAMESPACE__ . '_script',
			plugins_url( 'build/block-options.js', __FILE__ ),
			$asset_file['dependencies'],
			$asset_file['version'],
			true	
		);

		// Enqueue the bundled block JS file.
		wp_enqueue_style(
			__NAMESPACE__ . '_style',
			plugins_url( 'dynamic.css', __FILE__ ),
			array(),
			$asset_file['version'],
			'all'	
		);
	}

	/**
	 * Enqueue block visiblity only JavaScript and CSS.
	 * 
	 * @return void
	 */
	function enqueue_page_scripts() {

		$asset_file = include( plugin_dir_path( __FILE__ ) . 'build/pages.asset.php');
		$additional_dependencies = array('wp-hooks', 'wp-element', 'wp-api-fetch', 'wp-compose');
		$asset_file['dependencies'] = array_merge($asset_file['dependencies'], $additional_dependencies);

		// Enqueue the bundled block JS file.
		wp_enqueue_script(
			__NAMESPACE__ . '_page_menu_options',
			plugins_url( 'build/pages.js', __FILE__ ),
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		// Enqueue the bundled block JS file.
		wp_enqueue_style(
			__NAMESPACE__ . '_page_style',
			plugins_url( 'build/pages.css', __FILE__ ),
			array(),
			$asset_file['version'],
			'all'	
		);

		// Enqueue the WordPress components CSS file.
		wp_enqueue_style(
			__NAMESPACE__ . '_wordpress_components_style',
			plugins_url( 'node_modules/@wordpress/components/build-style/style.css', __FILE__ ),
			array(),
			$asset_file['version'],
			'all'    
		);

	}

	/**
	 * Activation.
	 * 
	 * Perform the necesarry tasks upon plugin activation.
	 * 
	 * @return void
	 */
	public function activation() {

		/*
		 * Create the dynamic CSS file if it does not exist.
		 * 	
		 * This file is used to store the dynamic CSS for the block.
		 */
		$dyammic_css = plugin_dir_path( __FILE__ ) . 'dynamic.css';
		if (!file_exists($dyammic_css)) {
			Pattern_Friend_Render::dynamic_css_file(DEFAULT_MOBILE_MAX_THRESHOLD, DEFAULT_TABLET_MAX_THRESHOLD);
		}
	}

}

$pattern_friend = new Pattern_Friend();

