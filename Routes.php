<?php

/**
 * This file contains all API end points used by the plugin.
 * 
 * NOTES:
 * 1. The API end points are registered using the WP_REST_Controller class.
 * 2. The API end points are registered in the 'rest_api_init' action.
 * 3. Remember to call other classes as globals since this file uses a namespace.
 * 
 * TODO:
 * 1. Improve error handling.
 */

namespace PatternFriend;

if ( ! defined( 'ABSPATH' ) ) { exit; }

require_once plugin_dir_path( __FILE__ ) . 'CSSGenerator.php';

class Routes extends \WP_REST_Controller {

	/**
	 * The namespace and version for the REST API endpoint.
	 *
	 * @var string
	 */
	protected $version;
	protected $namespace;
	
	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->version = '2.2';
		$this->namespace = 'wp-pattern-friend/v' . $this->version;
	}

	/**
	 * Register the routes for the objects of the controller.
	 * 
	 * @return void
	 */
	public function register() {

		// Block visibility options.
		register_rest_route(
			$this->namespace, '/options/block_visibility', array(
				'methods'               => \WP_REST_Server::READABLE,
				'callback'              => array($this, 'get_options_block_visibility'),
				'permission_callback'   => array($this, 'get_items_permissions_check')
			)
		);
		register_rest_route(
			$this->namespace, '/options/block_visibility', array(
				'methods'               => \WP_REST_Server::EDITABLE,
				'callback'              => array($this, 'update_options_block_visibility'),
				'permission_callback'   => array($this, 'update_item_permissions_check')
			)
		);

		// Header and footer options.
		register_rest_route(
			$this->namespace, '/options/header_footer', array(
				'methods'               => \WP_REST_Server::READABLE,
				'callback'              => array($this, 'get_options_header_footer'),
				'permission_callback'   => array($this, 'get_items_permissions_check')
			)
		);
		register_rest_route(
			$this->namespace, '/options/header_footer', array(
				'methods'               => \WP_REST_Server::EDITABLE,
				'callback'              => array($this, 'update_options_header_footer'),
				'permission_callback'   => array($this, 'update_item_permissions_check')
			)
		);

		// Check for block support.
		register_rest_route(
			$this->namespace, '/checks/block_support', array(
				'methods'               => \WP_REST_Server::READABLE,
				'callback'              => array($this, 'check_block_support'),
				'permission_callback'   => array($this, 'get_items_permissions_check')
			)
		);
	}

	/**
	 * Callback for the block support endpoint.
	 * 
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function check_block_support( \WP_REST_Request $request ) {
		
		// Check if the block is supported.
		$block_support = wp_is_block_theme();

		// Prepare the response.
		$response = new \WP_REST_Response( $block_support, '200' );
		return $response;

	}

	/*
	* Callback for the get options block visibility endpoint.
	*
	* @param WP_REST_Request $request Full data about the request.
	* @return WP_Error|WP_REST_Response
	*/
	public function get_options_block_visibility(\WP_REST_Request $request) {

		// Generate the response.
		$response = [];
		$response['pattern_friend_mobile_max_threshold'] = get_option('pattern_friend_mobile_max_threshold');
		$response['pattern_friend_tablet_max_threshold'] = get_option('pattern_friend_tablet_max_threshold');

		// Prepare the response.
		$response = new \WP_REST_Response($response);

		return $response;

	}

	/**
	 * Callback for the update device visibility options endpoint.
	 * 
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function update_options_block_visibility( \WP_REST_Request $request ) {

		// Get the data and sanitize.
		$mobile_max_threshold = absint( $request->get_param( 'pattern_friend_mobile_max_threshold' ) );
		$tablet_max_threshold = absint( $request->get_param( 'pattern_friend_tablet_max_threshold' ) );

		// Update the options.
		update_option( 'pattern_friend_mobile_max_threshold', $mobile_max_threshold );
		update_option( 'pattern_friend_tablet_max_threshold', $tablet_max_threshold );

		// Generate new CSS.
		$this->generate_css();

		// Prepare the response.
		$response = new \WP_REST_Response( 'Data successfully added.', '200' );
		return $response;

	}

	/*
	* Callback for the get header and footer options endpoint.
	*
	* @param WP_REST_Request $request Full data about the request.
	* @return WP_Error|WP_REST_Response
	*/
	public function get_options_header_footer(\WP_REST_Request $request) {

		// Generate the response.
		$response = [];
		$response['pattern_friend_header_sticky'] = get_option('pattern_friend_header_sticky');

		// Generate new CSS.
		$this->generate_css();

		// Prepare the response.
		$response = new \WP_REST_Response($response);
		return $response;

	}

	/**
	 * Call CSS Generator to generate new CSS.
	 */
	private function generate_css() {
		$mobile_max_threshold = get_option('pattern_friend_mobile_max_threshold');
		$tablet_max_threshold = get_option('pattern_friend_tablet_max_threshold');
		$header_sticky = get_option('pattern_friend_header_sticky');

		$css_generator = new \PatternFriend\CSSGenerator();
		$css_generator->generate($mobile_max_threshold, $tablet_max_threshold, $header_sticky);
	}

	/**
	 * Callback for the update header and footer options endpoint.
	 * 
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function update_options_header_footer( \WP_REST_Request $request ) {

		// Get the data and sanitize.
		$header_sticky = $request->get_param( 'pattern_friend_header_sticky' );

		// Update the options.
		update_option( 'pattern_friend_header_sticky', $header_sticky );

		// Prepare the response.
		$response = new \WP_REST_Response( 'Data successfully added.', '200' );
		return $response;

	}

	/**
	 * Check if a given request has access to get items
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function get_items_permissions_check( $request ) {
		return true;
	}

	/**
	 * Check if a given request has access to get a specific item
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function get_item_permissions_check( $request ) {
		return $this->get_items_permissions_check( $request );
	}

	/**
	 * Check if a given request has access to create items
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function create_item_permissions_check( $request ) {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Check if a given request has access to update a specific item
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function update_item_permissions_check( $request ) {
		return $this->create_item_permissions_check( $request );
	}
	
}

