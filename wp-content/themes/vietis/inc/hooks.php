<?php

add_filter('show_admin_bar', '__return_false');

add_action('after_setup_theme', 'vietis_setup');
function vietis_setup()
{
  load_theme_textdomain('vietis', get_template_directory() . '/languages');
  add_theme_support( 'custom-logo');
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_theme_support('responsive-embeds');
  add_theme_support('automatic-feed-links');
  add_theme_support('html5', array('search-form', 'navigation-widgets'));
  add_theme_support('woocommerce');
  global $content_width;
  if (!isset($content_width)) {
    $content_width = 1920;
  }
  register_nav_menus([
    'header-menu' => esc_html__('Header Menu', 'vietis'),
    'footer-menu' => esc_html__('Footer Menu', 'vietis'),
    'footer-social-menu' => esc_html__('Footer Social Menu', 'vietis'),
  ]);
}

add_action('admin_notices', 'vietis_notice');
function vietis_notice()
{
  $user_id = get_current_user_id();
  $admin_url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
  $param = (count($_GET)) ? '&' : '?';
  if (!get_user_meta($user_id, 'vietis_notice_dismissed_8') && current_user_can('manage_options'))
    echo '<div class="notice notice-info"><p><a href="' . esc_url($admin_url), esc_html($param) . 'dismiss" class="alignright" style="text-decoration:none"><big>' . esc_html__('Ⓧ', 'vietis') . '</big></a>' . wp_kses_post(__('<big><strong>📝 Thank you for using vietis!</strong></big>', 'vietis')) . '<br /><br /><a href="https://wordpress.org/support/theme/vietis/reviews/#new-post" class="button-primary" target="_blank">' . esc_html__('Review', 'vietis') . '</a> <a href="https://github.com/tidythemes/vietis/issues" class="button-primary" target="_blank">' . esc_html__('Feature Requests & Support', 'vietis') . '</a> <a href="https://calmestghost.com/donate" class="button-primary" target="_blank">' . esc_html__('Donate', 'vietis') . '</a></p></div>';
}

add_action('admin_init', 'vietis_notice_dismissed');
function vietis_notice_dismissed()
{
  $user_id = get_current_user_id();
  if (isset($_GET['dismiss']))
    add_user_meta($user_id, 'vietis_notice_dismissed_8', 'true', true);
}

add_action('wp_enqueue_scripts', 'vietis_enqueue');
function vietis_enqueue()
{
  wp_enqueue_style('vietis-style', get_stylesheet_uri());
  wp_enqueue_script('jquery');
}

add_action('wp_footer', 'vietis_footer');
function vietis_footer()
{
?>
  <script>
    jQuery(document).ready(function($) {
      var deviceAgent = navigator.userAgent.toLowerCase();
      if (deviceAgent.match(/(iphone|ipod|ipad)/)) {
        $("html").addClass("ios");
        $("html").addClass("mobile");
      }
      if (deviceAgent.match(/(Android)/)) {
        $("html").addClass("android");
        $("html").addClass("mobile");
      }
      if (navigator.userAgent.search("MSIE") >= 0) {
        $("html").addClass("ie");
      } else if (navigator.userAgent.search("Chrome") >= 0) {
        $("html").addClass("chrome");
      } else if (navigator.userAgent.search("Firefox") >= 0) {
        $("html").addClass("firefox");
      } else if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
        $("html").addClass("safari");
      } else if (navigator.userAgent.search("Opera") >= 0) {
        $("html").addClass("opera");
      }
    });
  </script>
<?php
}

add_filter('document_title_separator', 'vietis_document_title_separator');
function vietis_document_title_separator($sep)
{
  $sep = esc_html('|');
  return $sep;
}

add_filter('the_title', 'vietis_title');
function vietis_title($title)
{
  if ($title == '') {
    return esc_html('...');
  } else {
    return wp_kses_post($title);
  }
}

add_filter('nav_menu_link_attributes', 'vietis_schema_url', 10);
function vietis_schema_url($atts)
{
  $atts['itemprop'] = 'url';
  return $atts;
}

if (!function_exists('vietis_wp_body_open')) {
  function vietis_wp_body_open()
  {
    do_action('wp_body_open');
  }
}

add_action('wp_body_open', 'vietis_skip_link', 5);
function vietis_skip_link()
{
  echo '<a href="#content" class="skip-link screen-reader-text">' . esc_html__('Skip to the content', 'vietis') . '</a>';
}

