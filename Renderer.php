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

class Renderer {

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
	
		/*
		 * Wrap the block content with the visibility classes based on the attributes,
		 * if any of the attributes are set to true.
		 */
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

}

