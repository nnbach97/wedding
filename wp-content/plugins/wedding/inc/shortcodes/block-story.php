<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/story',
  'callback' => 'wedding_shortcode_block_story'
];

function wedding_shortcode_block_story($atts, $content)
{
  $title = wedding_func_check_data('ttl', $atts, '<strong>Nhập tiêu đề</strong>');
  $text = wedding_func_check_data('txt', $atts, 'Nhập nội dung');
  $image = wedding_func_check_data('image', $atts, [
    "url" => P_wedding_RESOURCE_HOST . "/assets/img/image-default.png",
    'alt' => '',
    'id' => '',
  ]);
  $reverse = wedding_func_check_data('reverse', $atts, 'left');
  $config = wedding_func_check_data('config', $atts, []);
  $config = wedding_func_process_config_block($config);
  $style_block = wedding_func_check_data('style_block', $config, '');
  $id_raw = wedding_func_check_data('id', $atts, '');
  $date = wedding_func_check_data('date', $atts, 'Nhập ngày DD/MM/YYYY');

  $id = '';
  if($id_raw !== ''){
    $id = 'id="' . $id_raw . '"';
  }

  ob_start(); ?>
  <div class="block-story" <?= $id !== '' ? $id : "" ?>>
    <div class="<?= $reverse === "left" ? "head head--reverse" : "head" ?>">
      <div class="holder">
        <div class="wrap">
          <div class="content" style="<?= esc_attr($style_block); ?>">
            <div class="title">
              <h3 class="ttl"><?= $title; ?></h3>
              <p class="date">--- <?= $date; ?> ---</p>
            </div>
            <p class="txt"><?= $text; ?></p>
          </div>
          <img src="<?= $image['url'] ?>" alt="" class="img">
        </div>
      </div>
    </div>
  </div>

<?php
  return ob_get_clean();
}
