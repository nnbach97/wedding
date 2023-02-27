<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/couple',
  'callback' => 'wedding_shortcode_block_couple'
];

function wedding_shortcode_block_couple($atts, $content) {
  $title = wedding_func_check_data('title', $atts, '<strong>Cô dâu & Chú rể</strong>');
  $title_shadow = wedding_func_check_data('title_shadow', $atts, 'Services');
  $config = wedding_func_check_data('config', $atts, []);
  $config = wedding_func_process_config_block($config);
  $style_block = wedding_func_check_data('style_block', $config, '');
  $items = wedding_func_check_data('items', $atts, [
    [
      "image" => [
        "url" => P_wedding_RESOURCE_HOST . '/assets/img/blocks/couple/bach.png',
        "alt" => "",
        "id" => ""
      ],
      "ttl" => "Ngô Ngọc Bách",
      "txt" => "Đẹp trai có tài ăn nói :D",
      "link" => "https://www.facebook.com/nngocbach"
    ],
    [
      "image" => [
        "url" => P_wedding_RESOURCE_HOST . '/assets/img/blocks/couple/trang.png',
        "alt" => "",
        "id" => ""
      ],
      "ttl" => "Trần Thị Huyền Trang",
      "txt" => "Xinh gái nhưng hay dỗi người yêu :D",
      "link" => "https://www.facebook.com/profile.php?id=100011665988271"
    ],
  ]);
  $txt = wedding_func_check_data('txt', $atts, 'Tình yêu là điều kiện trong đó hạnh phúc của người khác là điều cần thiết cho chính bạn.');

  ob_start(); ?>

  <div class="block block-couple" id="couple" style="<?= esc_attr($style_block); ?>">
    <div class="holder">
      <div class="title text-center">
        <h3 class="ttl"><?= $title; ?></h3>
        <p class="txt"><?= $txt; ?></p>
      </div>
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
                  <div class="heading">
                    <p>
                      <a href="<?= $link ?>" class="link">
                        <?= $ttl ?>
                      </a>
                    </p>
                  </div>
                  <div class="txt"><?= $txt ?></div>
                </div>
              </div>
            </div>
          <?php endforeach ?>
        <?php endif ?>
      </div>
    </div>

    <div class="message">
      <div class="holder">
        <div class="message-content">
          <a href="#rsvp" class="message-content-lnk">
            <span class="content-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat" viewBox="0 0 16 16">
                <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"></path>
              </svg>
                Gửi lời chúc
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>
  <div id="story"></div>

  <?php
  return ob_get_clean();
}
