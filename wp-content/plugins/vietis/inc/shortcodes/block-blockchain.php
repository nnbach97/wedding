<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/block-blockchain',
  'callback' => 'wedding_shortcode_block_blockchain'
];

function wedding_shortcode_block_blockchain($atts, $content)
{
  $title = wedding_func_check_data('title', $atts, 'Why do we use Blockchain Technology?');
  $items = wedding_func_check_data('items', $atts, [
    [
      "icon" => [
        "url" => P_wedding_RESOURCE_HOST . "/assets/img/blocks/blockchain/blockchain_icon01.svg",
        "alt" => "",
        "id" => "",
      ],
      "ttl" => "<strong>Cost-effectiveness</strong>",
      "txt" => "Blockchain technology eliminates the costs associated with managing and recording transactions through third parties including banks, mediators, payment networks, and money transfer services. By avoiding the need to update old systems and administrative infrastructure in enterprises, it can also reduce operational and IT expenditures. The use of Blockchain technology requires some financial commitment. However, the price is far lower than the expense of maintaining IT infrastructure. The same holds true for other facets of the company, such as finance or supply chain management.",
      "color" => "#F3F4FD",
    ],
    [
      "icon" => [
        "url" => P_wedding_RESOURCE_HOST . "/assets/img/blocks/blockchain/blockchain_icon02.svg",
        "alt" => "",
        "id" => "",
      ],
      "ttl" => "<strong>Generating Revenue</strong>",
      "txt" => "The Blockchain removes administrative and teamwork boundaries, paving the path for creative business tactics that were simply not possible before distributed ledger technology. Blockchain opens the door for new infrastructure and business models with this new independence.",
      "color" => "#EDFAFE",
    ],
    [
      "icon" => [
        "url" => P_wedding_RESOURCE_HOST . "/assets/img/blocks/blockchain/blockchain_icon03.svg",
        "alt" => "",
        "id" => "",
      ],
      "ttl" => "<strong>Effect on Consumers</strong>",
      "txt" => "The possibility to address previously neglected needs of customers and communities is provided by new business models. Blockchain innovations in the medical sector offer ways to get around obstacles like remote patient care and record-keeping via networked smart medical devices and synced records.",
      "color" => "#EBF5FF",
    ]
  ]);
  $config = wedding_func_check_data('config', $atts, []);
  $config = wedding_func_process_config_block($config);
  $style_block = wedding_func_check_data('style_block', $config, '');

  ob_start(); ?>

  <div class="block block-blockchain">
    <div class="wrap">
        <div class="holder">
          <h4 class="title"> <?= $title ?> </h4>
          <div class="wrapper-item">
            <?php foreach ($items as $key => $item): ?>
              <?php
                $color = wedding_func_check_data("color", $item, "#F3F4FD");
                $ttl = wedding_func_check_data("ttl", $item, "Tiêu đề");
                $txt = wedding_func_check_data("txt", $item, "Mô tả");
                $image = wedding_IMAGE_DEFAULT;
                if($item['icon'] !== null && !empty($item['icon']['url'])){
                  $image = $item['icon']["url"];
                }
              ?>
              <div class="item" style="background: <?= $color; ?>;">
                <div class="subtitle">
                  <div class="image">
                    <img src="<?= $image ?>" alt="" class="img">
                  </div>
                  <div class="ttl"><?= $item['ttl'] ?></div>
                </div>
                <div class="txt"><?= $item['txt'] ?></div>
              </div>
              <?php ?>
            <?php endforeach ?>
          </div>
        </div>
      </div>
  </div>

<?php
  return ob_get_clean();
}
?>
