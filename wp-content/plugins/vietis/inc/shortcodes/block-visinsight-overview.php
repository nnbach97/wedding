<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/visinsight-overview',
  'callback' => 'vietis_shortcode_block_visinsight_overview'
];

function vietis_shortcode_block_visinsight_overview($atts, $content)
{
  $title = vietis_func_check_data('title', $atts, 'Overview VISInsight');
  $image = vietis_func_check_data('image', $atts);
  $image_url = vietis_func_check_data('url', $image, RESOURCE_HOST . '/img/product-insight-dt.png');
  $items = vietis_func_check_data('items', $atts, [
    [
      "ttl" => "BOD",
      "txt" => "View project situation in the company<br>Review, approve necessary documents"
    ],
    [
      "ttl" => "QA",
      "txt" => "View, monitor project information<br>Support PM completes the target<br>Collect data analysis, build target for the organization"
    ],
    [
      "ttl" => "Software production department",
      "txt" => "Create procedures for opening and closing projects<br>Create a report<br>Monitoring<br>Resource Management"
    ],
    [
      "ttl" => "IT Support",
      "txt" => "Decentralization for the project<br>Backup/ recovery’s server folder"
    ],
    [
      "ttl" => "HR",
      "txt" => "Department information management<br>Employee information management"
    ],
    [
      "ttl" => "Sales",
      "txt" => "Create customer information<br>Bidding information management"
    ]
  ]);
  ob_start();
?>

  <div class="block block-product-overview">
    <div class="holder">
      <div class="product-ttl"><?= $title ?></div>
      <div class="wrapper">
        <div class="img">
          <img class="img" src="<?= $image_url ?>" alt="">
        </div>
        <ul class="list">
          <?php foreach($items as $item): ?>
            <?php
              $ttl = vietis_func_check_data('ttl', $item, '');
              $txt = vietis_func_check_data('txt', $item, '');
            ?>
            <?php if(trim($ttl) !== '' && trim($txt) !== ''): ?>
              <li class="item">
                <div class="wrap">
                  <p class="ttl"><?= $ttl ?></p>
                  <p class="txt"><?= $txt ?></p>
                </div>
              </li>
            <?php endif ?>
          <?php endforeach ?>
        </ul>
      </div>
    </div>
  </div>

<?php
  return ob_get_clean();
}
?>
