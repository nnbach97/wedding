<?php
require get_template_directory() . '/inc/theme_data.php';
?>

<?php get_header(); /* Template Name: Template Contact */ ?>

<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
    <!-- Banner -->
    <div class="block common-block-banner js-hero">
      <div class="overlay"></div>
      <div class="banner-bg">
        <?= vietis_func_get_thumbnail('full'); ?>
      </div>
      <div class="banner-inner">
        <h2 class="ttl"><?= __("Contact us", "vietis") ?></h2>
        <?php if (function_exists('vietis_breadcrumb')) echo vietis_breadcrumb(); ?>
      </div>
    </div>
    <!-- END: Banner -->

    <!-- Get In touch -->
    <div class="block block-intouch">
      <div class="holder intouch-inner">
        <img src="<?= RESOURCE_HOST . '/img/intouch.svg' ?>" alt="" class="img">
        <div class="intouch-content">
          <div class="ttl"><?= __("Get In Touch", "vietis") ?></div>
          <p class="des"><?= __("If you want to know how VietIS can be of service to you, please fill out this form to get in touch with our expert team.", "vietis") ?></p>
          <div class="contact">
            <img src="<?= RESOURCE_HOST . '/img/email-icon.png' ?>" alt="" class="img">
            <div class="content">
              <div class="ttl"><?= __("MAIL", "vietis") ?>:</div>
              <a href="mailto:<?= $contact_email ?>" class="lnk"><?= $contact_email ?></a>
            </div>
          </div>
          <div class="contact mt-0">
            <img src="<?= RESOURCE_HOST . '/img/phone-icon.png' ?>" alt="" class="img">
            <div class="content">
              <div class="ttl"><?= __("Phone Number", "vietis") ?>:</div>
              <a href="tel:<?= $phone_vi ?>" class="lnk"><?= $phone_vi ?></a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- END: Get In touch -->

    <!-- Form -->
    <form action="" class="holder form-contact js-form-contact" method="POST">
      <input class="form__control" type="hidden" name="action" value="contact_mail">
      <div class="group-input">
        <div class="group-input-item inquiry-group required">
          <label class="label"><?= __("Inquiry type", "vietis") ?></label>
          <div class="group-checkbox">
            <?= render_inquiry_type(); ?>
          </div>
        </div>
        <?= render_input_type(); ?>
        <div class="group-input-item required input-captcha">
          <div class="wrap">
            <label for="captcha" class="label"><?= __('Captcha', 'vietis') ?></label>
            <input id="captcha" required="required" value="" type="text" name="captcha" class="form-control" placeholder="">
          </div>
          <div class="img-wrap">
            <img class="js-img-captcha" src="<?= RESOURCE_HOST . '/captcha.php' ?>" alt="">
          </div>
        </div>
      </div>
      <button type="submit" class="form-btn"><?= __("Send", "vietis") ?></button>
    </form>
    <!-- END: Form -->
    <div class="ttl footer_text"><?= __("Thank you for your interest!", "vietis") ?></div>

    <!-- Modal -->
    <div class="modal modal-contact js-modal-contact">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <div class="icon-box">
              <img class="icon-box--img" src="<?= RESOURCE_HOST . '/img/ico_check.svg' ?>" alt="">
            </div>
            <h4 class="modal-title w-100"><?= __("Failed", "vietis") ?></h4>
          </div>
          <div class="modal-body">
            <p class="message"><?= __("Invalid email address", "vietis") ?></p>
          </div>
          <div class="modal-close">
            <button type="button" class="close-contact close-contact--btn"><?= __("Close", "vietis") ?></button>
          </div>
        </div>
      </div>
    </div>
    <!-- END: Modal -->

<?php endwhile;
endif; ?>
<?php get_footer(); ?>
