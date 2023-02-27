<?php
  global $registerBlock;
  $registerBlock[] = [
    'block_type' => 'create-block/teams',
    'callback' => 'wedding_shortcode_block_teams'
  ];

  function wedding_shortcode_block_teams($atts, $content) {
    $title = wedding_func_check_data('title', $atts, '<strong>Meet Our Leadership Team</strong>');
    $title_shadow = wedding_func_check_data('title_shadow', $atts, 'Team');
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
        "title" => "<strong>Dang Dieu Linh</strong>",
        "des" => "wedding President & CEO",
      ],
      [
        "icon" => [
          "url" => P_wedding_RESOURCE_HOST . "/assets/img/blocks/leadership/1.png",
          "alt" => "",
          "id" => "",
        ],
        "title" => "<strong>Nguyen Ngoc Tan</strong>",
        "des" => "wedding Vice-Director & wedding Solution President",
      ],
      [
        "icon" => [
          "url" => P_wedding_RESOURCE_HOST . "/assets/img/blocks/leadership/1.png",
          "alt" => "",
          "id" => "",
        ],
        "title" => "<strong>Nguyen Truong Giang</strong>",
        "des" => "wedding CPO & wedding Solution CEO",
      ],
      [
        "icon" => [
          "url" => P_wedding_RESOURCE_HOST . "/assets/img/blocks/leadership/1.png",
          "alt" => "",
          "id" => "",
        ],
        "title" => "<strong>Tran Tri Dung</strong>",
        "des" => "wedding COO & QA Manager",
      ],
      [
        "icon" => [
          "url" => P_wedding_RESOURCE_HOST . "/assets/img/blocks/leadership/1.png",
          "alt" => "",
          "id" => "",
        ],
        "title" => "<strong>Le Tuan Anh</strong>",
        "des" => "wedding BU2 Director",
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
                $image = wedding_func_check_data('icon', $item);
                $image_url = wedding_func_check_data('url', $image, wedding_IMAGE_DEFAULT, true);
                $title = wedding_func_check_data('title', $item, 'Họ và tên', true);
                $desc = wedding_func_check_data('des', $item, 'Mô tả', true);
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
