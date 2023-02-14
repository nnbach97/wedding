<?php

/**
 * Zeng setup
 *
 * @package Zeng
 * @since   1.0.0
 */

defined( 'ABSPATH' ) || exit;
define('REGISTER_POST_TYPE', 'works');
define('IMAGES_IS_THUMB', false);
$post_type = explode(',', REGISTER_POST_TYPE);
if ($post_type) {
	define('IMAGES_META_KEY', '_module_image_gallery');
	define('IMAGES_THUMBNAIL_ID', '_thumbnail_id');
	define('IMAGES_PATH', __DIR__);
	define('IMAGES_PATH_HOST', plugin_dir_url( __FILE__ ));
	define('IMAGES_INC_PATH', IMAGES_PATH . '/inc');

	include_once IMAGES_INC_PATH . '/func.php';
	include_once IMAGES_INC_PATH . '/assets.php';
	include_once IMAGES_INC_PATH . '/metaboxs.php';
}
