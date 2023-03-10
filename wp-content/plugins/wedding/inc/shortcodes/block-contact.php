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
    'url' => P_wedding_RESOURCE_HOST . '/assets/img/blocks/story/banner_bg_common_story.jpg',
    'alt' => '',
    'id' => '',
  ]);
  ob_start(); ?>

<div class="block block-contact" id="message" style="
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
          <div class="group-input-item input-message  group-input-item--textarea required">
            <label for="Lời chức mừng" class="label form-label">Lời chức mừng</label>
            <textarea class="form-control" cols="30" rows="5" name="message" autocomplete="off" value="" required></textarea>
            <div class="invalid-feedback"></div>
          </div>
        </div>
        <button type="submit" class="form-btn"><?= __("Gửi lời chúc", "wedding") ?></button>
      </form>
      <div class="card">
        <div class="card-img">
          <img src="<?= RESOURCE_HOST . '/img/ico_bank_bach.png' ?>" alt="QR">
        </div>
        <div class="card-img">
          <img src="<?= RESOURCE_HOST . '/img/ico_bank_trang.png' ?>" alt="QR">
        </div>
      </div>
    </div>

      <!-- Modal -->
      <div class="modal modal-contact js-modal-contact">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <div class="icon-box">
                <img class="icon-box--img" src="<?= RESOURCE_HOST . '/img/thankiu.gif' ?>" alt="">
              </div>
              <h4 class="modal-title w-100"><?= __("Thất bại", "wedding") ?></h4>
            </div>
            <div class="modal-body">
              <p class="message"><?= __("Địa chỉ Email không hợp lệ", "wedding") ?></p>
            </div>
            <div class="modal-close">
              <button type="button" class="close-contact close-contact--btn"><?= __("Close", "wedding") ?></button>
            </div>
          </div>
        </div>
      </div>
      <!-- END: Modal -->
  </div>
</div>

<?php
  return ob_get_clean();
}
