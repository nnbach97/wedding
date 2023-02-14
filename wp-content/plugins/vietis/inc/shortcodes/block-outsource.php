<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/outsource',
  'callback' => 'wedding_shortcode_block_outsource'
];

function wedding_shortcode_block_outsource($atts, $content)
{
  $title = wedding_func_check_data('title', $atts, '<strong>Why Outsource Your IT Services?</strong>');
  $title_shadow = wedding_func_check_data('title_shadow', $atts, 'Why Outsource');
  $image = wedding_func_check_data('image', $atts, [
    "url" => P_wedding_RESOURCE_HOST . "/assets/img/blocks/outsource/outsource_img.png",
    'alt' => '',
    'id' => '',
  ]);
  $whys = wedding_func_check_data('whys', $atts, [
    [
      'title' => 'Save Costs',
      'text' => 'It takes a lot of resources to manage IT. In addition to money and time, hardware and software need to be purchased, installed, and maintained. Additionally, hiring, training, retaining, and managing IT workers costs money and time. You can lower operational costs by outsourcing your IT services and lowering the price associated with these vital IT resources. Additionally, you will spend less on hiring, firing, annual bonuses, health insurance, retirement payments, and other expenses.'
    ],
    [
      'title' => 'Simplify Procurement',
      'text' => 'By using Outsourcing Service, you don’t have to take care of the necessary hardware (such as computers and other office equipment).'
    ],
    [
      'title' => 'Flexibly Scalable',
      'text' => 'Different firms have different IT requirements. yet occasionally, the requirements of a firm can also shift. Your business’ other essential components won’t be put under undue strain as a result of the scalability you’ll have with an IT partner that can adapt to your needs at any time.'
    ],
    [
      'title' => 'Utilise more experience',
      'text' => 'You may get much more experience by outsourcing your IT services to a skilled provider, which is almost hard for an in-house IT team to do. This is because companies that provide outsourced IT services have a wide range of expertise from working with various organizations and their various IT requirements.'
    ],
  ]);
  $text_meeting = wedding_func_check_data('text_meeting', $atts, '<strong>Looking for a Long-Term Technical Partner?</strong>');
  $text_button_meeting = wedding_func_check_data('text_button_meeting', $atts, 'Arrange Meeting Right Now!');
  $modal_meeting = wedding_func_check_data('modal_meeting', $atts, [
    'title_modal' => 'Exec partnership meeting',
    'link' => 'https://meetings.hubspot.com/ken-nguyen1?embed=true'
  ]);

  ob_start(); ?>
  <div class="block block-outsource">
    <div class="holder outsource-inner wow fadeInUp">
      <div class="wrap">
        <img src="<?= $image['url'] ?>" alt="" class="img">
        <div class="content">
          <div class="title">
            <h3 class="ttl"><?= $title; ?></h3>
            <span class="shadow shadow--primary"><?= $title_shadow; ?></span>
          </div>
          <ul class="list js-list-whys">
            <?php foreach ($whys as $key => $value) : ?>
              <?php if ($value['title']) : ?>
                <li class="item">
                  <div class="ttl js-outsource-toggle <?= $key !== 0 ? 'wow fadeInDown' : '' ?>" data-wow-delay="<?= $key * 0.2 ?>s"><span><?= $value['title'] ?></span><i class="fa-solid fa-chevron-down ttl-icon"></i></div>
                  <p class="txt js-outsource-expand"><?= $value['text'] ?></p>
                </li>
              <?php endif; ?>
            <?php endforeach ?>
          </ul>
        </div>
      </div>
      <div class="call-meeting">
        <div class="meeting-wrap">
          <div class="txt"><?= $text_meeting ?></div>
          <button class="btn js-modal-toggle-meeting"><?= $text_button_meeting ?></button>
        </div>
      </div>
    </div>

    <!-- Modal meeting -->
    <div class="modal modal-meeting">
      <div class="modal-overlay js-modal-toggle-meeting"></div>
      <div class="modal-wrapper">
        <div class="modal-header">
          <button class="modal-close js-modal-toggle-meeting">
            <i class="fa fa-times icon-close-modal" aria-hidden="true"></i>
          </button>
          <h3 class="modal-ttl"><?= $modal_meeting['title_modal']; ?></h3>
        </div>
        <div class="modal-body js-calendar">
          <div class="meetings-iframe-container" data-src="<?= $modal_meeting['link']; ?>"></div>
        </div>
      </div>
    </div>
    <!--END: Modal meeting -->

  </div>
<?php
  return ob_get_clean();
}
