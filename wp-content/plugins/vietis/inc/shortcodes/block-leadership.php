<?php
  global $registerBlock;
  $registerBlock[] = [
    'block_type' => 'create-block/leadership',
    'callback' => 'wedding_shortcode_block_leadership'
  ];

  function wedding_shortcode_block_leadership($atts, $content) {
    $title = wedding_func_check_data('title', $atts, '<strong>Meet Our Leadership Team</strong>');
    $title_shadow = wedding_func_check_data('title_shadow', $atts, 'Team');
    $config = wedding_func_check_data('config', $atts, []);
    $config = wedding_func_process_config_block($config);
    $style_block = wedding_func_check_data('style_block', $config, '');
    $blocks = wedding_func_check_data('blocks', $atts, [
      [
        "icon" => [
          "url" => P_wedding_RESOURCE_HOST . "/assets/img/blocks/leadership/leadership_img01.png",
          "alt" => "",
          "id" => "",
        ],
        "title" => "<strong>Dang Dieu Linh</strong>",
        "desc" => "wedding President & CEO",
      ],
      [
        "icon" => [
          "url" => P_wedding_RESOURCE_HOST . "/assets/img/blocks/leadership/leadership_img02.png",
          "alt" => "",
          "id" => "",
        ],
        "title" => "<strong>Nguyen Ngoc Tan</strong>",
        "desc" => "wedding Vice-Director & wedding Solution President",
      ],
      [
        "icon" => [
          "url" => P_wedding_RESOURCE_HOST . "/assets/img/blocks/leadership/leadership_img03.png",
          "alt" => "",
          "id" => "",
        ],
        "title" => "<strong>Nguyen Truong Giang</strong>",
        "desc" => "wedding CPO & wedding Solution CEO",
      ],
      [
        "icon" => [
          "url" => P_wedding_RESOURCE_HOST . "/assets/img/blocks/leadership/leadership_img04.png",
          "alt" => "",
          "id" => "",
        ],
        "title" => "<strong>Tran Tri Dung</strong>",
        "desc" => "wedding COO & QA Manager",
      ],
      [
        "icon" => [
          "url" => P_wedding_RESOURCE_HOST . "/assets/img/blocks/leadership/leadership_img05.png",
          "alt" => "",
          "id" => "",
        ],
        "title" => "<strong>Le Tuan Anh</strong>",
        "desc" => "wedding BU2 Director",
      ],
    ]);
    $countBlocks = count($blocks) >= 5 ? ' hide-dots' : '';
    ob_start();
?>
  <?php if(!empty($blocks)): ?>
  <div class="block block-leadership-new" style="<?= esc_attr($style_block); ?>">
    <div class="holder">
      <div class="title text-center">
        <h3 class="ttl"><?= $title; ?></h3>
        <span class="shadow"><?= $title_shadow; ?></span>
      </div>
      <div class="wrapper-item wow fadeInUp js-slick-teams <?= $countBlocks ?>">
        <?php foreach($blocks as $key => $value): ?>
          <?php
            $ttl = wedding_func_check_data('title', $value, "Your title", true);
            $des = wedding_func_check_data('des', $value, "Your description", true);
            $image = wedding_func_check_data('icon', $value);
            $image_url = wedding_func_check_data('url', $image, wedding_IMAGE_DEFAULT, true);
          ?>
          <div class="item">
            <div class="wrap">
              <img src="<?= $image_url ?>" alt="">
            </div>

            <div class="content">
              <h4 class="ttl"><?=$ttl?></h4>
              <p class="txt"><?=$des?></p>
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
