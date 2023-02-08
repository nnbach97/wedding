<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/guarantee',
  'callback' => 'vietis_shortcode_block_guarantee'
];

function vietis_shortcode_block_guarantee($atts, $content)
{
  $title = vietis_func_check_data('title', $atts, '<strong>Our Vision</strong>');
  $guarantee_title = vietis_func_check_data('guarantee_title', $atts, '<strong><span>What We Guarantee</span> for Successful Businesses</strong>');
  $guarantee_txt = vietis_func_check_data('guarantee_txt', $atts, '<strong>Leverage technology to enhance the value of the business and provide clients with the best service possible.</strong><br></br>VIETIS provides a new creative platform to increase people’s creativity and productivity and support developers and companies in the next generation of technology. We aim to absorb the latest technology and innovative businesses with our own strength, create new value, and position ourselves as a globally reliable partner.');
  $image = vietis_func_check_data('image', $atts, [
    "url" => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/guarantee/guarantee_default.png",
    'alt' => '',
    'id' => '',
  ]);
  $visions = vietis_func_check_data('visions', $atts, [
    [
      'text' => 'Become an IT service company with innovative technology'
    ],
    [
      'text' => 'Create an internal environment where employees can work comfortably.'
    ],
    [
      'text' => 'Aiming to be a company with 1000 people and continuous process improvement (CMMi L4)'
    ],
    [
      'text' => 'We are always the trusted partner of our customers and can recommend the best technology solutions and business flows.'
    ],
  ]);

  ob_start(); ?>
  <div class="block block-guarantee">
    <div class="holder guarantee-inner">
      <div class="guarantee-head">
        <h3 class="ttl"><?= $guarantee_title; ?></h3>
        <p class="txt"><?= $guarantee_txt; ?></p>
      </div>
      <div class="wrap">
        <img src="<?= $image['url'] ?>" alt="" class="img">
        <div class="content">
          <div class="title">
            <h3 class="ttl"><?= $title; ?></h3>
          </div>
          <ul class="list">
            <?php foreach ($visions as $key => $value) : ?>
              <li class="item">
                <?= $value['text'] ?>
              </li>
            <?php endforeach ?>
          </ul>
        </div>
      </div>
    </div>
  </div>
<?php
  return ob_get_clean();
}
