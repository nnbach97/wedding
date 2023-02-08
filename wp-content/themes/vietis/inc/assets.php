<?php
class vietis_theme_assets
{
  public function __construct()
  {
    add_action('wp_print_scripts', [$this, 'load_script_user']);
    add_action('wp_enqueue_scripts', [$this, 'load_style_user']);
    add_action('admin_enqueue_scripts', [$this, 'load_admin_style_script']);
  }

  public function load_admin_style_script()
  {
  }

  public function load_script_user()
  {
    wp_register_script('theme-main', RESOURCE_HOST . '/js/main.js', ['jquery'], '5.2.4');
    wp_enqueue_script('theme-main');

    wp_register_script('search-form', RESOURCE_HOST . '/js/search-form.js', ['jquery'], '5.2.5');
    wp_enqueue_script('search-form');

    if (is_page_template('template-contact.php')) {
      wp_register_script('form-contact', RESOURCE_HOST . '/js/form.js', ['jquery'], '5.2.5');
      wp_enqueue_script('form-contact');
    }

    if (is_page_template('template-service-default.php')) {
      wp_register_script('service', RESOURCE_HOST . '/js/service.js', ['jquery'], '5.2.4');
      wp_enqueue_script('service');
    }

    if (is_page_template('template-product-default.php')) {
      wp_register_script('product', RESOURCE_HOST . '/js/products.js', ['jquery'], '5.2.4');
      wp_enqueue_script('product');
    }

    if (is_singular('works')) {
      wp_register_script('works', RESOURCE_HOST . '/js/casestudy-detail.js', ['jquery'], '1.2');
      wp_enqueue_script('works');
    }
  }

  public function load_style_user()
  {
    wp_register_style('base', RESOURCE_HOST . '/css/base.css', [], '1.3');
    wp_enqueue_style('base');

    wp_register_style('404', RESOURCE_HOST . '/css/pages/page404.css', [], '1.2');
    wp_enqueue_style('404');

    wp_register_style('sidebar', RESOURCE_HOST . '/css/sidebar.css', [], '1.2');
    wp_enqueue_style('sidebar');

    if (is_page()) {
      wp_register_style('theme-page', RESOURCE_HOST . '/css/page.css', [], '1.2');
      wp_enqueue_style('theme-page');
    }

    if (is_page_template('template-contact.php')) {
      wp_register_style('contact', RESOURCE_HOST . '/css/pages/contact.css', [], '1.4');
      wp_enqueue_style('contact');
    }

    if (is_page_template('template-service-default.php')) {
      wp_register_style('services', RESOURCE_HOST . '/css/pages/services.css', [], '1.3');
      wp_enqueue_style('services');
    }

    if (is_page_template('template-product-default.php')) {
      wp_register_style('product', RESOURCE_HOST . '/css/pages/product.css', [], '1.2');
      wp_enqueue_style('product');
    }

    if (is_archive('works')) {
      wp_register_style('casestudy', RESOURCE_HOST . '/css/pages/casestudy.css', [], '1.4');
      wp_enqueue_style('casestudy');
    }

    if (is_page_template('template-blogs.php')) {
      wp_register_style('blogs', RESOURCE_HOST . '/css/pages/blogs.css', [], '1.3');
      wp_enqueue_style('blogs');
    }

    if (is_single()) {
      wp_register_style('single', RESOURCE_HOST . '/css/single.css', [], '1.4');
      wp_enqueue_style('single');
    }

    if (is_front_page() || is_home()) {
      wp_register_style('home', RESOURCE_HOST . '/css/pages/home.css', [], '1.2');
      wp_enqueue_style('home');
    }
  }
}

new vietis_theme_assets();
