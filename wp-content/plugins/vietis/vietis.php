<?php
/**
 * Plugin Name:       wedding
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wedding
 *
 * @package           create-block
 */

add_action('init', function () {
    if (!session_id()) session_start();
});

define('P_wedding_RESOURCE_HOST', plugin_dir_url( __FILE__ ));
define('KEY_COUNT_VIEW', '_key_count_view');
define('wedding_POST_TYPE_SERVICES', 'services');
define('wedding_POST_TYPE_WORKS', 'works');
define('wedding_TAXONOMY_TECHNOLOGY', 'technology');
define('wedding_TAXONOMY_WORKS_CATEGORY', 'work-category');
define('wedding_TAXONOMY_WORKS_TAG', 'work-tag');
define('wedding_TAXONOMY_SCOPE', 'scope');
define('wedding_IMAGE_DEFAULT', P_wedding_RESOURCE_HOST . '/assets/img/image-default.png');

function wedding_plugin_root()
{
  return __DIR__;
}

function pr($value) {
  echo "<pre>";
    if (is_bool($value)) {
      var_dump($value);
    } else {
      print_r($value);
    }
  echo "</pre>";
}

function wedding_include($relpath)
{
  $path = wedding_plugin_root() . '/' . $relpath;
  if (!file_exists($path)) {
    $message = 'File not found: ' . $path;
    if ('cli' !== PHP_SAPI) {
      error_log(sprintf('[wedding.debug] Failed on wedding_include(%s). !file_exists(%s)', var_export($relpath, true), var_export($path, true)), 0);
    }
    throw new Exception($message . '; additionally src/error/Exception.php not loadable');
  }
  return include $path;
}

wedding_include('inc/funcs.php');
wedding_include('inc/class.php');
wedding_include('inc/modules.php');
wedding_include('inc/api.php');
wedding_include('inc/theme_option.php');
wedding_include('inc/assets.php');
wedding_include('inc/hooks.php');
wedding_include('inc/shortcodes.php');
wedding_include('inc/posttype.php');
wedding_include('inc/metabox.php');
wedding_include('inc/helper.php');
wedding_include('inc/customizes.php');
wedding_include('inc/data.php');
