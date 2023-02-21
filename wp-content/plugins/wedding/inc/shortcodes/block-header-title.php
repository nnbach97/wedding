<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/header-title',
  'callback' => 'wedding_shortcode_block_header_title'
];

function wedding_shortcode_block_header_title($atts, $content)
{
  $title = wedding_func_check_data('title', $atts, "<strong>Chuyện Tình Yêu</strong>");
  $txt = wedding_func_check_data('txt', $atts, 'Tình yêu không làm cho thế giới quay tròn. Tình yêu là những gì làm cho chuyến đi đáng giá.');

  ob_start(); ?>

<div class="block block-header-title">
  <div class="holder">
      <div class="title text-center">
        <h3 class="ttl"><?= $title; ?></h3>
        <p class="txt"><?= $txt; ?></p>
      </div>
  </div>
</div>

<?php
  return ob_get_clean();
}
