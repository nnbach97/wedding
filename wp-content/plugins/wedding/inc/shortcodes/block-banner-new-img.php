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
  $date = wedding_func_check_data('date', $atts, '12 March 2023');
  $img_banner = wedding_func_check_data('img_banner', $atts, [
    'url' => P_wedding_RESOURCE_HOST . '/assets/img/blocks/banner/banner_new.png',
    'alt' => '',
    'id' => '',
  ],);
  $video_film = wedding_func_check_data('video_film', $atts, P_wedding_RESOURCE_HOST . '/assets/img/blocks/banner/video_time.mp4');

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
        <p class="sub"><?= $title; ?></p>
        <h2 class="ttl"><?= $description; ?></h2>
        <p class="sub"><?= $date; ?></p>

        <!-- <div class="btn-wrapper">
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
        </div> -->
      </div>

        <div class="countdown" id="countdown">
          <ul>
            <li><span id="days"></span>days</li>
            <li><span id="hours"></span>Hours</li>
            <li><span id="minutes"></span>Minutes</li>
            <li><span id="seconds"></span>Seconds</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- <div class="video-popup">
      <div class="overlay js-film"></div>
      <div class="wrap">
        <video class="film-video js-film-video" controls="" muted="">
          <source src="<?= $video_film ?>" type="video/mp4" />
        </video>
      </div>
    </div> -->
<?php
  return ob_get_clean();
}
