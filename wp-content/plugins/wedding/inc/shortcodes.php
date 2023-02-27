<?php

$registerBlock = [];

// wedding_include('inc/shortcodes/block-leadership.php');
// -----------------------
wedding_include('inc/shortcodes/block-services-new.php');
wedding_include('inc/shortcodes/block-banner-new-img.php');
wedding_include('inc/shortcodes/block-service-head.php');
wedding_include('inc/shortcodes/block-banner-common.php');
wedding_include('inc/shortcodes/block-header-title.php');
wedding_include('inc/shortcodes/block-feature-service-page.php');
wedding_include('inc/shortcodes/block-clients.php');
wedding_include('inc/shortcodes/block-contact.php');

add_action('init', function () {
  if (!function_exists('register_block_type')) return;
  global $registerBlock;
  if (!$registerBlock) return;
  foreach ($registerBlock as $key => $value) {
    $blockType = isset($value['block_type']) && $value['block_type'] ? $value['block_type'] : '';
    $callback = isset($value['callback']) && $value['callback'] ? $value['callback'] : '';
    if (!$blockType || !$callback) continue;
    register_block_type($blockType, array(
      'render_callback' => $callback,
    ));
  }
});
