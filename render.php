<?php

namespace wp_pattern_friend;

if ( ! defined( 'ABSPATH' ) ) { exit; }

class WP_Pattern_Friend_Render {

	public static function add_device_visibility_wrapper($block_content, $block) {
	
		// Collect attributes.
		$attributes = $block['attrs'];
		$wp_pf_hide_on_mobile = isset($attributes['wp_pf_hide_on_mobile']) ? $attributes['wp_pf_hide_on_mobile'] : false;
		$wp_pf_hide_on_tablet = isset($attributes['wp_pf_hide_on_tablet']) ? $attributes['wp_pf_hide_on_tablet'] : false;
		$wp_pf_hide_on_computer = isset($attributes['wp_pf_hide_on_computer']) ? $attributes['wp_pf_hide_on_computer'] : false;
	
		// Wrap the block content with the visibility classes based on the attributes,
		// if any of the attributes are set to true.
		if ($wp_pf_hide_on_mobile || $wp_pf_hide_on_tablet || $wp_pf_hide_on_computer) {
			$wrapperElementClasses = '';
			if ($wp_pf_hide_on_mobile) $wrapperElementClasses .= ' wp-pf-hide-on-mobile';
			if ($wp_pf_hide_on_tablet) $wrapperElementClasses .= ' wp-pf-hide-on-tablet';
			if ($wp_pf_hide_on_computer) $wrapperElementClasses .= ' wp-pf-hide-on-desktop';
			$block_content = '<div class="' . esc_attr($wrapperElementClasses) . '">' . $block_content . '</div>';
		}
	
		// Return the block content.
		return $block_content;
	}

}

