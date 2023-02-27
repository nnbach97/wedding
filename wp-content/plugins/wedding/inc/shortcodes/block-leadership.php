<?php
  global $registerBlock;
  $registerBlock[] = [
    'block_type' => 'create-block/leadership',
    'callback' => 'wedding_shortcode_block_leadership'
  ];

  function wedding_shortcode_block_leadership($atts, $content) {
    $title = wedding_func_check_data('title', $atts, '<strong>Ngọc Bách & Huyền Trang</strong>');
    $txt = wedding_func_check_data('txt', $atts, 'Tôi có thể chinh phục thế giới bằng một tay miễn là bạn đang nắm tay kia');
    $config = wedding_func_check_data('config', $atts, []);
    $config = wedding_func_process_config_block($config);
    $style_block = wedding_func_check_data('style_block', $config, '');
    $blocks = wedding_func_check_data('blocks', $atts, [
      [
        "icon" => [
          "url" => P_wedding_RESOURCE_HOST . "/assets/img/blocks/leadership/1.png",
          "alt" => "",
          "id" => "",
        ],
      ],
      [
        "icon" => [
          "url" => P_wedding_RESOURCE_HOST . "/assets/img/blocks/leadership/1.png",
          "alt" => "",
          "id" => "",
        ],
      ],
      [
        "icon" => [
          "url" => P_wedding_RESOURCE_HOST . "/assets/img/blocks/leadership/1.png",
          "alt" => "",
          "id" => "",
        ],
      ],
      [
        "icon" => [
          "url" => P_wedding_RESOURCE_HOST . "/assets/img/blocks/leadership/1.png",
          "alt" => "",
          "id" => "",
        ],
      ],
      [
        "icon" => [
          "url" => P_wedding_RESOURCE_HOST . "/assets/img/blocks/leadership/1.png",
          "alt" => "",
          "id" => "",
        ],
      ],
      [
        "icon" => [
          "url" => P_wedding_RESOURCE_HOST . "/assets/img/blocks/leadership/1.png",
          "alt" => "",
          "id" => "",
        ],
      ],
      [
        "icon" => [
          "url" => P_wedding_RESOURCE_HOST . "/assets/img/blocks/leadership/1.png",
          "alt" => "",
          "id" => "",
        ],
      ],
    ]);
    ob_start();
?>
  <?php if(!empty($blocks)): ?>
  <div class="block block-gallary" style="<?= esc_attr($style_block); ?>">
    <div class="holder">
      <div class="title text-center">
        <h3 class="ttl"><?= $title; ?></h3>
        <h3 class="txt"><?= $txt; ?></h3>
      </div>

      <div class="wrapper-item wow fadeInUp js-slick-gallary">
        <?php foreach($blocks as $key => $value): ?>
          <?php
            $image = wedding_func_check_data('icon', $value);
            $image_url = wedding_func_check_data('url', $image, wedding_IMAGE_DEFAULT, true);
          ?>
          <div class="item">
            <div class="wrap">
              <a class="grouped_elements" rel="group1" href="<?= $image_url ?>">
                <img src="<?= $image_url ?>" alt="">
              </a>
            </div>
          </div>
        <?php endforeach ?>
      </div>
    </div>
  </div>
  <?php endif ?>
  <?php
    return ob_get_clean();
  }?>
