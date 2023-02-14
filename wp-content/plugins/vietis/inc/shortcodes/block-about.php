<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/about',
  'callback' => 'wedding_shortcode_block_about'
];

function wedding_shortcode_block_about($atts, $content) {
  $title = wedding_func_check_data('title', $atts, '<strong>Why wedding?</strong>');
  $title_shadow = wedding_func_check_data('title_shadow', $atts, 'About');
  $config = wedding_func_check_data('config', $atts, []);
  $config = wedding_func_process_config_block($config);
  $style_block = wedding_func_check_data('style_block', $config, '');

  $items = wedding_func_check_data('items', $atts, [
    [
      "icon" => [
        "url" =>
          P_wedding_RESOURCE_HOST . "/assets/img/blocks/about/about_img01.png",
        "alt" => "",
        "id" => "",
      ],
      "ttl" => "<strong>Certified technical staff</strong>",
      "txt" => "Highly selected vendors from our rapidly expanding vendor ecosystem",
      "color" => "#F3F4FD",
    ],
    [
      "icon" => [
        "url" =>
          P_wedding_RESOURCE_HOST . "/assets/img/blocks/about/about_img02.png",
        "alt" => "",
        "id" => "",
      ],
      "ttl" => "<strong>Instant deployment</strong>",
      "txt" => "Using data-driven matching and improved profile creation",
      "color" => "#EDFAFE",
    ],
    [
      "icon" => [
        "url" =>
          P_wedding_RESOURCE_HOST . "/assets/img/blocks/about/about_img03.png",
        "alt" => "",
        'id' => "",
      ],
      "ttl" => "<strong>Business simplicity</strong>",
      'txt' => "An efficient platform for the full remote employee augmentation process",
      "color" => "#EBF5FF",
    ],
  ]);

  ob_start(); ?>
    <div class="block block-about" style="<?= esc_attr($style_block); ?>">
      <div class="holder">
        <div class="title text-center">
          <h3 class="ttl"><?= $title; ?></h3>
          <span class="shadow"><?= $title_shadow; ?></span>
        </div>
        <?php if ($items): ?>
        <div class="wrapper-item">
          <?php foreach ($items as $key => $item): ?>
            <?php
              $ttl = wedding_func_check_data('ttl', $item, '');
              if (!$ttl) continue;
              $txt = wedding_func_check_data('txt', $item, '');
              $icon = wedding_func_check_data('icon', $item, '');
              $color = wedding_func_check_data('color', $item, '#F3F4FD');
              $id = wedding_func_check_data('id', $icon, '');
              $alt = wedding_func_check_data('alt', $icon, '');
              if ($id) {
                $url = wedding_func_get_attachment_image($id);
              } else {
                $url = wedding_func_check_data('url', $icon);
                if (!$url) $url= wedding_IMAGE_DEFAULT;
              }
            ?>
            <div class="item wow fadeInLeftBig" data-wow-delay="<?= $key * 0.4?>s" style="--color-background: <?= $color; ?>;">
              <div class="wrap">
              <div class="icon">
                <img src="<?= $url; ?>" alt="<?= $alt; ?>" class="img">
              </div>
              <div class="text">
                <div class="ttl"><?= $ttl; ?></div>
                <div class="txt"><?= $txt; ?></div>
              </div>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
        <?php endif; ?>
      </div>
    </div>
  <?php
  return ob_get_clean();
}
