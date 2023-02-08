<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/feature-service-page',
  'callback' => 'vietis_shortcode_block_feature_service_page'
];

function vietis_shortcode_block_feature_service_page($atts, $content)
{
  $title = vietis_func_check_data('title', $atts, '<strong>Features of the service</strong>');
  $content = vietis_func_check_data('content', $atts, [
    [
      'title' => '<strong>Full support from analysis to solution construction and operation</strong>',
      'icon' => [
        'url' => P_VIETIS_RESOURCE_HOST . '/assets/img/blocks/digital-transformation-service-page/product_digital-transformation_feature_1.png',
        'alt' =>  "",
        'id' => "",
      ],
    ],
    [
      'title' => '<strong>Experienced and proven expert team</strong>',
      'icon' => [
        'url' => P_VIETIS_RESOURCE_HOST . '/assets/img/blocks/digital-transformation-service-page/product_digital-transformation_feature_2.png',
        'alt' =>  "",
        'id' => "",
      ],
    ],
    [
      'title' => '<strong>Advanced technology know-how and abundant staff</strong>',
      'icon' => [
        'url' => P_VIETIS_RESOURCE_HOST . '/assets/img/blocks/digital-transformation-service-page/product_digital-transformation_feature_3.png',
        'alt' =>  "",
        'id' => "",
      ],
    ]
  ]);

  ob_start(); ?>
  <!-- Feature -->
  <div class="block block-feature-service-page">
    <div class="holder wrap">
      <div class="ttl"><?= $title ?></div>
      <ul class="content-features">
        <?php foreach ($content as $key => $value) : ?>
          <li class="item">
            <div class="img-wrap">
              <img src="<?= $value['icon']['url'] ?>" alt="" />
            </div>
            <div class="txt"><?= $value['title'] ?></div>
          </li>
        <?php endforeach ?>
      </ul>
    </div>
  </div>
  <!-- END: Feature -->
<?php
  return ob_get_clean();
}
