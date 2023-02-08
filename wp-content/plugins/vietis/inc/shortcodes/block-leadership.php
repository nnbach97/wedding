<?php
  global $registerBlock;
  $registerBlock[] = [
    'block_type' => 'create-block/leadership',
    'callback' => 'vietis_shortcode_block_leadership'
  ];

  function vietis_shortcode_block_leadership($atts, $content) {
    $title = vietis_func_check_data('title', $atts, '<strong>Meet Our Leadership Team</strong>');
    $title_shadow = vietis_func_check_data('title_shadow', $atts, 'Team');
    $config = vietis_func_check_data('config', $atts, []);
    $config = vietis_func_process_config_block($config);
    $style_block = vietis_func_check_data('style_block', $config, '');
    $blocks = vietis_func_check_data('blocks', $atts, [
      [
        "icon" => [
          "url" => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/leadership/leadership_img01.png",
          "alt" => "",
          "id" => "",
        ],
        "title" => "<strong>Dang Dieu Linh</strong>",
        "desc" => "VIETIS President & CEO",
      ],
      [
        "icon" => [
          "url" => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/leadership/leadership_img02.png",
          "alt" => "",
          "id" => "",
        ],
        "title" => "<strong>Nguyen Ngoc Tan</strong>",
        "desc" => "VIETIS Vice-Director & VIETIS Solution President",
      ],
      [
        "icon" => [
          "url" => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/leadership/leadership_img03.png",
          "alt" => "",
          "id" => "",
        ],
        "title" => "<strong>Nguyen Truong Giang</strong>",
        "desc" => "VIETIS CPO & VIETIS Solution CEO",
      ],
      [
        "icon" => [
          "url" => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/leadership/leadership_img04.png",
          "alt" => "",
          "id" => "",
        ],
        "title" => "<strong>Tran Tri Dung</strong>",
        "desc" => "VIETIS COO & QA Manager",
      ],
      [
        "icon" => [
          "url" => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/leadership/leadership_img05.png",
          "alt" => "",
          "id" => "",
        ],
        "title" => "<strong>Le Tuan Anh</strong>",
        "desc" => "VIETIS BU2 Director",
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
            $ttl = vietis_func_check_data('title', $value, "Your title", true);
            $des = vietis_func_check_data('des', $value, "Your description", true);
            $image = vietis_func_check_data('icon', $value);
            $image_url = vietis_func_check_data('url', $image, VIETIS_IMAGE_DEFAULT, true);
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
