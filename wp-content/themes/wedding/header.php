<?php
require get_template_directory() . '/inc/theme_data.php';
?>

<!DOCTYPE html>
<html <?php language_attributes(); ?> <?php wedding_schema_type(); ?>>

<head>
  <meta charset="<?php bloginfo('charset'); ?>" />
  <title><?php wp_title(''); ?> <?php if (!wp_title('', false)) { echo 'wedding ';} ?><?php bloginfo('name'); ?></title>

  <meta name="viewport" content="width=device-width" />
  <link href="<?= RESOURCE_HOST ?>/img/favicon.ico" rel="shortcut icon">
  <?php wp_head(); ?>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-JR39Q71PP4"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-JR39Q71PP4');
  </script>
</head>

<body <?php body_class(); ?>>
  <?php wp_body_open(); ?>
  <header class="block block-header js-header <?= ((is_front_page() || is_home()) ? '' : 'header-child') ?>">
    <div class="holder header-inner">
      <div class="head">
        <a class="toggle js-toggle-menu" href="javascript:void(0);">
          <div class="line"></div>
          <div class="line"></div>
          <div class="line"></div>
        </a>
        <div class="logo">
          <a href="<?= get_home_url(); ?>" class="custom-logo-color" rel="home">
            <img class="custom-logo" src="<?= get_theme_mod('custom_logo_color', RESOURCE_HOST . '/img/logo_white.png'); ?>" alt="">
          </a>
        </div>
        <nav class="nav js-nav-pc">
          <?php
          $color = get_theme_mod("custom_header_color");
          wp_nav_menu([
            'menu_class'     => 'head-menu',
            'container'      => '',
            'theme_location' => 'header-menu',
          ]);
          ?>
        </nav>
        <style>
          .block-header .head-menu .menu-item a {
            color: <?= $color ?>
          }

          .block-header .header-inner .head .toggle .line {
            background-color: <?= $color ?>
          }

          .block-header .head-menu .menu-lnk-jp a {
            border: 1px solid <?= $color ?>
          }
        </style>
      </div>
    </div>

    <div class="header-sp js-header-sp">
      <div class="wrapper">
        <div class="head">
          <div class="logo">
            <?php the_custom_logo(); ?>
          </div>
          <a class="toggle js-toggle-menu" href="javascript:void(0);">
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
          </a>
        </div>
        <?php
        wp_nav_menu([
          'menu_class'     => 'header-sp-menu js-nav-sp',
          'container'      => '',
          'theme_location' => 'header-menu',
        ]);
        ?>
      </div>
    </div>
  </header>
  <!-- ./header -->
