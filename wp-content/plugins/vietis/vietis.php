<?php
/**
 * Plugin Name:       Vietis
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       vietis
 *
 * @package           create-block
 */

add_action('init', function () {
    if (!session_id()) session_start();
});

define('P_VIETIS_RESOURCE_HOST', plugin_dir_url( __FILE__ ));
define('KEY_COUNT_VIEW', '_key_count_view');
define('VIETIS_POST_TYPE_SERVICES', 'services');
define('VIETIS_POST_TYPE_WORKS', 'works');
define('VIETIS_TAXONOMY_TECHNOLOGY', 'technology');
define('VIETIS_TAXONOMY_WORKS_CATEGORY', 'work-category');
define('VIETIS_TAXONOMY_WORKS_TAG', 'work-tag');
define('VIETIS_TAXONOMY_SCOPE', 'scope');
define('VIETIS_IMAGE_DEFAULT', P_VIETIS_RESOURCE_HOST . '/assets/img/image-default.png');

function vietis_plugin_root()
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

function vietis_include($relpath)
{
  $path = vietis_plugin_root() . '/' . $relpath;
  if (!file_exists($path)) {
    $message = 'File not found: ' . $path;
    if ('cli' !== PHP_SAPI) {
      error_log(sprintf('[vietis.debug] Failed on vietis_include(%s). !file_exists(%s)', var_export($relpath, true), var_export($path, true)), 0);
    }
    throw new Exception($message . '; additionally src/error/Exception.php not loadable');
  }
  return include $path;
}

vietis_include('inc/funcs.php');
vietis_include('inc/class.php');
vietis_include('inc/modules.php');
vietis_include('inc/api.php');
vietis_include('inc/theme_option.php');
vietis_include('inc/assets.php');
vietis_include('inc/hooks.php');
vietis_include('inc/shortcodes.php');
vietis_include('inc/posttype.php');
vietis_include('inc/metabox.php');
vietis_include('inc/helper.php');
vietis_include('inc/customizes.php');
vietis_include('inc/data.php');
