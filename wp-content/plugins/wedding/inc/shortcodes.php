<?php

$registerBlock = [];

wedding_include('inc/shortcodes/block-banner.php');
wedding_include('inc/shortcodes/block-feature.php');
wedding_include('inc/shortcodes/block-outsource.php');
// wedding_include('inc/shortcodes/block-services.php');
wedding_include('inc/shortcodes/block-about.php');
wedding_include('inc/shortcodes/block-clients.php');
wedding_include('inc/shortcodes/block-feedback.php');
wedding_include('inc/shortcodes/block-teams.php');
wedding_include('inc/shortcodes/block-casestudy.php');
wedding_include('inc/shortcodes/block-overview.php');
wedding_include('inc/shortcodes/block-about-banner.php');
wedding_include('inc/shortcodes/block-guarantee.php');
wedding_include('inc/shortcodes/block-certificate.php');
wedding_include('inc/shortcodes/block-function.php');
wedding_include('inc/shortcodes/block-visinsight-banner.php');
wedding_include('inc/shortcodes/block-visinsight-overview.php');
wedding_include('inc/shortcodes/block-veramine-banner.php');
wedding_include('inc/shortcodes/block-veramine-overview.php');
wedding_include('inc/shortcodes/block-veramine-technology.php');
wedding_include('inc/shortcodes/block-blog-tags.php');
wedding_include('inc/shortcodes/block-blog-featured.php');
wedding_include('inc/shortcodes/block-banner-common.php');
wedding_include('inc/shortcodes/block-developing-mobile.php');
wedding_include('inc/shortcodes/block-development-our-process.php');
wedding_include('inc/shortcodes/block-development-benefit.php');
wedding_include('inc/shortcodes/block-service-head.php');
wedding_include('inc/shortcodes/block-blockchain.php');
wedding_include('inc/shortcodes/block-banner-new.php');
wedding_include('inc/shortcodes/block-leadership.php');
wedding_include('inc/shortcodes/block-services-new.php');
wedding_include('inc/shortcodes/block-banner-service-page.php');
wedding_include('inc/shortcodes/block-banner-new-img.php');
wedding_include('inc/shortcodes/block-thefox.php');
wedding_include('inc/shortcodes/block-header-title.php');
wedding_include('inc/shortcodes/block-process.php');
wedding_include('inc/shortcodes/block-feature-service-page.php');

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
