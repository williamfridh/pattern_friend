<?php
/**
 * Plugin Name:       Wp Pattern Friend
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wp_pattern_friend
 *
 * @package CreateBlock
 */

namespace wp_pattern_friend;

if ( ! defined( 'ABSPATH' ) ) { exit; }

require_once plugin_dir_path( __FILE__ ) . 'api.php';
require_once plugin_dir_path( __FILE__ ) . 'render.php';

class WP_Pattern_Friend {

	/**
	 * Initialize the plugin.
	 */
	public function __construct() {
		
		// Add the menu option to the admin menu.
		add_action('admin_menu', array($this, 'menu_option'));

		// Add the API endpoints when the REST API is initialized.
		add_action('rest_api_init', array($this, 'activate_wp_pattern_friend_api'));

		// Enqueue the block assets for both viewing and editing.
		add_action('enqueue_block_assets', array($this, 'enqueue_block_visibility'));
		add_action('enqueue_block_editor_assets', array($this, 'enqueue_block_visibility'));

		// Enqueue the admin scripts.
		add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));

		// Add the filter
		add_filter('render_block', array(__NAMESPACE__ . '\WP_Pattern_Friend_Render', 'add_device_visibility_wrapper'), 10, 2);

	}

	/**
	 * Generate menu page.
	 */
	function menu_option() {
		global $screen_id_options;
		$screen_id_options = add_menu_page(
			'Wp Pattern Friend',
			'Wp Pattern Friend',
			'manage_options',
			'wp_pattern_friend',
			array($this, 'options_page'),
		);
	}

	/**
	 * Generate options page and set default values.
	 */
	function options_page() {
		add_option('mobile_max_threshold', 600);
		add_option('tablet_max_threshold', 1024);
		include_once( 'options_page.php' );
	}

	/**
	 * Register API endpoints.
	 */
	function activate_wp_pattern_friend_api() {
		$api = new WP_Pattern_Friend_API();
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
			plugins_url( 'build/block-options.css', __FILE__ ),
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
	function enqueue_admin_scripts() {

		$asset_file = include( plugin_dir_path( __FILE__ ) . 'build/pages.asset.php');
		$additional_dependencies = array('wp-hooks', 'wp-element', 'wp-api-fetch', 'wp-compose');
		$asset_file['dependencies'] = array_merge($asset_file['dependencies'], $additional_dependencies);

		wp_enqueue_script(
			__NAMESPACE__ . '_menu_options',
			plugins_url( 'build/pages.js', __FILE__ ),
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);
	}

}

$wp_pattern_friend = new WP_Pattern_Friend();

