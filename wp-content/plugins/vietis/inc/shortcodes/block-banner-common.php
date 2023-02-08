<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/banner-common',
  'callback' => 'vietis_shortcode_block_banner_common'
];

function vietis_shortcode_block_banner_common($atts, $content)
{
  $title = vietis_func_check_data('title', $atts, '<strong>Case Study</strong>');
  $img = vietis_func_check_data('img', $atts, [
    'url' => P_VIETIS_RESOURCE_HOST . '/assets/img/blocks/casestudy/casestudy_bg.png',
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
      <?php if (function_exists('vietis_breadcrumb')) echo vietis_breadcrumb(); ?>
    </div>
  </div>
  <!-- END: Banner -->
<?php
  return ob_get_clean();
}
