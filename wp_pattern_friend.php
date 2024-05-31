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

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

require_once plugin_dir_path( __FILE__ ) . 'api.php';

class WP_Pattern_Friend {

	private $asset_file;

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

		// Set the asset file.
		$this->asset_file = include( plugin_dir_path( __FILE__ ) . 'build/index.asset.php');
		$additional_dependencies = array('wp-hooks', 'wp-element', 'wp-api-fetch', 'wp-compose');
		if ( !$this->asset_file['dependencies'] ) {
			$this->asset_file['dependencies'] = $additional_dependencies;
		} else {
			$this->asset_file['dependencies'] = array_merge($this->asset_file['dependencies'], $additional_dependencies);
		}
	}

	/**
	 * Generate menu page.
	 */
	function menu_option() {
		global $screen_id_options;
		$screen_id_options = add_menu_page(
			'Wp Pattern Friend Options',
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

		// Enqueue the bundled block JS file.
		wp_enqueue_script(
			__NAMESPACE__ . '_script',
			plugins_url( 'build/block-options.js', __FILE__ ),
			$this->asset_file['dependencies'],
			$this->asset_file['version'],
			true	
		);
		// Enqueue the bundled block JS file.
		wp_enqueue_style(
			__NAMESPACE__ . '_style',
			plugins_url( 'build/block-options.css', __FILE__ ),
			array(),
			$this->asset_file['version'],
			'all'	
		);
	}

	/**
	 * Enqueue block visiblity only JavaScript and CSS.
	 * 
	 * @return void
	 */
	function enqueue_admin_scripts() {
		wp_enqueue_script(
			__NAMESPACE__ . '_menu_options',
			plugins_url( 'build/pages.js', __FILE__ ),
			$this->asset_file['dependencies'],
			$this->asset_file['version'],
			true
		);
	}

}

$wp_pattern_friend = new WP_Pattern_Friend();

