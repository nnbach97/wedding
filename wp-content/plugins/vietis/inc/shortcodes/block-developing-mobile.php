<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/develop-mobile',
  'callback' => 'vietis_shortcode_block_develop_mobile'
];

function vietis_shortcode_block_develop_mobile($atts, $content)
{
  $title = vietis_func_check_data('title', $atts, '<strong>System Development</strong>');
  $desc = vietis_func_check_data('desc', $atts, 'VietIS Software’s business application development and maintenance services are designed to enable you to lower the total cost of ownership (TCO) for your application portfolio.VietIS ’s application service helps you extract the best out of your existing applications. We also help you to migrate from legacy systems to a more dynamic and modern technologies, capable of today’s more rigorous business needs. Enterprises spend a lot of time in maintaining their legacy applications, which serve critical business functions.<br><br>VietIS provides reliable and cost effective solutions for application maintenance in technologies spanning across .Net, Java, PHP, ReactJS, Ruby and other languages.');
  $image = vietis_func_check_data('image', $atts, [
    "url" => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/mobile/services-page-mobile01.png",
    'alt' => '',
    'id' => '',
  ]);
  $image_txt = vietis_func_check_data('image_txt', $atts, 'Our Service Offering');
  $items = vietis_func_check_data('items', $atts, [
    [
    'icon' => [
      'url' => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/mobile/data.svg",
      'alt' => '',
      'id' => '',
    ],
    'ttl' => "<strong>Application Development</strong>",
    'txt'=> "VietIS team dedicates to develop software solution, providing a complete lifecycle which includes business analysis, design, application development, implementation, maintenance and other supports",
    ],
    [
      'icon' => [
        'url' => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/mobile/optimize.svg",
        'alt' => '',
        'id' => '',
      ],
      'ttl' => "<strong>Application Maintenance</strong>",
      'txt'=> "Our application maintenance services help to improve our clients’ efficiency, slash costs and enhance overall business performance. Our scope of work will enables clients’ business to continuously reinvent system landscapes and achieve IT goals that align with business needs.",
    ],
    [
      'icon' => [
        'url' => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/mobile/feature.svg",
        'alt' => '',
        'id' => '',
      ],
      'ttl' => "<strong>Application Maintenance</strong>",
      'txt'=> "Our application maintenance services help to improve our clients’ efficiency, slash costs and enhance overall business performance. Our scope of work will enables clients’ business to continuously reinvent system landscapes and achieve IT goals that align with business needs.",
    ]
  ]);

  ob_start(); ?>

  <div class="block block-mobile">
    <div class="wrap">
      <div class="holder">
        <div class="wrapper-item">
          <div class="item">
            <div class="subtitle">
              <p class="ttl"><?= $title ? $title : 'Your title'; ?></p>
              <p class="txt"><?= $desc ? $desc : 'Your description'; ?></p>
            </div>
            <div class="content">
              <div class="image">
                <?php
                  if ($image && isset($image['url'])) {
                    $image = $image['url'];
                  }
                ?>
                <img src="<?= $image ?>" alt="" class="img">
                <p class="ttl"><?= $image_txt ?></p>
              </div>
              <div class="application">
                <?php if($items): ?>
                  <?php foreach($items as $item): ?>
                    <?php
                      $icon = vietis_func_check_data('icon', $item);
                      $icon_url = vietis_func_check_data('url', $icon, VIETIS_IMAGE_DEFAULT, true);
                      $ttl = vietis_func_check_data('ttl', $item, 'Your title', true);
                      $txt = vietis_func_check_data('txt', $item, 'Your text', true);
                    ?>
                    <div class="desc">
                      <img src="<?= $icon_url ?>" alt="" class="img">
                      <div class="sub-desc">
                        <p class="ttl"><?= $ttl ?></p>
                        <p class="txt"><?= $txt ?></p>
                      </div>
                    </div>
                  <?php endforeach ?>
                <?php endif ?>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

<?php
  return ob_get_clean();
}
