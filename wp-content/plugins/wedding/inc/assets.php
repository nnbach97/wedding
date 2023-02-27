<?php
class wedding_plugin_assets
{
  public function __construct()
  {
    add_action('wp_print_scripts', [$this, 'load_script']);
    add_action('wp_enqueue_scripts', [$this, 'load_style']);
    add_action('admin_enqueue_scripts', [$this, 'load_admin_style_script']);
  }

  public function get_param()
  {
    $params = [
      'PV_URL_AJAX' => admin_url('admin-ajax.php'),
      'PV_BASE_URL' => P_wedding_RESOURCE_HOST,
      'HOST' => get_site_url(),
      'SECURITY' => wp_create_nonce('wedding_SECURITY'),
      'is_user_logged_in' => is_user_logged_in(),
      'is_single' => is_single(),
      'PV_RESOURCE_HOST' => get_template_directory_uri(),
    ];

    $theme_options = (array)theme_options::get_theme_options();
    $params = array_merge($params, $theme_options);
    return $params;
  }

  public function load_admin_style_script()
  {
    wp_register_style('bootstrap', P_wedding_RESOURCE_HOST . 'assets/libs/bootstrap/bootstrap.min.css', [], '1.0');
    wp_enqueue_style('bootstrap');

    wp_register_style('block', P_wedding_RESOURCE_HOST . 'assets/css/block.css', [], '1.2');
    wp_enqueue_style('block');

    wp_register_style('style', P_wedding_RESOURCE_HOST . 'assets/css/admin/style.css', [], '1.2');
    wp_enqueue_style('style');

    wp_register_script('bootstrap', P_wedding_RESOURCE_HOST . 'assets/libs/bootstrap/bootstrap.min.js', ['jquery'], '1.0');
    wp_enqueue_script('bootstrap');

    wp_enqueue_media();

    wp_register_script('main-admin', P_wedding_RESOURCE_HOST . 'assets/js/admin/main.js', ['jquery'], '1.2');
    wp_enqueue_script('main-admin');

    wp_localize_script('create-block-wedding-editor-script', 'PV_Admin', $this->get_param());
  }

  public function load_script()
  {

    wp_localize_script('jquery-core', 'PV_Admin', $this->get_param());

    wp_register_script('slick', 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js', ['jquery'], '1.1');
    wp_enqueue_script('slick');

    wp_register_script('fancybox', 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.js', ['jquery'], '1.1');
    wp_enqueue_script('fancybox');

    wp_register_script('main', P_wedding_RESOURCE_HOST . 'assets/js/main.js', ['jquery'], '1.1');
    wp_enqueue_script('main');

    wp_register_script('wow', P_wedding_RESOURCE_HOST . 'assets/js/wow.min.js', ['jquery'], '1.1');
    wp_enqueue_script('wow');

    wp_register_script('home', P_wedding_RESOURCE_HOST . 'assets/js/block.js', ['jquery'], '1.9');
    wp_enqueue_script('home');

    wp_register_script('gallary', P_wedding_RESOURCE_HOST . 'assets/js/gallary.js', ['jquery'], '1.9');
    wp_enqueue_script('gallary');
  }

  public function load_style()
  {
    wp_register_style('awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css', [], '6.2.2');
    wp_enqueue_style('awesome');

    wp_register_style('animate', 'https://cdn.rawgit.com/daneden/animate.css/v3.1.0/animate.min.css', [], '1.1');
    wp_enqueue_style('animate');

    wp_register_style('slick-theme', 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.css', []);
    wp_enqueue_style('slick-theme');

    wp_register_style('slick-min', 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css', []);
    wp_enqueue_style('slick-min');

    wp_register_style('fancybox-min', 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.css', []);
    wp_enqueue_style('fancybox-min');

    wp_register_style('block', P_wedding_RESOURCE_HOST . 'assets/css/block.css', [], '1.2');
    wp_enqueue_style('block');
  }
}

new wedding_plugin_assets();
