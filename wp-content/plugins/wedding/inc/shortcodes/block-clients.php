<?php
  global $registerBlock;
  $registerBlock[] = [
    'block_type' => 'create-block/clients',
    'callback' => 'wedding_shortcode_block_clients'
  ];

  function wedding_shortcode_block_clients($atts, $content)
  {
    $title = wedding_func_check_data('title', $atts, "<strong>Album Hình Cưới</strong>");
    $txt = wedding_func_check_data('txt', $atts, 'Tôi có thể chinh phục thế giới bằng một tay miễn là bạn đang nắm tay kia.');
    $images = wedding_func_check_data('images', $atts, []);
    $config = wedding_func_check_data('config', $atts, []);
    $config = wedding_func_process_config_block($config);
    $style_block = wedding_func_check_data('style_block', $config, '');
    ob_start();
?>
  <div class="block block-clients" id="gallery" style="<?= esc_attr($style_block); ?>">
    <div class="holder">
      <div class="title text-center">
        <h3 class="ttl"><?= $title; ?></h3>
        <p class="txt"><?= $txt; ?></p>
      </div>
      <div class="btn">
        <a class="btn-lnk" href="/album/">Xem Album</a>
      </div>
      <div class="wrapper-item">
        <?php foreach($images as $key => $image): ?>
          <?php
            $url = wedding_func_check_data('url', $image, '');
            if ($url):
          ?>
            <div class="item wow fadeInUp item-<?= $key + 1 ?>" data-wow-delay="<?= $key * 0.1?>">
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
