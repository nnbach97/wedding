<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/banner-common',
  'callback' => 'wedding_shortcode_block_banner_common'
];

function wedding_shortcode_block_banner_common($atts, $content)
{
  $title = wedding_func_check_data('title', $atts, '<strong>Case Study</strong>');
  $img = wedding_func_check_data('img', $atts, [
    'url' => P_wedding_RESOURCE_HOST . '/assets/img/blocks/casestudy/casestudy_bg.png',
    'alt' => '',
    'id' => '',
  ]);

  ob_start(); ?>

  <!-- Banner -->
  <div class="block common-block-banner js-hero">
    <div class="overlay"></div>
    <div class="banner-bg">
      <img class="img" src="<?= $img['url']; ?>" alt="" />
    </div>
    <div class="banner-inner">
      <h2 class="ttl"><?= $title; ?></h2>
      <?php if (function_exists('wedding_breadcrumb')) echo wedding_breadcrumb(); ?>
    </div>
  </div>
  <!-- END: Banner -->
<?php
  return ob_get_clean();
}
