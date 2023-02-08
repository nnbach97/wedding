<?php
  global $registerBlock;
  $registerBlock[] = [
    'block_type' => 'create-block/clients',
    'callback' => 'vietis_shortcode_block_clients'
  ];

  function vietis_shortcode_block_clients($atts, $content)
  {
    $title = vietis_func_check_data('title', $atts, '<strong>Our Clients</strong>');
    $title_shadow = vietis_func_check_data('title_shadow', $atts, 'Clients');
    $images = vietis_func_check_data('images', $atts, []);
    $config = vietis_func_check_data('config', $atts, []);
    $config = vietis_func_process_config_block($config);
    $style_block = vietis_func_check_data('style_block', $config, '');
    ob_start();
?>
    <div class="block block-clients" style="<?= esc_attr($style_block); ?>">
    <div class="holder">
      <div class="title text-center">
        <h3 class="ttl"><?= $title; ?></h3>
        <span class="shadow"><?= $title_shadow; ?></span>
      </div>
      <div class="wrapper-item">
        <?php foreach($images as $key => $image): ?>
          <?php  ?>
          <?php
            $url = vietis_func_check_data('url', $image, '');
            if ($url):
          ?>
            <div class="item wow fadeInUp" data-wow-delay="<?= $key * 0.1?>s">
              <div class="wrap"><img src="<?= $url ?>" alt="" /></div>
            </div>
          <?php endif; ?>
        <?php endforeach; ?>
      </div>
      </div>
  </div>
<?php
  return ob_get_clean();
  }
?>
