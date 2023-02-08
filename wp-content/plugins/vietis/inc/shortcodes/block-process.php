<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/process',
  'callback' => 'vietis_shortcode_block_process'
];

function vietis_shortcode_block_process($atts, $content)
{
  $title = vietis_func_check_data('title', $atts, '<strong>Process</strong>');

  $content = vietis_func_check_data('content', $atts, [
    [
      'title' => '<strong>Discovery</strong>',
      'icon' => [
        'url' => P_VIETIS_RESOURCE_HOST . '/assets/img/blocks/digital-transformation-service-page/product_lv1.png',
        'alt' =>  "",
        'id' => "",
      ],
      'tooltip' => [
        'title' => "",
        'lists' => "VietIS will go into detail about the experience you want to offer before diving into digital transformation. We will help you in this process by providing answers to the following questions: What, Where, and How?",
      ]
    ],
    [
      'title' => '<strong>Change</strong>',
      'icon' => [
        'url' => P_VIETIS_RESOURCE_HOST . '/assets/img/blocks/digital-transformation-service-page/product_lv2.png',
        'alt' =>  "",
        'id' => "",
      ],
      'tooltip' => [
        'title' => "",
        'lists' => "Before deciding to adopt technology, many firms don't take the time to consider what they actually need. This is a waste of time and resources and can result in digital fatigue.<br>Therefore, defining your objectives and desired outcomes can help you develop an effective digital transformation strategy. The appropriate technologies in line with the strategy for digital transformation will be offered by our knowledgeable experts.",
      ]
    ],
    [
      'title' => '<strong>Scale</strong>',
      'icon' => [
        'url' => P_VIETIS_RESOURCE_HOST . '/assets/img/blocks/digital-transformation-service-page/product_lv3.png',
        'alt' =>  "",
        'id' => "",
      ],
      'tooltip' => [
        'title' => "",
        'lists' => "The process of digital transformation is ongoing and has no defined end point. To assure your success, VietIS keeps its tech specialists up to date on the newest developments in technology.",
      ]
    ],
    [
      'title' => '<strong>Optimize</strong>',
      'icon' => [
        'url' => P_VIETIS_RESOURCE_HOST . '/assets/img/blocks/digital-transformation-service-page/product_lv4.png',
        'alt' =>  "",
        'id' => "",
      ],
      'tooltip' => [
        'title' => "",
        'lists' => "Take a step back as you execute improvements in your company to assess your progress and make any corrections. Then, you can discuss your progress and what isn't working with important stakeholders. In the future, VietIS will be available to help you with any additional upgrades.",
      ]
    ]
  ]);

  ob_start(); ?>
  <!-- Process -->
  <div class="block block-process-service">
    <div class="holder">
      <div class="wrap">
        <div class="ttl"><?= $title; ?></div>
        <ul class="content-solution">
          <?php foreach ($content as $value) : ?>
            <li class="item">
              <div class="img-wrap">
                <img class="img" src="<?= $value['icon']['url'] ? $value['icon']['url'] : VIETIS_IMAGE_DEFAULT ?>" alt="" />
              </div>
              <span class="txt"><?= $value['title'] ?></span>
              <?php if ($value['tooltip']['title'] || $value['tooltip']['lists']) : ?>
                <div class="popover">
                  <div class="arrow-tooltip"></div>
                  <div class="popover-body">
                    <?php if ($value['tooltip']['title']) : ?>
                      <div class="ttl">
                        <?= $value['tooltip']['title'] ?>
                      </div>
                    <?php endif; ?>

                    <?php if ($value['tooltip']['lists']) :
                      $lists = explode('<br>', $value['tooltip']['lists']);
                    ?>
                      <ul class="list">
                        <?php foreach ($lists as $val) : ?>
                          <?php if ($val) : ?>
                            <li class="item-popover"><?= $val ?></li>
                          <?php endif; ?>
                        <?php endforeach ?>
                      </ul>
                    <?php endif; ?>
                  </div>
                </div>
              <?php endif ?>
            </li>
          <?php endforeach ?>
        </ul>
      </div>
    </div>
  </div>
  <!-- END: Process -->
<?php
  return ob_get_clean();
}
