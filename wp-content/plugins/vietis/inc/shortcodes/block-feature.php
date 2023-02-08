<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/feature',
  'callback' => 'vietis_shortcode_block_feature'
];

function vietis_shortcode_block_feature($atts, $content)
{
  $title = vietis_func_check_data('title', $atts, '<strong>Scale Up your tech team though out</strong>');
  $title_highlight = vietis_func_check_data('title_highlight', $atts, '<strong>highly skilled developers</strong>');
  $title_shadow = vietis_func_check_data('title_shadow', $atts, 'Feature');
  $image = vietis_func_check_data('image', $atts, [
    "url" => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/feature/feature_img.png",
    'alt' => '',
    'id' => '',
  ]);
  $description = vietis_func_check_data('description', $atts, 'VietIS specializing in providing digital transformation consulting services and software solutions in many domains. We have a highly experienced in house technical team which provides enterprise-level IT consulting design, procurement, and support to customers.');

  ob_start(); ?>
  <div class="block block-feature">
    <div class="holder feature-inner">
      <div class="wrap">
        <div class="content wow slideInLeft">
          <div class="title">
            <h3 class="ttl"><span class="ttl-txt"><?= $title; ?></span><br /><span class="ttl--highlight"><?= $title_highlight; ?></span></h3>
            <span class="shadow"><?= $title_shadow; ?></span>
          </div>
          <div class="block-content des"><?= $description; ?></div>
        </div>
        <img class="img wow slideInRight" src="<?= $image['url']; ?>" alt="">
      </div>
    </div>
  </div>
<?php
  return ob_get_clean();
}
