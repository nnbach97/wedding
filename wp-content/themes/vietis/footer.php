<?php
require get_template_directory() . '/inc/theme_data.php';
?>

<footer class="footer">
  <div class="holder footer-inner">
    <div class="wrap">
      <div class="footer-info">
        <div class="item">
          <div class="info">
            <h3 class="ttl"><?= __('VietIS Corporation', 'vietis'); ?></h3>
            <ul class="list">
              <?php if ($address_vi) : ?>
                <li class="item">
                  <img class="img" src="<?= RESOURCE_HOST ?>/img/footer_icon-map.svg" alt="" />
                  <span class="info-text"><?= __($address_vi, "vietis") ?></span>
                </li>
              <?php endif; ?>

              <?php if ($phone_vi) : ?>
                <li class="item">
                  <img class="img" src="<?= RESOURCE_HOST ?>/img/footer_icon-phone.svg" alt="" />
                  <span class="info-text"><a href="tel:<?= $phone_vi ?>" class="lnk"><?= $phone_vi ?></a></span>
                </li>
              <?php endif; ?>

              <?php if ($contact_email) : ?>
                <li class="item">
                  <img class="img img-email" src="<?= RESOURCE_HOST ?>/img/footer_icon-email.svg" alt="" />
                  <span class="info-text"><a href="mailto:<?= $contact_email ?>" class="lnk"><?= $contact_email ?></a></span>
                </li>
              <?php endif; ?>
            </ul>
          </div>
          <div class="info">
            <h3 class="ttl"><?= __('VIETIS Solution', 'vietis'); ?></h3>
            <ul class="list">
              <?php if ($address_jp_01) : ?>
                <li class="item">
                  <img class="img" src="<?= RESOURCE_HOST ?>/img/footer_icon-map.svg" alt="" />
                  <p class="info-text"><?= __($address_jp_01, "vietis") ?></p>
                  <?php if ($address_jp_02) : ?>
                    <p class="info-desc"><?= __($address_jp_02, "vietis") ?></p>

                  <?php endif ?>
                </li>
              <?php endif; ?>

              <?php if ($phone_jp) : ?>
                <li class="item">
                  <img class="img" src="<?= RESOURCE_HOST ?>/img/footer_icon-phone.svg" alt="" />
                  <span class="info-text"><a href="tel:<?= $phone_jp ?>" class="lnk"><?= $phone_jp ?></a></span>
                </li>
              <?php endif; ?>
            </ul>
          </div>
        </div>
        <div class="item">
          <div class="info">
            <h3 class="ttl"><?= __('US Office', 'vietis'); ?></h3>
            <ul class="list">
              <?php if ($address_us) : ?>
                <li class="item">
                  <img class="img" src="<?= RESOURCE_HOST ?>/img/footer_icon-map.svg" alt="" />
                  <span class="info-text"><?= __($address_us, "vietis") ?></span>
                </li>
              <?php endif; ?>
            </ul>
          </div>
          <div class="info">
            <h3 class="ttl"><?= __('VIETIS FinTech', 'vietis'); ?></h3>
            <ul class="list">
              <?php if ($address_fin) : ?>
                <li class="item">
                  <img class="img" src="<?= RESOURCE_HOST ?>/img/footer_icon-map.svg" alt="" />
                  <span class="info-text"><?= __($address_fin, "vietis") ?></span>
                </li>
              <?php endif; ?>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-social">
      <div class="media">
        <?php
        if(has_nav_menu("footer-social-menu")){
          wp_nav_menu([
            'menu_class'     => 'media-list',
            'container'      => '',
            'theme_location' => 'footer-social-menu',
          ]);
        }
        ?>
      </div>
      <div class="link">
        <?php
        if(has_nav_menu("footer-menu")){
          wp_nav_menu([
            'menu_class'     => 'link-list',
            'container'      => '',
            'theme_location' => 'footer-menu',
          ]);
        }
        ?>
      </div>
    </div>
  </div>
</footer>

<button class="back-top js-backTop">
  <img src="<?= RESOURCE_HOST ?>/img/ico_back_top.svg" alt="">
</button>

<div class="backdrop js-loading">
  <div class="loadingio-spinner-spinner-qt7f9s7xrdq">
    <div class="ldio-59tpwv0nqwl">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</div>
<!-- ./footer -->
<?php wp_footer(); ?>
</body>

</html>