<?php
class theme_customizer
{
  public function __construct()
  {
    add_action('customize_register', [$this, 'addSections']);
  }

  public function addSections($wp_customize)
  {
    $wp_customize->add_setting('custom_logo_color', [
      'default' => RESOURCE_HOST . '/img/logo_color.png',
    ]);

    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'custom_logo_color', [
      'label'       => __('Logo chính', 'VIETIS'),
      'section'     => 'title_tagline',
      'settings'    => 'custom_logo_color',
      'height'      => 117,
      'width'       => 28,
      'flex-height' => true,
      'flex-width'  => true,
      'header-text' => ['site-title', 'site-description'],
      'priority'    => 49,
    ]));

    $wp_customize->add_setting('custom_header_color', [
      'default' => '#454545',
    ]);

    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'custom_header_color', [
      'label'       => __('Màu header', 'VIETIS'),
      'section'     => 'title_tagline',
    ]));

  }
}

new theme_customizer();