add_filter('the_content_more_link', 'vietis_read_more_link');
function vietis_read_more_link()
{
  if (!is_admin()) {
    return ' <a href="' . esc_url(get_permalink()) . '" class="more-link">' . sprintf(__('...%s', 'vietis'), '<span class="screen-reader-text">  ' . esc_html(get_the_title()) . '</span>') . '</a>';
  }
}

add_filter('excerpt_more', 'vietis_excerpt_read_more_link');
function vietis_excerpt_read_more_link($more)
{
  if (!is_admin()) {
    global $post;
    return ' <a href="' . esc_url(get_permalink($post->ID)) . '" class="more-link">' . sprintf(__('...%s', 'vietis'), '<span class="screen-reader-text">  ' . esc_html(get_the_title()) . '</span>') . '</a>';
  }
}

add_filter('big_image_size_threshold', '__return_false');
add_filter('intermediate_image_sizes_advanced', 'vietis_image_insert_override');
function vietis_image_insert_override($sizes)
{
  unset($sizes['medium_large']);
  unset($sizes['1536x1536']);
  unset($sizes['2048x2048']);
  return $sizes;
}

add_action('widgets_init', 'vietis_widgets_init');
function vietis_widgets_init()
{
  register_sidebar(array(
    'name' => esc_html__('Sidebar Blog', 'vietis'),
    'id' => 'sidebar-widget-blog',
    'before_widget' => '<div id="%1$s" class="widget-container %2$s">',
    'after_widget' => '</div>',
    'before_title' => '<h3 class="widget-title">',
    'after_title' => '</h3>',
  ));

  register_sidebar(array(
    'name' => esc_html__('Sidebar Single', 'vietis'),
    'id' => 'sidebar-widget-single',
    'before_widget' => '<div id="%1$s" class="widget-container %2$s">',
    'after_widget' => '</div>',
    'before_title' => '<h3 class="widget-title">',
    'after_title' => '</h3>',
  ));

  register_sidebar(array(
    'name' => esc_html__('Work List', 'vietis'),
    'id' => 'work-list-widget',
    'before_widget' => '<div id="%1$s" class="widget-container %2$s">',
    'after_widget' => '</div>',
    'before_title' => '<h3 class="widget-title">',
    'after_title' => '</h3>',
  ));
}

add_action('wp_head', 'vietis_pingback_header');
function vietis_pingback_header()
{
  if (is_singular() && pings_open()) {
    printf('<link rel="pingback" href="%s" />' . "\n", esc_url(get_bloginfo('pingback_url')));
  }
}

add_action('comment_form_before', 'vietis_enqueue_comment_reply_script');
function vietis_enqueue_comment_reply_script()
{
  if (get_option('thread_comments')) {
    wp_enqueue_script('comment-reply');
  }
}

function vietis_custom_pings($comment)
{
?>
  <li <?php comment_class(); ?> id="li-comment-<?php comment_ID(); ?>"><?php echo esc_url(comment_author_link()); ?></li>
<?php
}

add_filter('get_comments_number', 'vietis_comment_count', 0);
function vietis_comment_count($count)
{
  if (!is_admin()) {
    global $id;
    $get_comments = get_comments('status=approve&post_id=' . $id);
    $comments_by_type = separate_comments($get_comments);
    return count($comments_by_type['comment']);
  } else {
    return $count;
  }
}

add_action( 'pre_get_posts', function($query){
  if ( ! is_admin() && $query->is_main_query() ) {
    $query->set('post_status', 'publish');
    if(is_archive('works')) {
      $params = vietis_get_all_params();
      $keyword = vietis_func_check_data('keyword', $params, '');
      $category = vietis_func_check_data('category', $params, []);
      $tag = vietis_func_check_data('work-tag', $params, []);
      if ($keyword) $query->set('s', $keyword);
      if ($category) {
        $query->set('tax_query', [
          [
            'taxonomy' => VIETIS_TAXONOMY_WORKS_CATEGORY,
            'field' => 'term_id',
            'terms' => $category,
            'operator' => 'IN',
          ]
        ]);
      }
      if ($tag) {
        $query->set('tax_query', [
          [
            'taxonomy' => VIETIS_TAXONOMY_WORKS_TAG,
            'field' => 'term_id',
            'terms' => $tag,
            'operator' => 'IN',
          ]
        ]);
      }

      // pr($query);
    }
  }
});

function mytheme_setup() {
  add_theme_support('custom-logo');
}

add_action('after_setup_theme', 'mytheme_setup');
