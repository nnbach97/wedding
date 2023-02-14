<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/banner',
  'callback' => 'wedding_shortcode_block_banner'
];

function wedding_shortcode_block_banner($atts, $content)
{
  $config = wedding_func_check_data('config', $atts, []);
  $config = wedding_func_process_config_block($config);
  $style_block = wedding_func_check_data('style_block', $config, '');
  $title = wedding_func_check_data('title', $atts, 'In Pursuit of Excellent');
  $subTitle = wedding_func_check_data('subTitle', $atts, 'To be your long term Tech - Partner');
  $video_background = wedding_func_check_data('video_background', $atts, P_wedding_RESOURCE_HOST . "/assets/img/blocks/banner/video_background.mp4");
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
      "url" => P_wedding_RESOURCE_HOST . '/assets/img/blocks/banner/banner_iso.png',
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
  $theme_options = theme_options::get_theme_options();
  $contact_email = wedding_func_check_data('contact_email', $theme_options, '');
  $mail = wedding_func_check_data('mail', $atts, [
    "icon" => [
      'url' => P_wedding_RESOURCE_HOST . '/assets/img/blocks/banner/mail_icon.png',
      'alt' => '',
      'id' => '',
    ],
    "title" => "MAIL US DAILY:",
    "mail" => "<a href='mailto:" . $contact_email . "'>" . $contact_email . "</a>",
  ]);
  $mail_icon = wedding_func_check_data('icon', $mail, '');
  $mail_title = wedding_func_check_data('title', $mail, '');
  $mail_mail = wedding_func_check_data('mail', $mail, '');
  $btn_watch = wedding_func_check_data('btn_watch', $atts, [
    'text' => "<a href=\"#\">Watch vision film</a>",
    'icon' => [
      'url' => P_wedding_RESOURCE_HOST . '/assets/img/blocks/banner/banner_icon-film.svg',
      'alt' => '',
      'id' => '',
    ],
  ]);
  $btn_watch_title = wedding_func_check_data('text', $btn_watch, '');
  $btn_watch_url = wedding_func_check_data('icon', $btn_watch, '');
  $btn_inquiry = wedding_func_check_data('btn_inquiry', $atts, [
    'text' => "<a href=\"#\">Inquiry</a>",
    'icon' => [
      'url' => P_wedding_RESOURCE_HOST . '/assets/img/blocks/banner/banner_icon-inquiry.svg',
      'alt' => '',
      'id' => '',
    ],
  ]);

  $btn_inquiry_title = wedding_func_check_data('text', $btn_inquiry, '');
  $btn_inquiry_url = wedding_func_check_data('icon', $btn_inquiry, '');
  $is_show_btn_video = wedding_func_check_data('is_show_btn_video', $atts, true);

  ob_start(); ?>
  <div class="block block-banner js-hero">
    <div class="overlay" style="<?= esc_attr($style_block); ?>"></div>
    <div class="banner-bg">
      <video class="video js-video-bg" preload="true" muted="" playsinline="" poster="" loop="">
        <source src="<?= $video_background; ?>" type="video/mp4"></source>
      </video>
    </div>
    <div class="holder banner-inner">
      <div class="wrap">
        <h2 class="ttl"><?= $title; ?></h2>
        <p class="sub"><?= $subTitle; ?></p>
        <div class="btn-wrapper">
          <?php if ($is_show_btn_video === true) : ?>
            <div class="item js-film">
              <span class="url">
                <span class="icon">
                  <img class="img" src="<?= $btn_watch_url['url']; ?>" alt="" />
                </span>
                <?= $btn_watch_title; ?>
              </span>
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
      </div>
    </div>
    <div class="number">
      <div class="holder-fluid number-inner">
        <div class="overlay"></div>
        <div class="certificate">
          <img src="<?= $certificate_01['url']; ?>" alt="" class="img wow fadeInDown">
          <img src="<?= $certificate_02['url']; ?>" alt="" class="img img-cmmi wow fadeInDown" data-wow-delay="0.2s">
        </div>
        <div class="counter">
          <?php foreach ($counters as $key => $value) : ?>
            <div class="item">
              <div class="counter-number"><span><?= $value['number'] < 10 ? '0' : '' ?></span><span class="js-counter" data-value="<?= $value['number'] ?>">0</span><span><?= $key !== 0 ? '+' : '' ?></span></div>
              <div class="txt"><?= $value['text'] ?></div>
            </div>
          <?php endforeach ?>
        </div>
        <div class="contact">
          <img class="img" src="<?= $mail_icon['url']; ?>" alt="">
          <div class="content">
            <div class="ttl wow fadeInDown"><?= $mail_title; ?></div>
            <div class="email wow fadeInDown" data-wow-delay="0.2s"><?= $mail_mail; ?></div>
          </div>
        </div>
      </div>
    </div>
    <div class="video-popup js-video-popup">
      <div class="overlay js-film"></div>
      <div class="wrap">
        <video class="film-video js-film-video" controls="" muted="">
          <source src="<?= $video_film; ?>" type="video/mp4"></source>
        </video>
      </div>
    </div>
  </div>
<?php
  return ob_get_clean();
}
