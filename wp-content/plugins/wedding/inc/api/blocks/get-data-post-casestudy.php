<?php

/**
 * API
 */
class class_wedding_plugin_get_data_post_casestudy extends class_wedding_plugin_api
{
  public function __construct()
  {
    add_action('wp_ajax_get_post_casestudy', [$this, 'get_post_casestudy']);
    add_action('wp_ajax_nopriv_get_post_casestudy', [$this, 'get_post_casestudy']);
  }
  public function get_post_casestudy($data = [])
  {
    if (!$data) $data = $_POST;
    $posttype = wedding_func_check_data('post_type', $data, 'works');
    $posts_per_page = wedding_func_check_data('posts_per_page', $data, get_option('posts_per_page'));
    $orderby = wedding_func_check_data('orderby', $data, 'date');
    $order = wedding_func_check_data('order', $data, 'DESC');
    $highlight_post_only = wedding_func_check_data('highlight_post_only', $data, "0");

    $args = [
      'post_type' => $posttype,
      'posts_per_page' => $posts_per_page,
      'orderby' => $orderby,
      'order' => $order,
      'post_status' => 'publish',
    ];

    $html = '';

    if($highlight_post_only === "1"){
      $args['meta_query'] = [
        [
        'key'     => 'isHighlight',
        'value'   => "true",
        'compare' => '==',
        ]
      ];
    }

    $the_query = new WP_Query($args);

    if ($the_query->have_posts()) {
      $count = 1;
      $revert = false;
      while ($the_query->have_posts()) {
        $the_query->the_post();
        $taxonomy_technology = get_the_terms(get_the_ID(), wedding_TAXONOMY_TECHNOLOGY);
        $taxonomy_scope = get_the_terms(get_the_ID(), wedding_TAXONOMY_SCOPE);
        $link_release = get_post_meta(get_the_ID(), 'link_release');
        $link_detail = get_the_permalink(get_the_ID());
        $html .= '<div class="caseStudy">';
        if(is_admin()) {
          $html .= '<div class="content">';
        } else {
          $html .= '<div class="content wow' . ($revert ? ' slideInRight' : ' slideInLeft') . '">';
        }
        $html .= '<div class="wrap">';
        $html .= '<div class="title">';
        $html .= '<a href="'. $link_detail .'"><h3 class="ttl">' . get_the_title() . '</h3></a>';
        $html .= '<span class="shadow shadow--primary">' . ($count < 10 ? '0' . $count : $count) . 'Case study</span>';
        $html .= '</div>';
        $html .= '<div class="description">' . get_the_excerpt() . '</div>';

        if (!empty($taxonomy_technology)) {
          $html .= '<div class="subtitle">Technologies</div>';
          $html .= '<ul class="detail">';
          foreach ($taxonomy_technology as $value) {
            $term_meta = get_term_meta($value->term_id, 'category-image-id', true);
            $image = wp_get_attachment_image($term_meta);
            if ($image !== null && $image !== '') {
              $html .= '<li class="item">' . $image . '</li>';
            }
          }
          $html .= '</ul>';
        }

        if (!empty($taxonomy_scope)) {
          $html .= '<div class="subtitle">Business Supported</div>';
          $html .= '<div class="detail">';
          foreach ($taxonomy_scope as $key => $value) {
            $html .= $value->name;
            if (($key + 1) < count($taxonomy_scope)) {
              $html .= ', ';
            }
          }
          $html .= '</div>';
        }

        if (!empty($link_release)) {
          foreach ($link_release as $key => $value) {
            if ($value) {
              $html .= '<div class="subtitle">Release Achievement</div>';
              $html .= '<div class="detail">';
              $html .= '<a href="' . $value . '" class="lnk">' . $value . '</a>';
              $html .= '</div>';
            }
          }
        }

        $html .= '</div>';
        $html .= '</div>';
        if(is_admin()) {
          $html .= '<div class="img">';
        } else {
          $html .= '<div class="img wow' . ($revert ? ' slideInLeft' : ' slideInRight') . '">';
        }
        $html .= '<div class="wrap">';

        $background_img = wedding_func_get_thumbnail_large();
        $html .= $background_img;

        $html .= '</div>';
        $html .= '</div>';
        $html .= '</div>';
        $count++;
        $revert = !$revert;
      }
    } else {
      $html .= wedding_func_no_content();
    }

    wp_reset_postdata();
    $this->response['data']['html'] = $html;

    return $this->response();
  }
}

new class_wedding_plugin_get_data_post_casestudy();
