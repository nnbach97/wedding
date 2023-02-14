<?php

/**
 * API
 */
class class_wedding_plugin_get_data_post extends class_wedding_plugin_api {
  public function __construct() {
    add_action('wp_ajax_get_post', [$this, 'get_post']);
    add_action('wp_ajax_nopriv_get_post', [$this, 'get_post']);
  }

  public function get_post($data = []) {
    if (!$data) $data = $_POST;
    $posttype = wedding_func_check_data('post_type', $data, 'post');
    $posts_per_page = wedding_func_check_data('posts_per_page', $data, get_option('posts_per_page'));
    $orderby = wedding_func_check_data('orderby', $data, 'date');
    $order = wedding_func_check_data('order', $data, 'DESC');

    $args = [
      'post_type' => $posttype,
      'posts_per_page' => $posts_per_page,
      'orderby' => $orderby,
      'order' => $order,
      'post_status' => 'publish',
    ];
    $html = '';
    $the_query = new WP_Query($args);
    if ( $the_query->have_posts() ) {
      while ( $the_query->have_posts() ) {
        $the_query->the_post();
        $html .= '<div class="item">';
          $html .= '<div class="wrap">';
            $html .= '<div class="img">';
              $html .= wedding_func_get_thumbnail();
            $html .= '</div>';
            $html .= '<div class="text">';
              $html .= '<h3 class="ttl">';
                $html .=  get_the_title();
              $html .= '</h3>';
              $html .= '<div class="txt">'.get_the_excerpt().'</div>';
            $html .= '</div>';
          $html .= '</div>';
        $html .= '</div>';
      }
      // $html .= '</div>';
    } else {
      $html .= wedding_func_no_content();
    }

    wp_reset_postdata();
    $this->response['data']['html'] = $html;
    return $this->response();
  }
}

new class_wedding_plugin_get_data_post();
