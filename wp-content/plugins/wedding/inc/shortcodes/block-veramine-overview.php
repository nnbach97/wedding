<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/veramine-overview',
  'callback' => 'wedding_shortcode_block_veramine_overview'
];

function wedding_shortcode_block_veramine_overview($atts, $content)
{
  $title = wedding_func_check_data("title", $atts, "Features of Products and Services");
  ob_start();
?>
  <?php if(trim($title) !== ""): ?>
    <div class="block block-veramine-overview">
      <div class="feature">
        <div class="holder">
          <div class="wrap">
            <h3 class="product-ttl product-ttl--line">
              <?= $title ?>
            </h3>
            <div class="inner-blocks">
              <?= $content ?>
            </div>
          </div>
        </div>
      </div>
    </div>
  <?php endif ?>
<?php
  return ob_get_clean();
}
?>
