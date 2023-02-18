<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/services-new',
  'callback' => 'wedding_shortcode_block_services_new'
];

function wedding_shortcode_block_services_new($atts, $content) {
  $title = wedding_func_check_data('title', $atts, '<strong>Cô dâu & Chú rể</strong>');
  $title_shadow = wedding_func_check_data('title_shadow', $atts, 'Services');
  $config = wedding_func_check_data('config', $atts, []);
  $config = wedding_func_process_config_block($config);
  $style_block = wedding_func_check_data('style_block', $config, '');
  $items = wedding_func_check_data('items', $atts, [
    [
      "image" => [
        "url" => P_wedding_RESOURCE_HOST . '/assets/img/blocks/service/bach.jpg',
        "alt" => "",
        "id" => ""
      ],
      "ttl" => "Ngô Ngọc Bách",
      "txt" => "Đẹp trai có tài ăn nói :D",
      "link" => "https://www.facebook.com/nngocbach"
    ],
    [
      "image" => [
        "url" => P_wedding_RESOURCE_HOST . '/assets/img/blocks/service/trang.jpg',
        "alt" => "",
        "id" => ""
      ],
      "ttl" => "Trần Thị Huyền Trang",
      "txt" => "Xinh gái nhưng hay dỗi người yêu :D",
      "link" => "https://www.facebook.com/profile.php?id=100011665988271"
    ],
  ]);

  ob_start(); ?>

  <div class="block block-services-new" style="<?= esc_attr($style_block); ?>">
    <div class="holder">
      <div class="title text-center">
        <h3 class="ttl"><?= $title; ?></h3>
        <span class="shadow"><?= $title_shadow; ?></span>
      </div>
      <div class="block-content wow fadeInUp"><?= $content; ?></div>
      <div class="wrapper-item wow fadeInUp">
        <?php if($items): ?>
          <?php foreach($items as $item): ?>
            <?php
              $ttl = wedding_func_check_data('ttl', $item, 'Your heading', true);
              $txt = 	wedding_func_check_data('txt', $item, 'Your description', true);
              $image = wedding_func_check_data('image', $item);
              $image_url = wedding_func_check_data('url', $image, wedding_IMAGE_DEFAULT, true);
              $link = wedding_func_check_data('link', $item, '#', true);
            ?>
            <div class="lnk">
              <div class="item-media">
                <div class="image">
                  <img src="<?= $image_url ?>" alt="">

                  <div class="bride-border-box">
                    <span class="bride-groom-border"></span>
                    <span class="bride-groom-border"></span>
                    <span class="bride-groom-border"></span>
                    <span class="bride-groom-border"></span>
                  </div>
                </div>
                <div class="desc">
                <div class="heading"><p>
                  <a href="<?= $link ?>" class="link">
                    <?= $ttl ?>
                  </a>
                </p></div>
                  <div class="txt"><?= $txt ?></div>
                </div>
              </div>
            </div>
          <?php endforeach ?>
        <?php endif ?>
      </div>
    </div>
  </div>

  <?php
  return ob_get_clean();
}
