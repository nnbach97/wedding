<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/develop-our-process',
  'callback' => 'vietis_shortcode_block_develop_our_process'
];

function vietis_shortcode_block_develop_our_process($atts, $content)
{
  $title = vietis_func_check_data('title', $atts, '<strong>Our Process</strong>', true);
  $steps = vietis_func_check_data("steps", $atts, [
    [
      "title" => "Exploration Stage",
      "txt" => "The assessment of the project and comprehension of your company's objectives are the primary objectives of the discovery stage of the development of bespoke software. Based on this demand elicitation, we create the most affordable technological solution and tailored software development methodology to jointly accomplish the set goals.</br>
        <br/>Based on the specifics and requirements of your project, our team develops an individual discovery plan with corresponding deliveries for the creation of custom software. Following the exploration phase, you will be given an interactive product prototype showing your future digital product. We will work together to complete the UX/UI design."
    ],
    [
      "title" => "UI/UX Design",
      "txt" => "Every one of our projects is driven by design, and UI/UX design is crucial to the discovery stage. As part of our bespoke software services, we create a design based on your project concept and organizational requirements while adhering to the project budget and timeframe. The creation of user-friendly software with an aesthetically beautiful interface is the ultimate goal of custom software development."
    ],
    [
      "title" => "Custom Software Development",
      "txt" => "This is the stage of developing custom software where the magic happens. Based on our high standards for software development, we pay particular attention to guaranteeing the product's stability and good performance (iOS, Android, Web Front-end, Web Back-end).</br>
          </br>In order to meet the project's budget and timeline, we use agile methodologies to track our work on a daily basis."
    ],
    [
      "title" => "Software Testing",
      "txt" => "Since the beginning of the custom software development lifecycle, we have integrated quality assurance (2-week sprints). This indicates that any new feature created during this time period is fully tested using hundreds of autotests and manual techniques.</br>
        </br>To make sure that previously developed features are not affected by new software functionality, we undertake regression testing in addition to routine functional, performance, regression, usability, and unit tests."
    ],
    [
      "title" => "Delivery",
      "txt" => "The solution is subsequently prepared for market entry and made accessible to final users."
    ],
    [
      "title" => "Maintenance",
      "txt" => "Our programmers will monitor the performance of your solution after it is operational and take user feedback into account to further enhance it. Following deployment, we additionally make any necessary modifications."
    ]
  ]);

  ob_start(); ?>

  <div class="block block-service-process">
    <div class="holder">
      <p class="title"><?= $title ?></p>
      <div class="wrap">
        <div class="line"></div>
        <div class="wrapper-item">
          <?php if($steps): ?>
            <?php foreach ($steps as $key => $item) : ?>
							<?php
								$ttl = vietis_func_check_data("title", $item, 'Your title', true);
								$txt = vietis_func_check_data("txt", $item, "Your description", true);
							?>
              <div class="item">
                <div class="number">
                  <p class="txt"><?= $key + 1 < 10 ? ("0" . ($key + 1)) : ($key + 1) ?></p>
                </div>
                <div class="text">
                  <p class="ttl"><?= $ttl ?></p>
                  <p class="txt"><?= $txt ?></p>
                </div>
              </div>
            <?php endforeach ?>
          <?php endif ?>
        </div>
      </div>
    </div>
  </div>

<?php
  return ob_get_clean();
}
