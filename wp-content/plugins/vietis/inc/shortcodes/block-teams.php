<?php
  global $registerBlock;
  $registerBlock[] = [
    'block_type' => 'create-block/teams',
    'callback' => 'vietis_shortcode_block_teams'
  ];

  function vietis_shortcode_block_teams($atts, $content) {
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
        "des" => "VIETIS President & CEO",
      ],
      [
        "icon" => [
          "url" => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/leadership/leadership_img02.png",
          "alt" => "",
          "id" => "",
        ],
        "title" => "<strong>Nguyen Ngoc Tan</strong>",
        "des" => "VIETIS Vice-Director & VIETIS Solution President",
      ],
      [
        "icon" => [
          "url" => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/leadership/leadership_img03.png",
          "alt" => "",
          "id" => "",
        ],
        "title" => "<strong>Nguyen Truong Giang</strong>",
        "des" => "VIETIS CPO & VIETIS Solution CEO",
      ],
      [
        "icon" => [
          "url" => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/leadership/leadership_img04.png",
          "alt" => "",
          "id" => "",
        ],
        "title" => "<strong>Tran Tri Dung</strong>",
        "des" => "VIETIS COO & QA Manager",
      ],
      [
        "icon" => [
          "url" => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/leadership/leadership_img05.png",
          "alt" => "",
          "id" => "",
        ],
        "title" => "<strong>Le Tuan Anh</strong>",
        "des" => "VIETIS BU2 Director",
      ],
    ]);

    ob_start(); ?>
      <div class="block block-teams" style="<?= esc_attr($style_block); ?>">
        <div class="holder">
          <div class="title text-center">
              <h3 class="ttl"><?= $title; ?></h3>
              <span class="shadow"><?= $title_shadow; ?></span>
          </div>
          <div class="wrapper wow fadeInUp">
            <?php foreach($blocks as $item): ?>
              <?php
                $image = vietis_func_check_data('icon', $item);
                $image_url = vietis_func_check_data('url', $image, VIETIS_IMAGE_DEFAULT, true);
                $title = vietis_func_check_data('title', $item, 'Họ và tên', true);
                $desc = vietis_func_check_data('des', $item, 'Mô tả', true);
              ?>
              <div class="wrapper-item">
                <div class="box">
                  <div class="item"
                    <?php if(isset($item['backgroundColor']) && $item['backgroundColor'] != ''):?>
                        style="background: <?=$item['backgroundColor']?>"
                    <?php endif?>
                  >
                    <div class="wrap">
                      <img src="<?= $image_url ?>" alt=""/>
                    </div>

                    <div class="content">
                      <h4 class="ttl"><?=$title?></h4>
                      <p class="txt"><?=$desc?></p>
                    </div>
                  </div>
                </div>
              </div>
            <?php endforeach ?>
          </div>
        </div>
      </div>
  <?php
    return ob_get_clean();
  }?>
