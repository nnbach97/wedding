<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/veramine-technology',
  'callback' => 'vietis_shortcode_block_veramine_technology'
];

function vietis_shortcode_block_veramine_technology($atts, $content) 
{
  $items = vietis_func_check_data("item", $atts, [
    [
      "icon" => [
        "id" => 1,
        "url" => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/product/veramine/feature01.svg"
      ],
      "title" => "高精度<br/>アルゴリズム",
      "description" => "膨大なデータをあらゆる角度から深く分析、サイバー攻撃の兆候をリアルタイムに検知・可視化し、標的型攻撃などの高度なサイバー攻撃を阻止します。",
      "note" => "Veramine Endpoint Detection日れdRes 0れse (VEDR)"
    ],
    [
      "icon" => [
        "id" => 2,
        "url" => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/product/veramine/feature03.svg"
      ],
      "title" => "全てのエンドボイントをリアルタイムに監視",
      "description" => "企業が保有する数多くのエンドボイントに対し、マルウェアの感染や攻撃を検知し、影響範囲を特定、早期対応を実現します。",
      "note" => "Veramine P′Odu( ⅵ MOれ0 ng r00 (VPMT)"
    ],
    [
      "icon" => [
        "id" => 3,
        "url" => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/product/veramine/feature02.svg"
      ],
      "title" => "Deception<br/>テクノロジー",
      "description" => 'おとり環境へ標的型サイバー攻撃を誘導し攻撃者を・騙す"ソリューションで攻撃を 阻止します。',
      "note" => "Veramine DynamicDeception System (VDDS)"
    ],
    [
      "icon" => [
        "id" => 4,
        "url" => P_VIETIS_RESOURCE_HOST . "/assets/img/blocks/product/veramine/feature04.svg"
      ],
      "title" => "内部のセキュリティ違反<br/>もすぐ検知",
      "description" => 'あらゆるアクテイヒティをモ二タリングし悪意のあるすべての操作を検知できます。',
      "note" => "Veramine引de′ TわヨtPレeれ0 (VITP)"
    ],
  ]);
  $description = vietis_func_check_data("description", $atts, "昨今は、ゼロディ攻撃、標的型攻撃といった巧妙な手口を用いたサイバー攻撃が増えており、従来のセキュリティ対策ソフト( EPP)では攻撃を防ぐことが難しくなっています。<br>Veramineは、 会社が保有する全てのPC・ノートパソコン・サーバーの挙動を包括的にモニタリングすることができます。個々のデバイスではなく複数デバイスのデータを関連付けて分析するため、インシデント発生時にも感染経路や感染範囲を素早く特定し、被害を最小限に抑えることができます");
  $feature_text = vietis_func_check_data("feature_text", $atts, "昨今は、ゼロディ攻撃、標的型攻撃といった巧妙な手口を用いたサイバー攻撃が増えており、従来のセキュリティ対策ソフト(EPP)では攻撃を防ぐことが難しくなっています。<br />Veramineは、会社が保有する全てのPC・ノートパソコン・サーバーの挙動を包括的にモニタリングすることができます。個々のデバイスではなく複数デバイスのデータを関連付けて分析するため、インシデント発生時にも感染経路や感染範囲を素早く特定し、被害を最小限に抑えることができます");

  ob_start();
?>

  <div class="block block-veramine-technology">
    <div class="holder">
      <div class="list">
        <?php foreach($items as $item): ?>
          <?php 
            $image = vietis_func_check_data('icon', $item);
            $image_url = vietis_func_check_data('url', $image, VIETIS_IMAGE_DEFAULT, true);
            $title = vietis_func_check_data('title', $item, "Title", true);
            $description = vietis_func_check_data('description', $item, "Description", true);
            $note = vietis_func_check_data('note', $item, "Note");
          ?>
          <div class="item">
            <div class="header">
              <div class="img">
                <img src="<?= $image_url ?>" alt=""/>    
              </div>
              <p class="ttl"><?= $title ?></p>
            </div>
            <div class="main">
              <p class="desc"><?= $description ?></p>
              <?php if(trim($note) !== ""): ?>
              <p class="note"><?= $note ?></p>
              <?php endif ?>
            </div>
          </div>
        <?php endforeach ?>
      </div>
      <div class="feature-txt">
        <?= $feature_text ?>
      </div>
    </div>
  </div>

<?php
  return ob_get_clean();
}
?>