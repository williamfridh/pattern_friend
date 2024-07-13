<?php

/**
 * Uninstall.
 * 
 * Since no files are generate outside the plugin directory,
 * no files needs deleting.
 * 
 * What this function must do:
 * 1. Delete options.
 * 
 * More reading:
 * - https://developer.wordpress.org/plugins/plugin-basics/uninstall-methods/
 * - https://developer.wordpress.org/reference/functions/register_uninstall_hook/
 */

// If uninstall.php is not called by WordPress, die.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
    die;
}

// Delete multiple options.
$options = array(
	'pf_mobile_max_threshold',
	'pf_tablet_max_threshold',
	'pf_header_sticky',
);
foreach ($options as $option) {
	if (get_option($option)) delete_option($option);
}