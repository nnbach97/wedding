<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/develop-benefit',
  'callback' => 'vietis_shortcode_block_develop_benefit'
];

function vietis_shortcode_block_develop_benefit($atts, $content)
{
  $items = vietis_func_check_data("items", $atts, [
    [
      "icon" => [
        "id" => 1,
        "url" => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/benefit/service-software-icon01.svg",
        "alt" => ""
      ],
      "title" => "Efficiency",
      "txt" => "Custom software is a product that has been specifically designed to ensure smooth operation. In terms of software setup, support, and scalability, this approach saves time and money."
    ],
    [
      "icon" => [
        "id" => 2,
        "url" => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/benefit/service-software-icon02.svg",
        "alt" => ""
      ],
      "title" => "Scalability",
      "txt" => "With software customized to your company's needs, you won't have to worry about scalability because software complexity increases in lockstep with your business's expansion."
    ],
    [
      "icon" => [
        "id" => 3,
        "url" => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/benefit/service-software-icon03.svg",
        "alt" => ""
      ],
      "title" => "Simple & Affordable Integration",
      "txt" => "With the help of custom software development, existing digital services and infrastructure may be accurately and seamlessly integrated, allowing business operations to be properly synchronized."
    ]
  ]);

  ob_start(); ?>

  <div class="block block-development-benefit">
    <div class="holder">
      <div class="wrapper-item">
        <?php if($items): ?>
          <?php foreach($items as $item): ?>
            <?php
							$image = vietis_func_check_data('icon', $item);
							$image_url = vietis_func_check_data('url', $image, VIETIS_IMAGE_DEFAULT, true);
							$title = vietis_func_check_data('title', $item, "Your title", true);
              $txt = vietis_func_check_data('txt', $item, "Your description", true);
						?>
            <div class="item">
              <img class="img" src="<?= $image_url ?>" alt=""/>
              <div class="content">
                <p class="ttl"><?= $title ?></p>
                <p class="txt"><?= $txt ?></p>
              </div>
            </div>
          <?php endforeach ?>
        <?php endif ?>
      </div>
    </div>
  </div>

<?php
  return ob_get_clean();
}
