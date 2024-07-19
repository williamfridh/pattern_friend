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
		$hide_on_mobile = isset($attributes['pattern_friend_hide_on_mobile']) ? $attributes['pattern_friend_hide_on_mobile'] : false;
		$hide_on_tablet = isset($attributes['pattern_friend_hide_on_tablet']) ? $attributes['pattern_friend_hide_on_tablet'] : false;
		$hide_on_computer = isset($attributes['pattern_friend_hide_on_computer']) ? $attributes['pattern_friend_hide_on_computer'] : false;
	
		/*
		 * Wrap the block content with the visibility classes based on the attributes,
		 * if any of the attributes are set to true.
		 */
		if ($hide_on_mobile || $hide_on_tablet || $hide_on_computer) {
			$wrapperElementClasses = '';
			if ($hide_on_mobile) $wrapperElementClasses .= ' pf-hide-on-mobile';
			if ($hide_on_tablet) $wrapperElementClasses .= ' pf-hide-on-tablet';
			if ($hide_on_computer) $wrapperElementClasses .= ' pf-hide-on-desktop';
			$block_content = '<div class="' . esc_attr($wrapperElementClasses) . '">' . $block_content . '</div>';
		}
	
		// Return the block content.
		return $block_content;
	}

	/**
	 * Attend the hidable groups.
	 * 
	 * Note that groups includes groups, rows, and stacks.
	 * 
	 * Wrap each block with a div element that can be hidden, assign it an id.
	 * 
	 * @param string $block_content The block content.
	 * @param array $block The block.
	 * @return string The block content.
	 */
	public static function hidable_group($block_content, $block) {
		// Get attributes.
		$attributes = $block['attrs'];
		// Check if the block is of typ "core/group".
		if ($block['blockName'] !== 'core/group') {
			return $block_content;
		}
		// Check if the block is hidable.
		$hidable_group = isset($attributes['pattern_friend_hidable_group']) ? $attributes['pattern_friend_hidable_group'] : false;
		// If the block is hidable, wrap it with a div element.
		if ($hidable_group && isset($attributes['pattern_friend_id'])) {
			$block_content = '<div class="pf-hidable" data-block-id="' . $attributes['pattern_friend_id'] . '">' . $block_content . '</div>';
		}
		// Return the block content.
		return $block_content;
	}

	/**
	 * Attend the group hiding buttons.
	 * 
	 * Assigns the button to a javascript function that hides the group
	 * and stores the group id in the choosen way.
	 */
	public static function group_hiding_button($block_content, $block) {
		// Get attributes.
		$attributes = $block['attrs'];
		// Check if the block is of type "core/button".
		if ($block['blockName'] !== 'core/button') {
			return $block_content;
		}
		// Check if the button is a group hiding button.
		$hidable_group_button = isset($attributes['pattern_friend_hidable_group_button']) ? $attributes['pattern_friend_hidable_group_button'] : false;
		// If the button is a group hiding button, put it inside a wrapper bound to a onClick function.
		if ($hidable_group_button) {
			// Get duration.
			$duration = isset($attributes['pattern_friend_hide_duration']) ? $attributes['pattern_friend_hide_duration'] : 24;
			// Wrap the button with a div element.
			$block_content = '<div class="pf-hidable-group-button" onclick="patternFriend.hide(this, ' . $duration . ')">' . $block_content . '</div>';
		}
		// Return the block content.
		return $block_content;
	}

}

