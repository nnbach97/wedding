<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/service-head',
  'callback' => 'vietis_shortcode_block_service_head'
];

function vietis_shortcode_block_service_head($atts, $content)
{
  $title = vietis_func_check_data('ttl', $atts, '<strong>Please Enter Title ..</strong>');
  $text = vietis_func_check_data('txt', $atts, 'Please Enter Content ..');
  $image = vietis_func_check_data('image', $atts, [
    "url" => P_VIETIS_RESOURCE_HOST . "/assets/img/image-default.png",
    'alt' => '',
    'id' => '',
  ]);
  $reverse = vietis_func_check_data('reverse', $atts, 'left');
  $config = vietis_func_check_data('config', $atts, []);
  $config = vietis_func_process_config_block($config);
  $style_block = vietis_func_check_data('style_block', $config, '');
  $id_raw = vietis_func_check_data('id', $atts, '');

  $id = '';
  if($id_raw !== ''){
    $id = 'id="' . $id_raw . '"';
  }

  ob_start(); ?>
  <div class="block-service-page" <?= $id !== '' ? $id : "" ?>>
    <div class="<?= $reverse === "left" ? "head head--reverse" : "head" ?>">
      <div class="holder">
        <div class="wrap">
          <div class="content" style="<?= esc_attr($style_block); ?>">
            <div class="title">
              <h3 class="ttl"><?= $title; ?></h3>
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
