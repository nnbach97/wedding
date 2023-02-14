<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/casestudy',
  'callback' => 'wedding_shortcode_block_casestudy'
];

function wedding_shortcode_block_casestudy($atts, $content) {
  $config = wedding_func_check_data('config', $atts, []);
  $config = wedding_func_process_config_block($config);
  $conditon_post = wedding_func_check_data('conditon_post', $atts, [
    'post_type' => "Works",
    'posts_per_page' => 3,
    'orderby' => "date",
    'order' => "DESC",
    'highlight_post_only' => "0"
  ]);
  $query = new class_wedding_plugin_get_data_post_casestudy();
  $response = $query->get_post_casestudy([
    'post_type' => wedding_func_check_data('post_type', $conditon_post, 'Works'),
    'posts_per_page' => wedding_func_check_data('posts_per_page', $conditon_post, '3'),
    'orderby' => wedding_func_check_data('orderby', $conditon_post, 'date'),
    'order' => wedding_func_check_data('order', $conditon_post, 'DESC'),
    'highlight_post_only' => wedding_func_check_data('highlight_post_only', $conditon_post, '0')
  ]);
  $res_data = wedding_func_check_data('data', $response);
  $html = wedding_func_check_data('html', $res_data);

  ob_start(); ?>
    <div class="block block-caseStudy"><?=$html?></div>
  <?php
  return ob_get_clean();
}
