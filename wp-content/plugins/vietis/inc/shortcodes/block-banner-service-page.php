<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/banner-service-page',
  'callback' => 'wedding_shortcode_block_banner_service_page'
];

function wedding_shortcode_block_banner_service_page($atts, $content)
{
  $title = wedding_func_check_data('title', $atts, '<strong>Our services that serve your business needs</strong>');
  $description = wedding_func_check_data('description', $atts, 'At wedding, our customers’ business needs are at the center of everything we do. We don’t just deliver technological solutions – we provide services that offer tangible business value. To accomplish this, we help you decide on the most suitable approach and the best technology to meet your specific needs.');
  $title_process = wedding_func_check_data('title_process', $atts, '<strong>Process main service</strong>');
  $list_text_process = wedding_func_check_data('list_text_process', $atts, [
    'text1' => "Receive the Requirement",
    'text2' => "Understanding the requirement",
    'text3' => "Consultation/ interview",
    'text4' => "Quotation / contract",
    'text5' => "Development",
    'text6' => "Process Evaluation",
    'text7' => "Test",
    'text8' => "Maintenance",
  ]);


  ob_start(); ?>
  <!-- Banner -->
  <div class="block block-service-banner js-hero">
    <div class="holder banner-inner">
      <h2 class="ttl"><?= $title; ?></h2>
      <div class="des"><?= $description; ?></div>
    </div>
  </div>

  <!-- Process -->
  <div class="block block-process">
    <div class="holder process">
      <h2 class="ttl"><?= $title_process; ?></h2>

      <div class="process-left">
        <div class="js-animated-0 process-left-block process-left-block--first">
          <div class="process-left-item">
            <div class="process-left-item__txt"><?= $list_text_process['text1'] ?></div>
            <div class="process-num">
              <div class="process-num-in">
                <div>01</div>
              </div>
            </div>
          </div>
          <img class="js-animated-0 img" src="<?= P_wedding_RESOURCE_HOST . 'assets/img/blocks/banner-service-page/dash_01_left.svg' ?>" alt="" />
        </div>
        <div class="js-animated-1 process-left-block process-left-block--second">
          <div class="process-left-item">
            <div class="process-left-item__txt"><?= $list_text_process['text2'] ?></div>
            <div class="process-num">
              <div class="process-num-in">
                <div>02</div>
              </div>
            </div>
          </div>
          <img class="js-animated-1 img" src="<?= P_wedding_RESOURCE_HOST . 'assets/img/blocks/banner-service-page/dash_02_left.svg' ?>" alt="" />
        </div>
        <div class="js-animated-2 process-left-block process-left-block--third">
          <div class="process-left-item">
            <div class="process-left-item__txt"><?= $list_text_process['text3'] ?></div>
            <div class="process-num">
              <div class="process-num-in">
                <div>03</div>
              </div>
            </div>
          </div>
          <img class="js-animated-2 img" src="<?= P_wedding_RESOURCE_HOST . 'assets/img/blocks/banner-service-page/dash_03_left.svg' ?>" alt="" />
        </div>
        <div class="js-animated-3 process-left-block process-left-block--fourth">
          <div class="process-left-item">
            <div class="process-left-item__txt"><?= $list_text_process['text4'] ?></div>
            <div class="process-num">
              <div class="process-num-in">
                <div>04</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="process-mid">
        <img class="js-animated-9" src="<?= P_wedding_RESOURCE_HOST . 'assets/img/blocks/banner-service-page/dash_mid_top.svg' ?>" alt="">
        <img class="js-animated-4" src="<?= P_wedding_RESOURCE_HOST . 'assets/img/blocks/banner-service-page/dash_mid_bottom.svg' ?>" alt="">
      </div>

      <div class="process-right">
        <div class="js-animated-8 process-right-block process-right-block--first">
          <div class="process-right-item">
            <div class="process-num">
              <div class="process-num-in">
                <div>08</div>
              </div>
            </div>
            <div class="process-right-item__txt"><?= $list_text_process['text8'] ?></div>
          </div>
          <img class="js-animated-8 img" src="<?= P_wedding_RESOURCE_HOST . 'assets/img/blocks/banner-service-page/dash_03_right.svg' ?>" alt="" />
        </div>
        <div class="js-animated-7 process-right-block process-right-block--second">
          <div class="process-right-item">
            <div class="process-num">
              <div class="process-num-in">
                <div>07</div>
              </div>
            </div>
            <div class="process-right-item__txt"><?= $list_text_process['text7'] ?></div>
          </div>
          <img class="js-animated-7 img" src="<?= P_wedding_RESOURCE_HOST . 'assets/img/blocks/banner-service-page/dash_02_right.svg' ?>" alt="" />
        </div>
        <div class="js-animated-6 process-right-block process-right-block--third">
          <div class="process-right-item">
            <div class="process-num">
              <div class="process-num-in">
                <div>06</div>
              </div>
            </div>
            <div class="process-right-item__txt"><?= $list_text_process['text6'] ?></div>
          </div>
          <img class="js-animated-6 img" src="<?= P_wedding_RESOURCE_HOST . 'assets/img/blocks/banner-service-page/dash_01_right.svg' ?>" alt="" />
        </div>
        <div class="js-animated-5 process-right-block process-right-block--fourth">
          <div class="process-right-item">
            <div class="process-num">
              <div class="process-num-in">
                <div>05</div>
              </div>
            </div>
            <div class="process-right-item__txt"><?= $list_text_process['text5'] ?></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END: Process -->
  <!-- END: Banner -->
<?php
  return ob_get_clean();
}
