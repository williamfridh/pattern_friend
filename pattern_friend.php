<?php
/**
 * Plugin Name:       Pattern Friend
 * Description:       Extends the Gutenberg editor with addtional functionality with lightweight code.
 * Requires at least: 6.5.3
 * Requires PHP:      7.3.5
 * Version:           1.2.1
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

		// Enqueue visitor side scripts.
		add_action('wp_enqueue_scripts', [$this, 'enqueue_visitor_scripts']);

		// Enqueue the block edit extenions assets for both viewing and editing.
		add_action('enqueue_block_editor_assets', [$this, 'enqueue_block_editor_extensions']);

		// Enqueue the dynamic CSS.
		add_action('enqueue_block_assets', [$this, 'enqueue_dynamic_css']);
		add_action('enqueue_block_editor_assets', [$this, 'enqueue_dynamic_css']);

		// Enqueue the admin scripts.
		$page = filter_input(INPUT_GET, 'page', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
		if ($page === 'pattern_friend') {
			add_action('admin_enqueue_scripts', [$this, 'enqueue_page_scripts']);
		}

		// Add the filter
		add_filter('render_block', [__NAMESPACE__ . '\Renderer', 'device_visibility_wrapper'], 10, 2);
		add_filter('render_block', [__NAMESPACE__ . '\Renderer', 'hidable_group'], 10, 2);
		add_filter('render_block', [__NAMESPACE__ . '\Renderer', 'group_hiding_button'], 10, 2);

		// Register the activation hook.
		register_activation_hook(__FILE__, [$this, 'activation']);
		add_action('admin_notices', [$this, 'plugin_activation_notice']);

		// Register the upgrade hook.
		//add_action( 'upgrader_process_complete', [$this, 'activation'],10, 2);

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
	 * Enqueue block editor extensions.
	 */
	function enqueue_block_editor_extensions(){

		$asset_file = include( plugin_dir_path( __FILE__ ) . 'build/block-editor-extensions.asset.php');

		// Enqueue the bundled block JS file.
		wp_enqueue_script(
			__NAMESPACE__ . '_block_editor_extensions_scripts',
			plugins_url( 'build/block-editor-extensions.js', __FILE__ ),
			$asset_file['dependencies'],
			$asset_file['version'],
			true	
		);
	}

	/**
	 * Enqueue dynamic css.
	 */
	function enqueue_dynamic_css(){

		$asset_file = include( plugin_dir_path( __FILE__ ) . 'build/block-editor-extensions.asset.php');

		// Enqueue the bundled block JS file.
		wp_enqueue_style(
			__NAMESPACE__ . '_dynamic_css_styles',
			plugins_url( 'src/styles/dynamic.css', __FILE__ ),
			[],
			$asset_file['version'],
			'all'	
		);
	}

	/**
	 * Enqueue visitor only JavaScript & CSS.
	 */
	function enqueue_visitor_scripts() {

		$asset_file = include( plugin_dir_path( __FILE__ ) . 'build/block-editor-extensions.asset.php');

		// Enqueue the bundled block JS file.
		wp_enqueue_script(
			__NAMESPACE__ . '_script',
			plugins_url( 'src/visitor.js', __FILE__ ),
			$asset_file['dependencies'],
			$asset_file['version'],
			true	
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

		// Set transient
		set_transient('plugin_activated', true, 5);
	}

	/**
	 * Display a notice upon plugin activation.
	 * 
	 * @return void
	 */
	public function plugin_activation_notice(){
		// Check if the transient is set.
		if(get_transient('plugin_activated')){
			?>
			<div class="updated notice is-dismissible">
				<p>Thank you for using Pattern Friend. <strong>You're awesome!</strong></p>
				<p>Go to "Appearance >> Pattern Friend" to get started. Or simply <a href="/wp-admin/themes.php?page=pattern_friend">click here.</a></p>
			</div>
			<?php
			// Delete the transient.
			delete_transient('plugin_activated');
		}
	}

}

$pattern_friend = new Pattern_Friend();

