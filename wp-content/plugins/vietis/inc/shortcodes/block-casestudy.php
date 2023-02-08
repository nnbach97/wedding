<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/casestudy',
  'callback' => 'vietis_shortcode_block_casestudy'
];

function vietis_shortcode_block_casestudy($atts, $content) {
  $config = vietis_func_check_data('config', $atts, []);
  $config = vietis_func_process_config_block($config);
  $conditon_post = vietis_func_check_data('conditon_post', $atts, [
    'post_type' => "Works",
    'posts_per_page' => 3,
    'orderby' => "date",
    'order' => "DESC",
    'highlight_post_only' => "0"
  ]);
  $query = new class_vietis_plugin_get_data_post_casestudy();
  $response = $query->get_post_casestudy([
    'post_type' => vietis_func_check_data('post_type', $conditon_post, 'Works'),
    'posts_per_page' => vietis_func_check_data('posts_per_page', $conditon_post, '3'),
    'orderby' => vietis_func_check_data('orderby', $conditon_post, 'date'),
    'order' => vietis_func_check_data('order', $conditon_post, 'DESC'),
    'highlight_post_only' => vietis_func_check_data('highlight_post_only', $conditon_post, '0')
  ]);
  $res_data = vietis_func_check_data('data', $response);
  $html = vietis_func_check_data('html', $res_data);

  ob_start(); ?>
    <div class="block block-caseStudy"><?=$html?></div>
  <?php
  return ob_get_clean();
}
