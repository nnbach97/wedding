<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/visinsight-banner',
  'callback' => 'vietis_shortcode_block_visinsight_banner'
];

function vietis_shortcode_block_visinsight_banner($atts, $content)
{
  $title = vietis_func_check_data('title', $atts, 'VISInsight');
  if ($title === "") $title = "Title";

  $description = vietis_func_check_data('description', $atts, "Is a project management tool of VietIS company, aiming to implement the digital transformation roadmap.");
  if ($description === "") $description = "Description";

  $steps = vietis_func_check_data('steps', $atts, [
    [
      "id" => 1,
      "text" => "Planning assistance"
    ],
    [
      "id" => 2,
      "text" => "Monitoring project"
    ],
    [
      "id" => 3,
      "text" => "Data collection"
    ]
  ]);

  $technology = vietis_func_check_data("technology", $atts, []);

  $image = vietis_func_check_data("image", $atts, [
    "id" => "",
    "url" => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/product/product-insight-laptop.png",
    "alt" => ""
  ]);
  $image_url = vietis_func_check_data('url', $image, VIETIS_IMAGE_DEFAULT);

  ob_start(); ?>
  <div class="block block-product-banner js-hero" id="product-visInsight">
    <div class="holder-fluid banner-inner">
      <div class="img-wrap">
        <img class="img" src="<?= $image_url ?>" alt="" />
      </div>
      <div class="content">
        <h2 class="ttl"><?= $title ?></h2>
        <div class="des"><?= $description ?></div>
        <ul class="product-insight-implement">
          <?php foreach ($steps as $step) : ?>
            <li class="item">
              <span class="number"><?= $step['id'] ?></span>
              <?php $text = vietis_func_check_data('text', $step, "Your text", true) ?>
              <span class="txt"><?= $text ?></span>
            </li>
          <?php endforeach ?>
        </ul>
      </div>
    </div>
  </div>
  <div class="block block-technology">
    <ul class="holder list">
      <?php foreach ($technology as $tech) : ?>
        <?php $tech_url = vietis_func_check_data('url', $tech, VIETIS_IMAGE_DEFAULT);  ?>
        <li class="item">
          <img class="img" src="<?= $tech_url ?>" alt="" />
        </li>
      <?php endforeach ?>
    </ul>
  </div>
<?php
  return ob_get_clean();
}
