<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/veramine-banner',
  'callback' => 'vietis_shortcode_block_veramine_banner'
];

function vietis_shortcode_block_veramine_banner($atts, $content)
{
  $title = vietis_func_check_data('title', $atts, 'テレワークのデバイス環<br/>境をセキュアに保つ');
  if($title === "" || $title === null) $title = "Your title";
  $header = vietis_func_check_data('header_txt', $atts, 'アメリカ国防総省、空軍、国土安全保障省なとて導入済み!');
  if($header === "" || $header === null) $header = "Your header";
  $des = vietis_func_check_data('description', $atts, '従来のセキュリティ対策ソフトでは対応できないサイバー攻撃を阻止!');
  if($des === "" || $des === null) $des = "Your description";
  $logo = vietis_func_check_data('logo', $atts, [
    "url" => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/product/veramine/logo_veramin.svg",
    "alt" => '',
    'id' => 1,
  ]);
  $logo_url = vietis_func_check_data('url', $logo, VIETIS_IMAGE_DEFAULT);
  $image = vietis_func_check_data('image', $atts, [
    "url" => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/product/veramine/icon_baner_veramin.svg",
    "alt" => '',
    'id' => 1,
  ]);
  $image_url = vietis_func_check_data('url', $image, VIETIS_IMAGE_DEFAULT);
  $steps = vietis_func_check_data('steps', $atts, [
    [
      "text" => "クラウドとオンプレミス いすれにも対応",
      "color" => "#F3F4FD"
    ],
    [
      "text" => "強力なすべての機能を 1つのセンサーに バッケージ化",
      "color" => "#EDFAFE"
    ],
    [
      "text" => "CPU 1 % 20M3 AMで負荷がかからない",
      "color" => "#EBF5FF"
    ],
  ]);
  ob_start(); ?>

  <div class="block block-veramine-banner" id="product-veramine">
    <div class="holder">
      <div class="header">
        <div class="logo">
          <img src="<?=$logo_url?>" alt=""/>
        </div>
        <p class="header-txt"><?=$header?></p>
      </div>

      <div class="content">
        <div class="desc">
          <h2 class="ttl"><?=$title?></h2>
          <div class="txt"><?=$des?></div>
        </div>
        <div class="img">
          <img src="<?=$image_url?>" alt=""/>
        </div>
      </div>

      <ul class="list">
        <?php foreach($steps as $step): ?>
          <?php $text = vietis_func_check_data('text', $step, "Your description", true) ?>
          <li class="item"><span><?=$text?></span></li>
        <?php endforeach ?>
      </ul>
    </div>
  </div>

<?php
  return ob_get_clean();
}
?>
