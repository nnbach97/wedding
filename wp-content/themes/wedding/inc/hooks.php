<?php

add_filter('show_admin_bar', '__return_false');

add_action('after_setup_theme', 'wedding_setup');
function wedding_setup()
{
  load_theme_textdomain('wedding', get_template_directory() . '/languages');
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
    'header-menu' => esc_html__('Header Menu', 'wedding'),
    'footer-menu' => esc_html__('Footer Menu', 'wedding'),
    'footer-social-menu' => esc_html__('Footer Social Menu', 'wedding'),
  ]);
}

add_action('admin_notices', 'wedding_notice');
function wedding_notice()
{
  $user_id = get_current_user_id();
  $admin_url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
  $param = (count($_GET)) ? '&' : '?';
  if (!get_user_meta($user_id, 'wedding_notice_dismissed_8') && current_user_can('manage_options'))
    echo '<div class="notice notice-info"><p><a href="' . esc_url($admin_url), esc_html($param) . 'dismiss" class="alignright" style="text-decoration:none"><big>' . esc_html__('Ⓧ', 'wedding') . '</big></a>' . wp_kses_post(__('<big><strong>📝 Thank you for using wedding!</strong></big>', 'wedding')) . '<br /><br /><a href="https://wordpress.org/support/theme/wedding/reviews/#new-post" class="button-primary" target="_blank">' . esc_html__('Review', 'wedding') . '</a> <a href="https://github.com/tidythemes/wedding/issues" class="button-primary" target="_blank">' . esc_html__('Feature Requests & Support', 'wedding') . '</a> <a href="https://calmestghost.com/donate" class="button-primary" target="_blank">' . esc_html__('Donate', 'wedding') . '</a></p></div>';
}

add_action('admin_init', 'wedding_notice_dismissed');
function wedding_notice_dismissed()
{
  $user_id = get_current_user_id();
  if (isset($_GET['dismiss']))
    add_user_meta($user_id, 'wedding_notice_dismissed_8', 'true', true);
}

add_action('wp_enqueue_scripts', 'wedding_enqueue');
function wedding_enqueue()
{
  wp_enqueue_style('wedding-style', get_stylesheet_uri());
  wp_enqueue_script('jquery');
}

add_action('wp_footer', 'wedding_footer');
function wedding_footer()
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

add_filter('document_title_separator', 'wedding_document_title_separator');
function wedding_document_title_separator($sep)
{
  $sep = esc_html('|');
  return $sep;
}

add_filter('the_title', 'wedding_title');
function wedding_title($title)
{
  if ($title == '') {
    return esc_html('...');
  } else {
    return wp_kses_post($title);
  }
}

add_filter('nav_menu_link_attributes', 'wedding_schema_url', 10);
function wedding_schema_url($atts)
{
  $atts['itemprop'] = 'url';
  return $atts;
}

if (!function_exists('wedding_wp_body_open')) {
  function wedding_wp_body_open()
  {
    do_action('wp_body_open');
  }
}

add_action('wp_body_open', 'wedding_skip_link', 5);
function wedding_skip_link()
{
  echo '<a href="#content" class="skip-link screen-reader-text">' . esc_html__('Skip to the content', 'wedding') . '</a>';
}

add_filter('the_content_more_link', 'wedding_read_more_link');
function wedding_read_more_link()
{
  if (!is_admin()) {
    return ' <a href="' . esc_url(get_permalink()) . '" class="more-link">' . sprintf(__('...%s', 'wedding'), '<span class="screen-reader-text">  ' . esc_html(get_the_title()) . '</span>') . '</a>';
  }
}

add_filter('excerpt_more', 'wedding_excerpt_read_more_link');
function wedding_excerpt_read_more_link($more)
{
  if (!is_admin()) {
    global $post;
    return ' <a href="' . esc_url(get_permalink($post->ID)) . '" class="more-link">' . sprintf(__('...%s', 'wedding'), '<span class="screen-reader-text">  ' . esc_html(get_the_title()) . '</span>') . '</a>';
  }
}

add_filter('big_image_size_threshold', '__return_false');
add_filter('intermediate_image_sizes_advanced', 'wedding_image_insert_override');
function wedding_image_insert_override($sizes)
{
  unset($sizes['medium_large']);
  unset($sizes['1536x1536']);
  unset($sizes['2048x2048']);
  return $sizes;
}

add_action('widgets_init', 'wedding_widgets_init');
function wedding_widgets_init()
{
  register_sidebar(array(
    'name' => esc_html__('Sidebar Blog', 'wedding'),
    'id' => 'sidebar-widget-blog',
    'before_widget' => '<div id="%1$s" class="widget-container %2$s">',
    'after_widget' => '</div>',
    'before_title' => '<h3 class="widget-title">',
    'after_title' => '</h3>',
  ));

  register_sidebar(array(
    'name' => esc_html__('Sidebar Single', 'wedding'),
    'id' => 'sidebar-widget-single',
    'before_widget' => '<div id="%1$s" class="widget-container %2$s">',
    'after_widget' => '</div>',
    'before_title' => '<h3 class="widget-title">',
    'after_title' => '</h3>',
  ));

  register_sidebar(array(
    'name' => esc_html__('Work List', 'wedding'),
    'id' => 'work-list-widget',
    'before_widget' => '<div id="%1$s" class="widget-container %2$s">',
    'after_widget' => '</div>',
    'before_title' => '<h3 class="widget-title">',
    'after_title' => '</h3>',
  ));
}

add_action('wp_head', 'wedding_pingback_header');
function wedding_pingback_header()
{
  if (is_singular() && pings_open()) {
    printf('<link rel="pingback" href="%s" />' . "\n", esc_url(get_bloginfo('pingback_url')));
  }
}

add_action('comment_form_before', 'wedding_enqueue_comment_reply_script');
function wedding_enqueue_comment_reply_script()
{
  if (get_option('thread_comments')) {
    wp_enqueue_script('comment-reply');
  }
}

function wedding_custom_pings($comment)
{
?>
  <li <?php comment_class(); ?> id="li-comment-<?php comment_ID(); ?>"><?php echo esc_url(comment_author_link()); ?></li>
<?php
}

add_filter('get_comments_number', 'wedding_comment_count', 0);
function wedding_comment_count($count)
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
      $params = wedding_get_all_params();
      $keyword = wedding_func_check_data('keyword', $params, '');
      $category = wedding_func_check_data('category', $params, []);
      $tag = wedding_func_check_data('work-tag', $params, []);
      if ($keyword) $query->set('s', $keyword);
      if ($category) {
        $query->set('tax_query', [
          [
            'taxonomy' => wedding_TAXONOMY_WORKS_CATEGORY,
            'field' => 'term_id',
            'terms' => $category,
            'operator' => 'IN',
          ]
        ]);
      }
      if ($tag) {
        $query->set('tax_query', [
          [
            'taxonomy' => wedding_TAXONOMY_WORKS_TAG,
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
