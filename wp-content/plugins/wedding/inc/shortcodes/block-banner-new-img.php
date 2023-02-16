<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/banner-new-img',
  'callback' => 'wedding_shortcode_block_banner_new_img'
];

function wedding_shortcode_block_banner_new_img($atts, $content)
{
  $config = wedding_func_check_data('config', $atts, []);
  $config = wedding_func_process_config_block($config);
  $title = wedding_func_check_data('title', $atts, 'We’re Getting Married');
  $description = wedding_func_check_data('description', $atts, 'Ngọc Bách & Huyền Trang');
  $img_banner = wedding_func_check_data('img_banner', $atts, [
    'url' => P_wedding_RESOURCE_HOST . '/assets/img/blocks/banner/banner_new.png',
    'alt' => '',
    'id' => '',
  ],);
  $video_film = wedding_func_check_data('video_film', $atts, P_wedding_RESOURCE_HOST . '/assets/img/blocks/banner/video_time.mp4');

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
<?php
  return ob_get_clean();
}
