<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/services-new',
  'callback' => 'vietis_shortcode_block_services_new'
];

function vietis_shortcode_block_services_new($atts, $content) {
  $title = vietis_func_check_data('title', $atts, '<strong>VietIS Services</strong>');
  $title_shadow = vietis_func_check_data('title_shadow', $atts, 'Services');
  $config = vietis_func_check_data('config', $atts, []);
  $config = vietis_func_process_config_block($config);
  $style_block = vietis_func_check_data('style_block', $config, '');
  $items = vietis_func_check_data('items', $atts, [
    [
      "image" => [
        "url" => P_VIETIS_RESOURCE_HOST . '/assets/img/blocks/service/service_img01.png',
        "alt" => "",
        "id" => ""
      ],
      "ttl" => "Digital Transformation",
      "txt" => "Our team at VietIS can assist you in creating a solid digital foundation for your company so you can evolve your customer experience and surpass your competitors.",
      "link" => "/service/#service-dx"
    ],
    [
      "image" => [
        "url" => P_VIETIS_RESOURCE_HOST . '/assets/img/blocks/service/service_img02.png',
        "alt" => "",
        "id" => ""
      ],
      "ttl" => "Block Chain Technology",
      "txt" => "In the areas of banking, real estate, entertainment, healthcare, transportation, and insurance, VietIS is a company that specializes in offering organizations and enterprises solutions and applications of Blockchain technology.<br>We will assess, evaluate, develop a plan, and provide the best solution to install Blockchain technology applications for people and businesses with a team of competent and experienced specialists and programmers. Businesses and corporations may do so swiftly, effectively, and safely.",
      "link" => "/service/#block-chain"
    ],
    [
      "image" => [
        "url" => P_VIETIS_RESOURCE_HOST . '/assets/img/blocks/service/service_img03.png',
        "alt" => "",
        "id" => ""
      ],
      "ttl" => "Development of Mobile and Web Applications",
      "txt" => "Utilizing the best practices obtained from VIETIS's many years of service provision experience, all services are performed according to international standards such as CMMI level 3, ISO27001: 2013, and we can provide the level of service requested by our customers.",
      "link" => "/service/#service-system"
    ],
    [
      "image" => [
        "url" => P_VIETIS_RESOURCE_HOST . '/assets/img/blocks/service/service_img04.png',
        "alt" => "",
        "id" => ""
      ],
      "ttl" => "Development of Personalized Software",
      "txt" => "We offer a solution for custom software development to entrepreneurs. We create audacious and distinctive digital products that support your professional objectives. Each product's features are intended to increase the worth of your business, the number of customers you have, and your profitability. Custom software development enables certain business requirements to be handled at a competitive price when compared to commercial software and its modification and maintenance.",
      "link" => "/service/#service-ui-ux"
    ]
  ]);

  ob_start(); ?>

  <div class="block block-services-new" style="<?= esc_attr($style_block); ?>">
    <div class="holder">
      <div class="title text-center">
        <h3 class="ttl"><?= $title; ?></h3>
        <span class="shadow"><?= $title_shadow; ?></span>
      </div>
      <div class="block-content wow fadeInUp"><?= $content; ?></div>
      <div class="wrapper-item wow fadeInUp">
        <?php if($items): ?>
          <?php foreach($items as $item): ?>
            <?php
              $ttl = vietis_func_check_data('ttl', $item, 'Your heading', true);
              $txt = 	vietis_func_check_data('txt', $item, 'Your description', true);
              $image = vietis_func_check_data('image', $item);
              $image_url = vietis_func_check_data('url', $image, VIETIS_IMAGE_DEFAULT, true);
              $link = vietis_func_check_data('link', $item, '#', true);
            ?>
            <div class="lnk">
              <div class="item-media">
                <div class="image">
                  <img src="<?= $image_url ?>" alt="">
                </div>
                <div class="desc">
                  <div class="txt"><?= $txt ?></div>
                  <div class="heading"><p><?= $ttl ?></p></div>
                </div>
              </div>
              <a href="<?= $link ?>" class="link"></a>
            </div>
          <?php endforeach ?>
        <?php endif ?>
      </div>
    </div>
  </div>

  <?php
  return ob_get_clean();
}
