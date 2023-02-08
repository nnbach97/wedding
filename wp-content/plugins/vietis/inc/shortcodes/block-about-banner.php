<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/about-banner',
  'callback' => 'vietis_shortcode_block_about_banner'
];

function vietis_shortcode_block_about_banner($atts, $content)
{
  $title = vietis_func_check_data('ttl', $atts, '<strong>About us</strong>');
  $text = vietis_func_check_data('txt', $atts, 'We are very grateful for working with you.<br><br>Our company VietIS was established in 2009 in Hanoi, focusing on thehighly demanding quality markets such as Japanese and APAC. Wealways work hard, highly disciplined to provide reliable offshoresoftware services at affordable cost but high quality. We are offeringseveral services: <strong>Application Development/Maintenance, DigitalTransformation, UI/UX Design, Engineer Dispatch.</strong><br><br>Our broad experience allows us to create many type applications inmany type of platforms with front-end, web, mobile technologies andprogramming languages such as Java, PHP, Java Scripts, .NET, NodeJS ...and back-end enterprise applications, cloud computing solution withAWS, Microsoft Azure, Google Cloud. We have many engineers speakinggood Japanese, English to work with you from early stages of project asrequirement hearing, UI/ UX design to later stages as detailed design,coding, testing and deployment.<br><br><strong>We are looking forward to becoming your trusted tech- partner, wefeel happy and excited to see your products succeed on the marketand we are always available to support you.</strong>');
  $role = vietis_func_check_data('role', $atts, 'CEO <strong>Dang Dieu Linh</strong>');
  $config = vietis_func_check_data('config', $atts, []);
  $config = vietis_func_process_config_block($config);
  $style_block = vietis_func_check_data('style_block', $config, '');

  ob_start(); ?>

  <div class="block block-about-banner js-hero" style="<?= esc_attr($style_block); ?>">
    <div class="holder">
      <div class="wrapper">
        <div class="content">
          <h3 class="ttl"><?= $title;?></h3>
          <?php if (function_exists('vietis_breadcrumb')) echo vietis_breadcrumb(); ?>
          <p class="txt"><?= $text; ?></p>
          <div class="role">
            <p class="desc"><?= $role; ?></span></p>
          </div>
        </div>
        <div class="img">
          <img src="<?= P_VIETIS_RESOURCE_HOST . '/assets/img/blocks/about-banner/about-img01.png' ?>" alt="">
        </div>
      </div>
    </div>
  </div>
<?php
  return ob_get_clean();
}
