<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/feedback',
  'callback' => 'vietis_shortcode_block_feedback'
];

function vietis_shortcode_block_feedback($atts, $content)
{
  $title = vietis_func_check_data('title', $atts, '<strong>HEAR FROM OUR USER</strong>');
  $title_shadow = vietis_func_check_data('title_shadow', $atts, 'Feedback');
  $config = vietis_func_check_data('config', $atts, []);
  $config = vietis_func_process_config_block($config);
  $style_block = vietis_func_check_data('style_block', $config, '');
  $items = vietis_func_check_data('items', $atts, [
      [
        'icon' => [
          'url' => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/feedback/feedback_avt.png",
          'alt' => '',
          'id' => '',
        ],
        'text' => "VietIS is known as an offshore company. There were quite a few offshore vendors exhibiting there, and honestly, it was difficult to decide which company was better. At this time, I had a chance to know and talk with Mr. Tan- Vice President of VietIS. I could see that he has a high level of technical capabilities and a fast capability to handle. There’s no doubt that Mr. Tan’s Japanese capability is an important element that made me choose VietIS to develop my product.To be honest, I felt that there was a gap in developers’ technical capabilities. But that is covered by other more experienced staff members, even if the program isn’t at a level that meets our requirements. Senior developers can follow instantly.",
        'name'=> "First Inc.",
      ],
      [
        'icon' => [
          'url' => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/feedback/feedback_avt.png",
          'alt' => '',
          'id' => '',
        ],
        'text' => "VietIS is known as an offshore company. There were quite a few offshore vendors exhibiting there, and honestly, it was difficult to decide which company was better. At this time, I had a chance to know and talk with Mr. Tan- Vice President of VietIS. I could see that he has a high level of technical capabilities and a fast capability to handle. There’s no doubt that Mr. Tan’s Japanese capability is an important element that made me choose VietIS to develop my product.To be honest, I felt that there was a gap in developers’ technical capabilities. But that is covered by other more experienced staff members, even if the program isn’t at a level that meets our requirements. Senior developers can follow instantly.",
        'name'=> "First Inc.",
      ],
      [
        'icon' => [
          'url' => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/feedback/feedback_avt.png",
          'alt' => '',
          'id' => '',
        ],
        'text' => "VietIS is known as an offshore company. There were quite a few offshore vendors exhibiting there, and honestly, it was difficult to decide which company was better. At this time, I had a chance to know and talk with Mr. Tan- Vice President of VietIS. I could see that he has a high level of technical capabilities and a fast capability to handle. There’s no doubt that Mr. Tan’s Japanese capability is an important element that made me choose VietIS to develop my product.To be honest, I felt that there was a gap in developers’ technical capabilities. But that is covered by other more experienced staff members, even if the program isn’t at a level that meets our requirements. Senior developers can follow instantly.",
        'name'=> "First Inc.",
      ],
  ]);

  $style_block = vietis_func_check_data('style_block', $config, '');

  ob_start(); ?>

  <div class="block block-feedback" style="<?= esc_attr($style_block); ?>">
    <div class="holder">
      <div class="wrapper">
        <div class="img">
          <img src="<?= P_VIETIS_RESOURCE_HOST . '/assets/img/blocks/feedback/feedback_img01.png' ?>" alt="">
        </div>
        <div class="content">
          <div class="title">
            <h3 class="ttl"><?= $title; ?></h3>
            <span class="shadow"><?= $title_shadow; ?></span>
          </div>
          <?php if ($items) : ?>
            <div class="slider js-slick-feedback">
              <?php foreach ($items as $key => $item) : ?>
                <?php
                $text = vietis_func_check_data('text', $item, '');
                if (!$text) continue;
                $name = vietis_func_check_data('name', $item, '');
                $icon = vietis_func_check_data('icon', $item, '');
                $id = vietis_func_check_data('id', $icon, '');
                $alt = vietis_func_check_data('alt', $icon, '');
                if ($id) {
                  $url = vietis_func_get_attachment_image($id);
                } else {
                  $url = vietis_func_check_data('url', $icon);
                  if (!$url) $url = VIETIS_IMAGE_DEFAULT;
                }
                ?>
                <div class="item">
                  <p class="txt"><?= $text; ?></p>
                  <div class="author">
                    <img src="<?= $url; ?>" alt="<?= $alt; ?>" alt="" class="avt">
                    <span class="name"><?= $name; ?></span>
                  </div>
                </div>
              <?php endforeach; ?>
            </div>
        </div>
      <?php endif; ?>
      </div>
    </div>
  </div>

<?php
  return ob_get_clean();
}
