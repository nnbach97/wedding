<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/the-fox',
  'callback' => 'vietis_shortcode_block_thefox'
];

function vietis_shortcode_block_thefox($atts, $content)
{
  $title = vietis_func_check_data('title', $atts, "<strong><span class = 'color'>The Fox</span> - The Mascot Of VietIS</strong>");
  $desc = vietis_func_check_data('desc', $atts, "In Japanese Culture, the Fox is believed to be the messenger of the Inari God, the protector of rice cultivation. The fox is so flexible and intelligent that it can distinguish good and bad people based on their daily behaviors. Moreover, this sacred animal can wholeheartedly help people to fulfill their dreams with its magic and bring  good luck to them<br>"
  . "<br>We chose the Fox as the Mascot of our company because VietIS and the Fox share the same characteristics. They are flexibility, devotion, and bringing good luck to the people they serve.<br>"
  . "<br><strong><span class = 'color'>Flexibility</span></strong>: We are flexible not only in the delivery process but also in ensuring our contracts can meet our customer’s requirements. Moreover, different resources will be allocated and utilized to meet the specific demands of our customers.<br>"
  . "<br><strong><span class = 'color'>Devotion</span></strong>: Our team always tries their best to complete the projects on time and on budget by using the most advanced technology available. Our skilled engineers are required to constantly update their knowledge and improve their technical skills to ensure the best outcomes.<br>"
  . "<br><strong><span class = 'color'>Good luck charm</span></strong>: Our services have aided many organizations in digitally transformation for their business. It is estimated that 70% of customers using VietIS products and services have witnessed rapid growth in their businesses. We attribute this to the luck of our Inari fox.");

  $image = vietis_func_check_data('image', $atts);
  $image_url = vietis_func_check_data('url', $image, P_VIETIS_RESOURCE_HOST . 'assets/img/blocks/thefox/the-fox.png');

  ob_start(); ?>

<div class="block block-thefox" id="the-fox">
  <div class="holder">
    <div class="wrapper">
      <div class="content">
        <h4 class="title"><?=$title?></h4>
        <div class="text">
          <p class="desc">
            <?=$desc?>
          </p>
        </div>
      </div>
      <div class="image">
        <img src="<?= $image_url ?>" alt="">
      </div>
    </div>
  </div>
</div>

<?php
  return ob_get_clean();
}
