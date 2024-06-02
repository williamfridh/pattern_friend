<?php

namespace wp_pattern_friend;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class WP_Pattern_Friend_Render {

	public static function add_device_visibility_wrapper($block_content, $block) {

		// Check if the block is supported
		if (!in_array($block['blockName'], ['core/paragraph', 'core/image'])) { // replace with your supported blocks
			return $block_content;
		}
	
		// Get the current attributes
		$attributes = $block['attrs'];
		$wp_pf_hide_on_mobile = $attributes['wp_pf_hide_on_mobile'];
		$wp_pf_hide_on_tablet = $attributes['wp_pf_hide_on_tablet'];
		$wp_pf_hide_on_computer = $attributes['wp_pf_hide_on_computer'];
	
		if ($wp_pf_hide_on_mobile || $wp_pf_hide_on_tablet || $wp_pf_hide_on_computer) {
			$wrapperElementClasses = '';
			if ($wp_pf_hide_on_mobile) $wrapperElementClasses .= ' wp-pf-hide-on-mobile';
			if ($wp_pf_hide_on_tablet) $wrapperElementClasses .= ' wp-pf-hide-on-tablet';
			if ($wp_pf_hide_on_computer) $wrapperElementClasses .= ' wp-pf-hide-on-desktop';
			$block_content = '<div class="' . esc_attr($wrapperElementClasses) . '">' . $block_content . '</div>';
		}
	
		return $block_content;
	}

}

