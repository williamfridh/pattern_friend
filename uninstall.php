<?php

/**
 * Uninstall.
 * 
 * Since no files are generate outside the plugin directory,
 * no files needs deleting.
 * 
 * What this function must do:
 * 1. Delete options.
 */

 // Remove options.
delete_option('pf_mobile_max_threshold');
delete_option('pf_tablet_max_threshold');
delete_option('pf_header_sticky');