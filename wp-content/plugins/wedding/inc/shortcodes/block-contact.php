<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/contact',
  'callback' => 'wedding_shortcode_block_contact'
];

function wedding_shortcode_block_contact($atts, $content)
{
  $title = wedding_func_check_data('title', $atts, "<strong>Sổ Lưu Bút</strong>");
  $txt = wedding_func_check_data('txt', $atts, 'Tôi yêu bạn vì tất cả những gì bạn đang có, tất cả những gì bạn đã có, và tất cả những gì bạn chưa hiện hữu.');
  $img = wedding_func_check_data('img', $atts, [
    'url' => P_wedding_RESOURCE_HOST . '/assets/img/blocks/casestudy/banner_bg_common_story.jpg',
    'alt' => '',
    'id' => '',
  ]);
  ob_start(); ?>

<div class="block block-contact" style="
  background: url(<?= $img['url']; ?>) no-repeat;
  background-position: center;
  background-size: cover;
">
  <div class="holder">
    <div class="title text-center">
      <h3 class="ttl"><?= $title; ?></h3>
      <p class="txt"><?= $txt; ?></p>
    </div>

    <div class="main">
      <form action="" class="form-contact js-form-contact" method="POST">
        <p class="ttl">Cảm ơn bạn rất nhiều vì đã gửi những lời chúc mừng tốt đẹp nhất đến đám cưới của chúng tôi!</p>
        <input class="form__control" type="hidden" name="action" value="contact_mail">
        <div class="group-input">
          <?= render_input_type(); ?>
        </div>
        <button type="submit" class="form-btn"><?= __("Gửi lời chúc", "wedding") ?></button>
      </form>
      <div class="card">
      </div>
    </div>
  </div>
</div>

<?php
  return ob_get_clean();
}
