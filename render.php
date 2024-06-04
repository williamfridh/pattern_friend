<?php

/**
 * The render class.
 * 
 * This class defines all code necessary for rendering the block.
 * 
 * NOTES:
 * 1. This file in concidered as safe. No user checks are needed.
 */

namespace pattern_friend;

if ( ! defined( 'ABSPATH' ) ) { exit; }

class Pattern_Friend_Render {

	/**
	 * Add the device visibility wrapper to the block content.
	 * 
	 * @param string $block_content The block content.
	 * @param array $block The block.
	 * @return string The block content.
	 */
	public static function device_visibility_wrapper($block_content, $block) {
	
		// Collect attributes.
		$attributes = $block['attrs'];
		$pf_hide_on_mobile = isset($attributes['pf_hide_on_mobile']) ? $attributes['pf_hide_on_mobile'] : false;
		$pf_hide_on_tablet = isset($attributes['pf_hide_on_tablet']) ? $attributes['pf_hide_on_tablet'] : false;
		$pf_hide_on_computer = isset($attributes['pf_hide_on_computer']) ? $attributes['pf_hide_on_computer'] : false;
	
		// Wrap the block content with the visibility classes based on the attributes,
		// if any of the attributes are set to true.
		if ($pf_hide_on_mobile || $pf_hide_on_tablet || $pf_hide_on_computer) {
			$wrapperElementClasses = '';
			if ($pf_hide_on_mobile) $wrapperElementClasses .= ' pf-hide-on-mobile';
			if ($pf_hide_on_tablet) $wrapperElementClasses .= ' pf-hide-on-tablet';
			if ($pf_hide_on_computer) $wrapperElementClasses .= ' pf-hide-on-desktop';
			$block_content = '<div class="' . esc_attr($wrapperElementClasses) . '">' . $block_content . '</div>';
		}
	
		// Return the block content.
		return $block_content;
	}

	/**
	 * Generate the dynamic CSS file.
	 * 
	 * @param int $mobile_max_threshold The mobile max threshold.
	 * @param int $tablet_max_threshold The tablet max threshold.
	 * @return void
	 */
	public static function dynamic_css_file($mobile_max_threshold, $tablet_max_threshold) {

		// Get the plugin directory path.
		$plugin_dir_path = plugin_dir_path( __FILE__ );

		// Load template.
		$css_template = wp_remote_get($plugin_dir_path . 'dynamic.template.css');

		// Check if the template was loaded successfully.
		if ($css_template === false) {
			// Handle error...
			// TODO: Handle error.
		}

		// Replace placeholders with actual values.
		$css_template = str_replace('/*MOBILE_MAX_THRESHOLD*/', $mobile_max_threshold, $css_template);
		$css_template = str_replace('/*TABLET_MIN_THRESHOLD*/', $mobile_max_threshold + 1, $css_template);
		$css_template = str_replace('/*TABLET_MAX_THRESHOLD*/', $tablet_max_threshold, $css_template);
		$css_template = str_replace('/*COMPUTER_MIN_THRESHOLD*/', $tablet_max_threshold + 1, $css_template);

		// Save the new CSS file.
		$result = WP_Filesystem_Direct::put_contents($plugin_dir_path . 'dynamic.css', $css_template);

		// Check if the file was saved successfully.
		if ($result === false) {
			// Handle error...
			// TODO: Handle error.
		}

	}

}

