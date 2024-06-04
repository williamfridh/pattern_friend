<?php

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) { exit; }

// Check if user has permission to access this page.
if (!current_user_can('manage_options')) {
   wp_die( esc_html__( 'You do not have sufficient capabilities to access this page.', 'wp-pattern-friend' ) );
}

?>

<!-- Start of the options page -->
<div class="wrap">
    <!-- React app root -->
    <div id="pf-react-app"></div>
</div>