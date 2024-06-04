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

namespace pattern_friend;

if ( ! defined( 'ABSPATH' ) ) { exit; }

require_once plugin_dir_path( __FILE__ ) . 'render.php';

class Pattern_Friend_API extends \WP_REST_Controller {

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
		$this->version = '1';
		$this->namespace = 'wp-pattern-friend/v' . $this->version;
	}

	/**
	 * Register the routes for the objects of the controller.
	 * 
	 * @return void
	 */
	public function register_routes() {

		//Add the GET 'wp-pattern-friend/v1/options' endpoint to the Rest API.
		register_rest_route(
			$this->namespace, '/' . 'options', array(
				'methods'               => \WP_REST_Server::READABLE,
				'callback'              => array($this, 'get_options'),
				'permission_callback'   => array($this, 'get_items_permissions_check')
			)
		);

		//Add the POST 'react_options_page/v1/options' endpoint to the Rest API.
		register_rest_route(
			$this->namespace, '/' . 'options', array(
				'methods'               => \WP_REST_Server::EDITABLE,
				'callback'              => array($this, 'update_options'),
				'permission_callback'   => array($this, 'update_item_permissions_check')
			)
		);
	}

	/*
	* Callback for the get options endpoint.
	*
	* @param WP_REST_Request $request Full data about the request.
	* @return WP_Error|WP_REST_Response
	*/
	public function get_options(\WP_REST_Request $request) {

		// Generate the response.
		$response = [];
		$response['mobile_max_threshold'] = get_option('mobile_max_threshold');
		$response['tablet_max_threshold'] = get_option('tablet_max_threshold');

		// Prepare the response.
		$response = new \WP_REST_Response($response);

		return $response;

	}

	/**
	 * Callback for the update options endpoint.
	 * 
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function update_options( \WP_REST_Request $request ) {

		// Get the data and sanitize.
		$mobile_max_threshold = absint( $request->get_param( 'mobile_max_threshold' ) );
		$tablet_max_threshold = absint( $request->get_param( 'tablet_max_threshold' ) );

		// Update the options.
		update_option( 'mobile_max_threshold', $mobile_max_threshold );
		update_option( 'tablet_max_threshold', $tablet_max_threshold );

		// Generate new CSS.
		Pattern_Friend_Render::dynamic_css_file($mobile_max_threshold, $tablet_max_threshold);

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

