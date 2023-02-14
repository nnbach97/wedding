<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/banner-new',
  'callback' => 'wedding_shortcode_block_banner_new'
];

function wedding_shortcode_block_banner_new($atts, $content)
{
  $config = wedding_func_check_data('config', $atts, []);
  $config = wedding_func_process_config_block($config);
  $title = wedding_func_check_data('title', $atts, 'In Pursuit of Excellence');
  $description = wedding_func_check_data('description', $atts, 'To be your long term Tech - Partner');
  $video_background = wedding_func_check_data('video_background', $atts, P_wedding_RESOURCE_HOST . "/assets/img/blocks/banner/video_background_new.mp4");
  $video_film = wedding_func_check_data('video_film', $atts, P_wedding_RESOURCE_HOST . '/assets/img/blocks/banner/video_film.mp4');
  $counters = wedding_func_check_data('counters', $atts, [
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
  $certificate = wedding_func_check_data('certificate', $atts, [
    'certificate_01' => [
      "url" => P_wedding_RESOURCE_HOST . '/assets/img/blocks/banner/banner_iso.svg',
      'alt' => '',
      'id' => '',
    ],
    'certificate_02' => [
      "url" => P_wedding_RESOURCE_HOST . '/assets/img/blocks/banner/banner_cmmi.png',
      'alt' => '',
      'id' => '',
    ],
  ]);
  $certificate_01 = wedding_func_check_data('certificate_01', $certificate, '');
  $certificate_02 = wedding_func_check_data('certificate_02', $certificate, '');
  $btn_inquiry = wedding_func_check_data('btn_inquiry', $atts, [
    'text' => "<a href='/en/contact/'>Inquiry</a>",
    'icon' => [
      'url' => P_wedding_RESOURCE_HOST . '/assets/img/blocks/banner/banner_icon-inquiry.svg',
      'alt' => '',
      'id' => '',
    ],
  ]);

  $btn_inquiry_title = wedding_func_check_data('text', $btn_inquiry, '');
  $btn_inquiry_url = wedding_func_check_data('icon', $btn_inquiry, '');
  $is_show_btn_video = wedding_func_check_data('is_show_btn_video', $atts, true);
  $is_show_bg = wedding_func_check_data('is_show_bg', $atts, true);

  ob_start(); ?>
  <div class="block block-banner-new js-hero<?= $is_show_bg ? '' : ' is-show-bg' ?>">
    <div class="banner-bg">
      <video class="video js-video-bg" preload="true" muted="" playsinline="" poster="" loop="">
        <source src="<?= $video_background; ?>" type="video/mp4">
        </source>
      </video>
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
            <img src="<?= $certificate_01['url']; ?>" alt="" class="img wow fadeInDown">
          </div>
          <div class="img-wrap">
            <img src="<?= $certificate_02['url']; ?>" alt="" class="img img-cmmi wow fadeInDown" data-wow-delay="0.2s">
          </div>
        </div>
      </div>
    </div>
    <div class="video-popup">
      <div class="overlay js-film"></div>
      <div class="wrap">
        <video class="film-video js-film-video" controls="" muted="">
          <source src="<?= $video_film; ?>" type="video/mp4" />
        </video>
      </div>
    </div>
  </div>
  <div class="block block-number">
    <img class="img" src="<?= P_wedding_RESOURCE_HOST . '/assets/img/blocks/banner/bg-number.svg' ?>" alt="">
    <div class="number-inner">
      <div class="holder">
        <div class="counter">
          <?php foreach ($counters as $key => $value) : ?>
            <div class="item">
              <div class="counter-number"><span><?= $value['number'] < 10 ? '0' : '' ?></span><span class="js-counter" data-value="<?= $value['number'] ?>">0</span><span><?= $key !== 0 ? '+' : '' ?></span></div>
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
