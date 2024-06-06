<?php
/**
 * Plugin Name:       Pattern Friend
 * Description:       Extends the post, page, and theme editor by adding a block visibility option based on device type. Supports mobile, tablet, and desktop.
 * Requires at least: 6.5.3
 * Requires PHP:      7.3.5
 * Version:           1.1.0
 * Author:            William Fridh
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       pattern_friend
 * 
 * TODO:
 * 1. Improve error handling.
 */

namespace PatternFriend;

if ( ! defined( 'ABSPATH' ) ) { exit; }

if ( ! @include_once( plugin_dir_path( __FILE__ ) . 'Routes.php' ) ) {
    // Handle error...
}
if ( ! @include_once( plugin_dir_path( __FILE__ ) . 'Renderer.php' ) ) {
    // Handle error...
}

const DEFAULT_MOBILE_MAX_THRESHOLD = 600;
const DEFAULT_TABLET_MAX_THRESHOLD = 1024;
const DEFAULT_HEADER_STICKY = false;

class Pattern_Friend {

	/**
	 * Initialize the plugin.
	 * 
	 * Register the menu option, API endpoints, and enqueue the block assets.
	 */
	public function __construct() {
		
		// Add the menu option to the admin menu.
		add_action('admin_menu', [$this, 'menu_option']);

		// Add the API endpoints when the REST API is initialized.
		add_action('rest_api_init', [$this, 'activate_routes']);

		// Enqueue the block visibility assets for both viewing and editing.
		add_action('enqueue_block_assets', [$this, 'enqueue_block_visibility']);
		add_action('enqueue_block_editor_assets', [$this, 'enqueue_block_visibility']);

		// Enqueue the admin scripts.
		$page = filter_input(INPUT_GET, 'page', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
		if ($page === 'pattern_friend') {
			add_action('admin_enqueue_scripts', [$this, 'enqueue_page_scripts']);
		}

		// Add the filter
		add_filter('render_block', [__NAMESPACE__ . '\Renderer', 'device_visibility_wrapper'], 10, 2);

		// Register the activation hook.
		register_activation_hook(__FILE__, [$this, 'activation']);

	}

	/**
	 * Generate menu page.
	 */
	function menu_option() {
		global $screen_id_options;
		$screen_id_options = add_submenu_page(
			'themes.php',
			'Pattern Friend',
			'Pattern Friend',
			'manage_options',
			'pattern_friend',
			[$this, 'options_page'],
		);
	}

	/**
	 * Generate options page and set default values.
	 */
	function options_page() {
		add_option('pf_mobile_max_threshold', DEFAULT_MOBILE_MAX_THRESHOLD);
		add_option('pf_tablet_max_threshold', DEFAULT_TABLET_MAX_THRESHOLD);
		add_option('pf_header_sticky', DEFAULT_HEADER_STICKY);
		include_once( 'pages/options.php' );
	}

	/**
	 * Register API endpoints/routes.
	 */
	function activate_routes() {
		$api = new Routes();
		$api->register();
	}

	/**
	 * Enqueue block visiblity only JavaScript and CSS.
	 */
	function enqueue_block_visibility(){

		$asset_file = include( plugin_dir_path( __FILE__ ) . 'build/block-visibility.asset.php');

		// Enqueue the bundled block JS file.
		wp_enqueue_script(
			__NAMESPACE__ . '_script',
			plugins_url( 'build/block-visibility.js', __FILE__ ),
			$asset_file['dependencies'],
			$asset_file['version'],
			true	
		);

		// Enqueue the bundled block JS file.
		wp_enqueue_style(
			__NAMESPACE__ . '_style',
			plugins_url( 'styles/dynamic.css', __FILE__ ),
			[],
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
		$additional_dependencies = ['wp-hooks', 'wp-element', 'wp-api-fetch', 'wp-compose'];
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
			[],
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
		$css_generator = new \PatternFriend\CSSGenerator();
		if ( ! $css_generator->file_exists() ) {
			$css_generator->generate(DEFAULT_MOBILE_MAX_THRESHOLD, DEFAULT_TABLET_MAX_THRESHOLD, DEFAULT_HEADER_STICKY);
		}
	}

}

$pattern_friend = new Pattern_Friend();

