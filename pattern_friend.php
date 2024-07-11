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

if ( ! function_exists( 'request_filesystem_credentials' ) ) {
	if ( ! require_once ABSPATH . 'wp-admin/includes/file.php' ) {
		// Handle the error.
	}
}

class Pattern_Friend {

	private $default_settings_file_path;
	private $default_settings;

	/**
	 * Initialize the plugin.
	 * 
	 * Register the menu option, API endpoints, and enqueue the block assets.
	 */
	public function __construct() {

		// Set variables.
		$this->default_settings_file_path = plugin_dir_path( __FILE__ ) . 'default-settings.json';
		
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
		add_action( 'upgrader_process_complete', [$this, 'update'],10, 2);

		// Initialize the filesystem.
		$creds = request_filesystem_credentials( site_url() );
		
		if ( ! WP_Filesystem( $creds ) ) {
			// If the filesystem initialization fails, handle the error appropriately.
			return;
		}

		// Get the global filesystem object.
		global $wp_filesystem;
		$this->wp_filesystem = $wp_filesystem;

		// Load default settings.
		$this->load_default_settings();

	}

	/**
	 * Load default settings.
	 * 
	 * Used for loading the default settings for the plugin
	 * from a JSON file and return it as an array.
	 */
	function load_default_settings() {
		if (!$this->wp_filesystem->exists( $this->default_settings_file_path )) {
			throw new \Exception('Default settings file does not exist.');
		}
		$file_content = $file_content = $this->wp_filesystem->get_contents( $this->default_settings_file_path );
		if ($file_content === false) {
			throw new \Exception('Could not read default settings file.');
		}
		$this->default_settings = json_decode($file_content, true);
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
		wp_enqueue_style(
			__NAMESPACE__ . '_page_rtl_style',
			plugins_url( 'build/pages-rtl.css', __FILE__ ),
			[],
			$asset_file['version'],
			'all'	
		);
		wp_enqueue_style(
			__NAMESPACE__ . '_wordpress_components_style',
			plugins_url( 'src/styles/wordpress.components.css', __FILE__ ),
			[],
			$asset_file['version'],
			'all'	
		);

	}

	/**
	 * Activation.
	 * 
	 * Generates the necesarry tasks upon plugin activation.
	 * 
	 * @return void
	 */
	public function activation() {
		// Prepare CSS and options.
		$this->generate_css_and_options();
		// Set transient
		set_transient('plugin_activated', true, 5);
	}

	/**
	 * Update.
	 * 
	 * Perform the necesarry tasks upon plugin update.
	 * 
	 * @return void
	 */
	public function update() {
		// Prepare CSS and options.
		$this->generate_css_and_options();
	}

	/**
	 * Prepare CSS and options.
	 * 
	 * Called upon plugin activation and update.
	 * 
	 * @return void
	 */
	public function generate_css_and_options() {
		$css_generator = new CSSGenerator();
		// Generate new CSS.
		$css_generator->generate(
			$this->default_settings['deviceThresholds']['mobileMaxThreshold'],
			$this->default_settings['deviceThresholds']['tabletMaxThreshold'],
			$this->default_settings['headerFooter']['headerSticky']
		);
		// Set default options.
		add_option('pf_mobile_max_threshold', $this->default_settings['deviceThresholds']['mobileMaxThreshold']);
		add_option('pf_tablet_max_threshold', $this->default_settings['deviceThresholds']['tabletMaxThreshold']);
		add_option('pf_header_sticky', $this->default_settings['headerFooter']['headerSticky']);
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

