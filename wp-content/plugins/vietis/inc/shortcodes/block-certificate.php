<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/certificate',
  'callback' => 'vietis_shortcode_block_certificate'
];

function vietis_shortcode_block_certificate($atts) {
  $config = vietis_func_check_data('config', $atts, []);
  $config = vietis_func_process_config_block($config);
  $style_block = vietis_func_check_data('style_block', $config, '');
  $img_background = vietis_func_check_data('img_background', $atts, P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/certificate/certificate_bg.png");
  $items = vietis_func_check_data('items', $atts, [
    [
      'image' => [
        'url' => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/certificate/certificate_img01.png",
        'alt' => '',
        'id' => '',
      ],
      'ttl' => "<strong>ISO 27001 Certification System</strong>",
      'txt'=> "This is a system to certify businesses that have established an information security management system (ISMS) that meets the requirements of ISO27001, appropriately implement control measures for information security, and properly manage risks. Businesses certified by a certification body are permitted to use “ISO27001”.",
      'color'=> "#fff",
    ],
    [
      'image' => [
        'url' => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/certificate/certificate_img02.png",
        'alt' => '',
        'id' => '',
      ],
      'ttl' => "<strong>CMMI Level 3 Certificate</strong>",
      'txt'=> "Based on the CMMI (the system development organization’s process improvement model and evaluation methodology), the entire organization worked to improve the software development process and reached Level 3 in February 2019.",
      'color'=> "#fff",
    ],
]);

  ob_start(); ?>
    <div class="block block-certificate" style="<?= esc_attr($style_block); ?>">
      <div class="overlay" style="<?= esc_attr($style_block); ?>"></div>
      <div class="img-bg">
        <?php if($img_background): ?>
          <img class="img" src="<?= $img_background ?>" alt="" />
        <?php endif; ?>
      </div>
      <div class="holder">
        <?php if ($items): ?>
        <div class="wrapper-item">
          <?php foreach ($items as $key => $item): ?>
            <?php
              $ttl = vietis_func_check_data('ttl', $item, '');
              if (!$ttl) continue;
              $txt = vietis_func_check_data('txt', $item, '');
              $image = vietis_func_check_data('image', $item, '');
              $color = vietis_func_check_data('color', $item, '#F3F4FD');
              $id = vietis_func_check_data('id', $image, '');
              $alt = vietis_func_check_data('alt', $image, '');
              if ($id) {
                $url = vietis_func_get_attachment_image($id);
              } else {
                $url = vietis_func_check_data('url', $image);
                if (!$url) $url= VIETIS_IMAGE_DEFAULT;
              }
            ?>
            <div class="item">
              <div class="wrap" style="background: <?= $color; ?>;">
                <div class="icon">
                  <img src="<?= P_VIETIS_RESOURCE_HOST . '/assets/img/blocks/certificate/certificate_ico.png' ?>" alt="">
                </div>
                <div class="image">
                  <img src="<?= $url; ?>" alt="<?= $alt; ?>" class="img">
                </div>
                <div class="text">
                  <div class="ttl"><?= $ttl; ?></div>
                  <div class="txt"><?= $txt; ?></div>
                </div>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
        <?php endif; ?>
      </div>
    </div>
  <?php
  return ob_get_clean();
}
