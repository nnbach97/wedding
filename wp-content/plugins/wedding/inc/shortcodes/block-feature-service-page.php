<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/feature-service-page',
  'callback' => 'wedding_shortcode_block_feature_service_page'
];

function wedding_shortcode_block_feature_service_page($atts, $content)
{
  $title = wedding_func_check_data('title', $atts, "<strong>Sự Kiện Cưới</strong>");
  $txt = wedding_func_check_data('txt', $atts, 'Được ai đó yêu sâu sắc sẽ mang lại cho bạn sức mạnh, trong khi yêu ai đó sâu sắc sẽ cho bạn dũng khí.');
  $content = wedding_func_check_data('content', $atts, [
    [
      'title' => '<strong>LỄ CƯỚI NHÀ NỮ</strong>',
      'icon' => [
        'url' => P_wedding_RESOURCE_HOST . '/assets/img/blocks/digital-transformation-service-page/1.png',
        'alt' =>  "",
        'id' => "",
      ],
      'date' => '07:30 AM 12/03/2023',
      'address' => 'Bạch Đằng, Đông Hưng, Thái Bình',
      'map' => 'https://www.google.com/maps/place/Tr%C6%B0%E1%BB%9Dng+m%E1%BA%A7m+non+x%C3%A3+H%E1%BB%93ng+B%E1%BA%A1ch/@20.5188289,106.2475398,397m/data=!3m1!1e3!4m17!1m10!4m9!1m6!1m2!1s0x3135ab4c76b12a3b:0x9a311c833456d5f0!2zUGjhu5EgRHV5IFTDom4sIEjDoCBO4buZaQ!2m2!1d105.7839219!2d21.0309022!1m0!3e0!3m5!1s0x3135e92e40c8a76b:0x52f742ff11f89080!8m2!3d20.5179834!4d106.2502092!16s%2Fg%2F11ngg_dpw4?hl=vi-VN'
    ],
    [
      'title' => '<strong>TIỆC CƯỚI NHÀ NỮ</strong>',
      'icon' => [
        'url' => P_wedding_RESOURCE_HOST . '/assets/img/blocks/digital-transformation-service-page/2.png',
        'alt' =>  "",
        'id' => "",
      ],
      'date' => '07:30 AM 12/03/2023',
      'address' => 'Bạch Đằng, Đông Hưng, Thái Bình',
      'map' => 'https://www.google.com/maps/place/Tr%C6%B0%E1%BB%9Dng+m%E1%BA%A7m+non+x%C3%A3+H%E1%BB%93ng+B%E1%BA%A1ch/@20.5188289,106.2475398,397m/data=!3m1!1e3!4m17!1m10!4m9!1m6!1m2!1s0x3135ab4c76b12a3b:0x9a311c833456d5f0!2zUGjhu5EgRHV5IFTDom4sIEjDoCBO4buZaQ!2m2!1d105.7839219!2d21.0309022!1m0!3e0!3m5!1s0x3135e92e40c8a76b:0x52f742ff11f89080!8m2!3d20.5179834!4d106.2502092!16s%2Fg%2F11ngg_dpw4?hl=vi-VN'
    ],
    [
      'title' => '<strong>TIỆC CƯỚI NHÀ NAM</strong>',
      'icon' => [
        'url' => P_wedding_RESOURCE_HOST . '/assets/img/blocks/digital-transformation-service-page/3.png',
        'alt' =>  "",
        'id' => "",
      ],
      'date' => '07:30 AM 12/03/2023',
      'address' => 'Số 32, Đường Kho Sáu, Vạn Điểm, Thường Tín, Hà Nội',
      'map' => 'https://www.google.com/maps/place/%C4%90%E1%BB%93+G%E1%BB%97+M%E1%BB%B9+Ngh%E1%BB%87+T%C6%B0+Qu%E1%BB%B3nh/@20.7760493,105.9089079,17z/data=!3m1!4b1!4m6!3m5!1s0x3135b78a9bbad68f:0x21828e8ab7f37e0c!8m2!3d20.7760493!4d105.9089079!16s%2Fg%2F11h4w1r6c2?hl=vi-VN'
    ],
    [
      'title' => '<strong>LỄ CƯỚI NHÀ NAM</strong>',
      'icon' => [
        'url' => P_wedding_RESOURCE_HOST . '/assets/img/blocks/digital-transformation-service-page/4.png',
        'alt' =>  "",
        'id' => "",
      ],
      'date' => '07:30 AM 12/03/2023',
      'address' => 'Số 32, Đường Kho Sáu, Vạn Điểm, Thường Tín, Hà Nội',
      'map' => 'https://www.google.com/maps/place/%C4%90%E1%BB%93+G%E1%BB%97+M%E1%BB%B9+Ngh%E1%BB%87+T%C6%B0+Qu%E1%BB%B3nh/@20.7760493,105.9089079,17z/data=!3m1!4b1!4m6!3m5!1s0x3135b78a9bbad68f:0x21828e8ab7f37e0c!8m2!3d20.7760493!4d105.9089079!16s%2Fg%2F11h4w1r6c2?hl=vi-VN'
    ]
  ]);

  ob_start(); ?>
  <!-- Feature -->
  <div class="block block-feature-service-page" id="event">
    <div class="holder wrap">
      <div class="title text-center">
        <h3 class="ttl"><?= $title; ?></h3>
        <p class="txt"><?= $txt; ?></p>
      </div>
      <ul class="content-features">
        <?php foreach ($content as $key => $value) : ?>
          <li class="item">
            <div class="img-wrap">
              <img src="<?= $value['icon']['url'] ?>" alt="" />
            </div>
            <div class="desc">
              <div class="txt"><?= $value['title'] ?></div>
              <p class="date"><i class="far fa-clock"></i> <?= $value['date'] ?></p>
              <p class="address"><i class="fa fa-map-marker"></i> <?= $value['address'] ?></p>
              <a class="map" href="<?= $value['map'] ?>" target="_blank">Xem Bản Đồ ></a>
            </div>
          </li>
        <?php endforeach ?>
      </ul>
    </div>
  </div>
  <!-- END: Feature -->
<?php
  return ob_get_clean();
}
