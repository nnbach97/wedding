<?php

$registerBlock = [];

vietis_include('inc/shortcodes/block-banner.php');
vietis_include('inc/shortcodes/block-feature.php');
vietis_include('inc/shortcodes/block-outsource.php');
vietis_include('inc/shortcodes/block-services.php');
vietis_include('inc/shortcodes/block-about.php');
vietis_include('inc/shortcodes/block-clients.php');
vietis_include('inc/shortcodes/block-feedback.php');
vietis_include('inc/shortcodes/block-teams.php');
vietis_include('inc/shortcodes/block-casestudy.php');
vietis_include('inc/shortcodes/block-overview.php');
vietis_include('inc/shortcodes/block-about-banner.php');
vietis_include('inc/shortcodes/block-guarantee.php');
vietis_include('inc/shortcodes/block-certificate.php');
vietis_include('inc/shortcodes/block-function.php');
vietis_include('inc/shortcodes/block-visinsight-banner.php');
vietis_include('inc/shortcodes/block-visinsight-overview.php');
vietis_include('inc/shortcodes/block-veramine-banner.php');
vietis_include('inc/shortcodes/block-veramine-overview.php');
vietis_include('inc/shortcodes/block-veramine-technology.php');
vietis_include('inc/shortcodes/block-blog-tags.php');
vietis_include('inc/shortcodes/block-blog-featured.php');
vietis_include('inc/shortcodes/block-banner-common.php');
vietis_include('inc/shortcodes/block-developing-mobile.php');
vietis_include('inc/shortcodes/block-development-our-process.php');
vietis_include('inc/shortcodes/block-development-benefit.php');
vietis_include('inc/shortcodes/block-service-head.php');
vietis_include('inc/shortcodes/block-blockchain.php');
vietis_include('inc/shortcodes/block-banner-new.php');
vietis_include('inc/shortcodes/block-leadership.php');
vietis_include('inc/shortcodes/block-services-new.php');
vietis_include('inc/shortcodes/block-banner-service-page.php');
vietis_include('inc/shortcodes/block-banner-new-img.php');
vietis_include('inc/shortcodes/block-thefox.php');
vietis_include('inc/shortcodes/block-process.php');
vietis_include('inc/shortcodes/block-feature-service-page.php');

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
