<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/services',
  'callback' => 'vietis_shortcode_block_services'
];

function vietis_shortcode_block_services($atts, $content) {
  $title = vietis_func_check_data('title', $atts, '<strong>VietIS Services</strong>');
  $title_shadow = vietis_func_check_data('title_shadow', $atts, 'Services');
  $config = vietis_func_check_data('config', $atts, []);
  $config = vietis_func_process_config_block($config);
  $style_block = vietis_func_check_data('style_block', $config, '');
  $conditon_post = vietis_func_check_data('conditon_post', $atts, [
    'post_type' => "services",
    'posts_per_page' => 4,
    'orderby' => "date",
    'order' => "DESC"
  ]);
  $query = new class_vietis_plugin_get_data_post();
  $response = $query->get_post([
    'post_type' => vietis_func_check_data('post_type', $conditon_post, 'post'),
    'posts_per_page' => vietis_func_check_data('posts_per_page', $conditon_post, '4'),
    'orderby' => vietis_func_check_data('orderby', $conditon_post, 'date'),
    'order' => vietis_func_check_data('order', $conditon_post, 'DESC')
  ]);
  $res_data = vietis_func_check_data('data', $response);
  $html = vietis_func_check_data('html', $res_data);

  ob_start(); ?>
  <div class="block block-services" style="<?= esc_attr($style_block); ?>">
    <div class="holder">
      <div class="title text-center">
        <h3 class="ttl"><?= $title; ?></h3>
        <span class="shadow"><?= $title_shadow; ?></span>
      </div>
      <div class="block-content wow fadeInUp"><?= $content; ?></div>
      <div class="wrapper-item wow fadeInUp"><?= $html; ?></div>
    </div>
  </div>
  <?php
  return ob_get_clean();
}

