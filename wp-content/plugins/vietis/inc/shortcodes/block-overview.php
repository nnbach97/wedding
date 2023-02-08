<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/overview',
  'callback' => 'vietis_shortcode_block_overview'
];

function vietis_shortcode_block_overview($atts, $content)
{
  $config = vietis_func_check_data('config', $atts, []);
  $config = vietis_func_process_config_block($config);
  $style_block = vietis_func_check_data('style_block', $config, '');
  $title = vietis_func_check_data('title', $atts, '<strong>Company overview</strong>');
  $title_shadow = vietis_func_check_data('title_shadow', $atts, 'VietIS');
  $theme_options = theme_options::get_theme_options();
  // VietIS Corporation
  $company_name_vi = vietis_func_check_data('company_name_vi', $theme_options, '');
  $year_of_incorporation_vi = vietis_func_check_data('year_of_incorporation_vi', $theme_options, '');
  $representative_vi = vietis_func_check_data('representative_vi', $theme_options, '');
  $address_vi = vietis_func_check_data('address_vi', $theme_options, '');
  $phone_vi = vietis_func_check_data('phone_vi', $theme_options, '');

  // VietIS Solution
  $company_name_jp = vietis_func_check_data('company_name_jp', $theme_options, '');
  $year_of_incorporation_jp = vietis_func_check_data('year_of_incorporation_jp', $theme_options, '');
  $representative_jp = vietis_func_check_data('representative_jp', $theme_options, '');
  $address_jp_01 = vietis_func_check_data('address_jp_01', $theme_options, '');
  $address_jp_02 = vietis_func_check_data('address_jp_02', $theme_options, '');
  $phone_jp = vietis_func_check_data('phone_jp', $theme_options, '');

  // Us office
  $company_name_us = vietis_func_check_data('company_name_us', $theme_options, '');
  $address_us = vietis_func_check_data('address_us', $theme_options, '');

  // VietIS FinTech
  $company_name_fin = vietis_func_check_data('company_name_fin', $theme_options, '');
  $address_fin = vietis_func_check_data('address_fin', $theme_options, '');


  ob_start(); ?>

  <div class="block block-overview" style="<?= esc_attr($style_block); ?>">
    <div class="holder">
      <div class="title text-center">
      <h3 class="ttl"><?= $title; ?></h3>
        <span class="shadow"><?= $title_shadow; ?></span>
      </div>

      <div class="wrapper-item">
        <div class="item">
          <div class="title"><?= $company_name_vi; ?></div>
          <div class="content">
            <div class="text text--underline">
              <p class="ttl"><?= __('Year of incorporation', 'vietis'); ?></p>
              <p class="txt"><?= $year_of_incorporation_vi; ?></p>
            </div>
            <div class="text text--underline">
              <p class="ttl"><?= __('Representative', 'vietis'); ?></p>
              <p class="txt"><?= $representative_vi; ?></p>
            </div>
            <div class="text text--column">
              <p class="ttl"><?= __('Contact Info', 'vietis'); ?></p>
              <div class="address">
                <p class="txt"><?= $address_vi; ?></p>
              </div>
            </div>
            <div class="text">
              <span>Tel: </span><span><a href="tel:<?= $phone_vi ?>"><?= $phone_vi; ?></a></span>
            </div>
          </div>
        </div>

        <div class="item">
          <div class="title"><?= $company_name_jp; ?></div>
          <div class="content content--bg">
            <div class="text text--underline">
              <p class="ttl"><?= __('Year of incorporation', 'vietis'); ?></p>
              <p class="txt"><?= $year_of_incorporation_jp; ?></p>
            </div>
            <div class="text text--underline">
              <p class="ttl"><?= __('Representative', 'vietis'); ?></p>
              <p class="txt"><?= $representative_jp; ?></p>
            </div>
            <div class="text text--column">
              <p class="ttl"><?= __('Contact Info', 'vietis'); ?></p>
              <div class="address">
                <p class="txt"><?= $address_jp_01; ?></p>
                <p class="sub"><?= $address_jp_02; ?></p>
              </div>
            </div>
            <div class="text">
              <span>Tel: </span><span><a href="tel:<?= $phone_jp ?>"><?= $phone_jp; ?></a></span>
            </div>
          </div>
        </div>

        <div class="item">
          <div class="title"><?= $company_name_us; ?></div>
          <div class="content content--center content--bg">
            <div class="text text--column">
              <p class="ttl"><?= __('Contact Info', 'vietis'); ?></p>
              <div class="address">
                <p class="txt"><?= $address_us; ?></p>
              </div>
            </div>
          </div>
        </div>

        <div class="item">
          <div class="title"><?= $company_name_fin; ?></div>
          <div class="content content--center">
            <div class="text">
              <p class="ttl"><?= __('Representative', 'vietis'); ?></p>
              <p class="txt"><?= $representative_vi; ?></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
<?php
  return ob_get_clean();
}
