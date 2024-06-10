<?php

/**
 * The render class.
 * 
 * This class defines all code necessary for rendering the block.
 * 
 * NOTES:
 * 1. This file in concidered as safe. No user checks are needed.
 */

namespace PatternFriend;

if ( ! defined( 'ABSPATH' ) ) { exit; }

if ( ! function_exists( 'request_filesystem_credentials' ) ) {
	if ( ! require_once ABSPATH . 'wp-admin/includes/file.php' ) {
		// Handle the error.
	}
}

class CSSGenerator {

	private $wp_filesystem;
	private $plugin_dir_path;
	private $css_folder_path;
	private $template_file_path;
	private $target_file_path;

    /**
     * Constructor.
     */
    public function __construct() {

		// Get the plugin directory path.
		$this->plugin_dir_path = plugin_dir_path( __FILE__ );

		// Get CSS folder path.
		$this->css_folder_path = $this->plugin_dir_path . 'src/styles/';

		// Set the template file path.
		$this->template_file_path = $this->css_folder_path . 'dynamic.template.css';

		// Set the target file path.
		$this->target_file_path = $this->css_folder_path . 'dynamic.css';

		// Initialize the filesystem.
		$creds = request_filesystem_credentials( site_url() );
		
		if ( ! WP_Filesystem( $creds ) ) {
			// If the filesystem initialization fails, handle the error appropriately.
			return;
		}

		// Get the global filesystem object.
		global $wp_filesystem;
		$this->wp_filesystem = $wp_filesystem;
	}

	/**
	 * Check if the file exists.
	 * 
	 * @return bool True if the file exists, false otherwise.
	 */
	public function file_exists() {
		return $this->wp_filesystem->exists( $this->target_file_path );
	}

	/**
	 * Generate the dynamic CSS file.
	 * 
	 * @param int $mobile_max_threshold The mobile max threshold.
	 * @param int $tablet_max_threshold The tablet max threshold.
	 * @param bool $header_sticky The header sticky option.
	 * @return void
	 */
	public function generate($mobile_max_threshold, $tablet_max_threshold, $header_sticky) {

		if ( $this->wp_filesystem->exists( $this->template_file_path ) ) {
			// Get the contents of the file.
			if ( $file_content = $this->wp_filesystem->get_contents( $this->template_file_path ) ) {
				// Success.
			} else {
				// Handle the error if the file cannot be read.
			}
		} else {
			// Handle the error if the file does not exist.
		}

		// Replace placeholders with actual values & CSS.
		$file_content = str_replace('/*MOBILE_MAX_THRESHOLD*/', $mobile_max_threshold, $file_content);
		$file_content = str_replace('/*TABLET_MIN_THRESHOLD*/', $mobile_max_threshold + 1, $file_content);
		$file_content = str_replace('/*TABLET_MAX_THRESHOLD*/', $tablet_max_threshold, $file_content);
		$file_content = str_replace('/*COMPUTER_MIN_THRESHOLD*/', $tablet_max_threshold + 1, $file_content);

		if ( $header_sticky == '1') {
			$header_sticky_css = "
			.wp-site-blocks > header {
				position: sticky;
				top: 0;
				z-index: 1000;
			}
			";
			$file_content = str_replace('/*HEADER_STICKY*/', $header_sticky_css, $file_content);
		}

		// Save the new CSS file.
		if ( ! $this->wp_filesystem->put_contents($this->target_file_path, $file_content) ) {
			// Handle error...
			// TODO: Handle error.
		}

	}

}

