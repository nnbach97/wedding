<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/banner-new-img',
  'callback' => 'vietis_shortcode_block_banner_new_img'
];

function vietis_shortcode_block_banner_new_img($atts, $content)
{
  $config = vietis_func_check_data('config', $atts, []);
  $config = vietis_func_process_config_block($config);
  $title = vietis_func_check_data('title', $atts, 'In Pursuit of Excellence');
  $description = vietis_func_check_data('description', $atts, 'To be your long term Tech - Partner');
  $img_banner = vietis_func_check_data('img_banner', $atts, [
    'url' => P_VIETIS_RESOURCE_HOST . '/assets/img/blocks/banner/banner_new.png',
    'alt' => '',
    'id' => '',
  ],);
  $video_film = vietis_func_check_data('video_film', $atts, P_VIETIS_RESOURCE_HOST . '/assets/img/blocks/banner/video_film.mp4');
  $counters = vietis_func_check_data('counters', $atts, [
    [
      'number' => '03',
      'text' => 'Locations'
    ],
    [
      'number' => '250',
      'text' => 'Clients'
    ],
    [
      'number' => '300',
      'text' => 'Projects'
    ],
  ]);
  $certificate = vietis_func_check_data('certificate', $atts, [
    'certificate_01' => [
      "url" => P_VIETIS_RESOURCE_HOST . '/assets/img/blocks/banner/banner_iso.svg',
      'alt' => '',
      'id' => '',
    ],
    'certificate_02' => [
      "url" => P_VIETIS_RESOURCE_HOST . '/assets/img/blocks/banner/banner_cmmi.png',
      'alt' => '',
      'id' => '',
    ],
  ]);
  $certificate_01 = vietis_func_check_data('certificate_01', $certificate, '');
  $certificate_02 = vietis_func_check_data('certificate_02', $certificate, '');
  $btn_inquiry = vietis_func_check_data('btn_inquiry', $atts, [
    'text' => "<a href='/en/contact/'>Inquiry</a>",
    'icon' => [
      'url' => P_VIETIS_RESOURCE_HOST . '/assets/img/blocks/banner/banner_icon-inquiry.svg',
      'alt' => '',
      'id' => '',
    ],
  ]);

  $btn_inquiry_title = vietis_func_check_data('text', $btn_inquiry, '');
  $btn_inquiry_url = vietis_func_check_data('icon', $btn_inquiry, '');
  $is_show_btn_video = vietis_func_check_data('is_show_btn_video', $atts, true);
  $is_show_bg = vietis_func_check_data('is_show_bg', $atts, true);

  ob_start(); ?>
  <div class="block block-banner-new-img js-hero<?= $is_show_bg ? '' : ' is-show-bg' ?>">
    <div class="banner-bg">
      <img class="banner-bg__img" src="<?= $img_banner['url'] ?>" alt="<?= $img_banner['alt'] ?>">
      <div class="night">
        <div class="night-item">
          <div class="shooting_star"></div>
        </div>
        <div class="night-item">
          <div class="shooting_star"></div>
        </div>
        <div class="night-item">
          <div class="shooting_star"></div>
        </div>
        <div class="night-item">
          <div class="shooting_star"></div>
        </div>
      </div>
    </div>
    <div class="holder banner-inner">
      <div class="wrap">
        <h2 class="ttl"><?= $title; ?></h2>
        <p class="sub"><?= $description; ?></p>
        <div class="btn-wrapper">
          <?php if ($is_show_btn_video === true) : ?>
            <div class="video-btn js-film">
              <div class="video-mark">
                <div class="wave-pulse wave-pulse-1"></div>
                <div class="wave-pulse wave-pulse-2"></div>
              </div>
              <div class="video-click">
                <div class="video-play">
                  <span class="video-play-icon"></span>
                </div>
              </div>
            </div>
          <?php endif; ?>
          <div class="item">
            <span class="url">
              <span class="icon">
                <img class="img" src="<?= $btn_inquiry_url['url']; ?>" alt="" />
              </span>
              <?= $btn_inquiry_title; ?>
            </span>
          </div>
        </div>
        <div class="certificate">
          <div class="img-wrap">
            <img src="<?= $certificate_01['url']; ?>" alt="" class="img">
          </div>
          <div class="img-wrap">
            <img src="<?= $certificate_02['url']; ?>" alt="" class="img img-cmmi">
          </div>
        </div>
      </div>
    </div>
    <div class="holder banner-inner-wrap">
      <div class="banner-inner__lnk">
        <a href="/en/about-us/#the-fox" class="lnk"></a>
      </div>
    </div>
    <div class="video-popup">
      <div class="overlay js-film"></div>
      <div class="wrap">
        <video class="film-video js-film-video" controls="" muted="">
          <source src="<?= $video_film ?>" type="video/mp4" />
        </video>
      </div>
    </div>
  </div>
  <div class="block block-number">
    <img class="img" src="<?= P_VIETIS_RESOURCE_HOST . '/assets/img/blocks/banner/bg-number.svg' ?>" alt="">
    <div class="number-inner">
      <div class="holder">
        <div class="counter">
          <?php foreach ($counters as $key => $value) : ?>
            <div class="item">
              <div class="counter-number"><span><?= $value['number'] < 10 ? '0' : '' ?></span><span class="js-counter wow" data-value="<?= $value['number'] ?>">0</span><span><?= $key !== 0 ? '+' : '' ?></span></div>
              <div class="txt"><?= $value['text'] ?></div>
            </div>
          <?php endforeach ?>
        </div>
      </div>
    </div>
  </div>
<?php
  return ob_get_clean();
}
