<?php

define('MY_SECURITY_KEY', wp_create_nonce('MY_SECURITY'));
define('RESOURCE_HOST', get_template_directory_uri());
define('PATH_HOST', get_template_directory());
define('URL_AJAX', admin_url('admin-ajax.php'));
define('DATE_FORMAT', 'M d, Y');
define('DATE_FORMAT_WORKS', 'm/Y');
$gglcptch_options = get_option( 'gglcptch_options' );
$secret_key = (isset($gglcptch_options['private_key']) ? $gglcptch_options['private_key'] : '');
$public_key = (isset($gglcptch_options['public_key']) ? $gglcptch_options['public_key'] : '');
define('SECRET_KEY_CAPTCHA', $secret_key);
define('SITE_KEY_CAPTCHA', $public_key);
define('BLOG_PAGE', home_url('blogs'));

require PATH_HOST . '/inc/func.php';
require PATH_HOST . '/inc/hooks.php';
require PATH_HOST . '/inc/assets.php';