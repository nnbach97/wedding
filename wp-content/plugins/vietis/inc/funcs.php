<?php

if (!function_exists('vietis_func_check_data')) {
  function vietis_func_check_data($name, $object = [], $default = '', $check_empty = false)
  {
    if ($check_empty) {
      return isset($object[$name]) && $object[$name] ? $object[$name] : $default;
    }
    return isset($object[$name]) ? $object[$name] : $default;
  }
}

if (!function_exists('vietis_func_no_content')) {
  function vietis_func_no_content($mgs = '')
  {
    return '<div class="no-content">' . ($mgs ? $mgs : __('No content', 'comics')) . '</div>';
  }
}

if (!function_exists('vietis_func_get_image_default')) {
  function vietis_func_get_image_default($link = false, $class = '')
  {
    $img = VIETIS_IMAGE_DEFAULT;
    if ($link) return $img;
    return '<img src="' . $img . '" alt="image-default" class="image-default ' . $class . '">';
  }
}

if (!function_exists('vietis_func_get_thumbnail')) {
  function vietis_func_get_thumbnail($size = 'medium', $default = null)
  {
    global $post;
    return has_post_thumbnail() ? get_the_post_thumbnail($post, $size, [
      'class' => 'lazyload',
    ]) : ($default ? $default : vietis_func_get_image_default());
  }
}

if (!function_exists('vietis_func_get_thumbnail_large')) {
  function vietis_func_get_thumbnail_large($size = 'large', $default = null)
  {
    global $post;
    return has_post_thumbnail() ? get_the_post_thumbnail($post, $size, [
      'class' => 'lazyload',
    ]) : ($default ? $default : vietis_func_get_image_default());
  }
}

if (!function_exists('vietis_func_get_thumbnail_url')) {
  function vietis_func_get_thumbnail_url($size = 'medium', $default = null)
  {
    global $post;
    return has_post_thumbnail() ? get_the_post_thumbnail_url($post, $size) : ($default ? $default : vietis_func_get_image_default(true));
  }
}

if (!function_exists('vietis_func_get_attachment_image')) {
  function vietis_func_get_attachment_image($attachment_id, $size = 'medium', $default = null)
  {
    if (!$attachment_id) return false;
    $image = wp_get_attachment_image_src($attachment_id, $size);
    if (isset($image[0]) && $image[0]) {
      return $image[0];
    }
    return vietis_func_get_image_default(true);
  }
}

if (!function_exists('vietis_func_process_config_block')) {
  function vietis_func_process_config_block($config)
  {
    if (!$config) return [];

    $data = [];

    $data['style_block'] = '';
    $method = vietis_func_check_data('bg_method', $config);
    $bg_color = vietis_func_check_data('bg_color', $config);
    if ($method == 'color' && $bg_color) {
      $data['style_block'] .= 'background: ' . $bg_color . ';';
    }

    $images = vietis_func_check_data('bg_image', $config);

    if ($method == 'image' && isset($images[0]) && !empty($images[0])) {
      $bg_size = vietis_func_check_data('backgroundSize', $config);
      $bg_position = vietis_func_check_data('backgroundPosition', $config);
      $bg_repeat = vietis_func_check_data('backgroundRepeat', $config);
      if ($bg_size) {
        $data['style_block'] .= 'background-size: ' . $bg_size . ';';
      }
      if ($bg_position) {
        $data['style_block'] .= 'background-position: ' . $bg_position . ';';
      }
      if ($bg_repeat) {
        $data['style_block'] .= 'background-repeat: ' . $bg_repeat . ';';
      }
      $bg_url = vietis_func_check_data('url', $images[0]);
      $data['style_block'] .= 'background-image: url(' . $bg_url . ');';
    }

    $margin = vietis_func_check_data('margin', $config);
    if ($margin) {
      $top = vietis_func_check_data('top', $margin);
      $right = vietis_func_check_data('right', $margin);
      $bottom = vietis_func_check_data('bottom', $margin);
      $left = vietis_func_check_data('left', $margin);
      if ($top) $data['style_block'] .= 'margin-top: ' . $top . ';';
      if ($right) $data['style_block'] .= 'margin-right: ' . $right . ';';
      if ($bottom) $data['style_block'] .= 'margin-bottom: ' . $bottom . ';';
      if ($left) $data['style_block'] .= 'margin-left: ' . $left . ';';
    }

    $padding = vietis_func_check_data('padding', $config);
    if ($padding) {
      $top = vietis_func_check_data('top', $padding);
      $right = vietis_func_check_data('right', $padding);
      $bottom = vietis_func_check_data('bottom', $padding);
      $left = vietis_func_check_data('left', $padding);
      if ($top) $data['style_block'] .= 'padding-top: ' . $top . ';';
      if ($right) $data['style_block'] .= 'padding-right: ' . $right . ';';
      if ($bottom) $data['style_block'] .= 'padding-bottom: ' . $bottom . ';';
      if ($left) $data['style_block'] .= 'padding-left: ' . $left . ';';
    }

    return $data;
  }
}

if (!function_exists('get_post_primary_category')) {
  function get_post_primary_category($post_id, $term = 'category', $return_all_categories = true)
  {
    $return = array();

    if (class_exists('WPSEO_Primary_Term')) {
      // Show Primary category by Yoast if it is enabled & set
      $wpseo_primary_term = new WPSEO_Primary_Term($term, $post_id);
      $primary_term = get_term($wpseo_primary_term->get_primary_term());

      if (!is_wp_error($primary_term)) {
        $return['primary_category'] = $primary_term;
      }
    }

    if (empty($return['primary_category']) || $return_all_categories) {
      $categories_list = get_the_terms($post_id, $term);

      if (empty($return['primary_category']) && !empty($categories_list)) {
        $return['primary_category'] = $categories_list[0];  //get the first category
      }
      if ($return_all_categories) {
        $return['all_categories'] = array();

        if (!empty($categories_list)) {
          foreach ($categories_list as &$category) {
            $return['all_categories'][] = $category;
          }
        }
      }
    }

    return $return;
  }
}

if (!function_exists('vietis_get_post_primary_category')) {
  function vietis_get_post_primary_category($post_id = null, $taxonomy = 'category')
  {
    if ($post_id === null) {
      global $post;
      $post_id = $post->ID;
    }

    if (!$post_id) return;
    $post_categories = get_post_primary_category($post_id, $taxonomy);

    if ($post_categories['all_categories']) {
      foreach ($post_categories['all_categories'] as $key => $page) {
        $name = $page->name;
        echo '<span class="category-item">' . $name . '</span>';
      }
    }
  }
}

if (!function_exists('vietis_get_all_params')) {
  function vietis_get_all_params()
  {
    return $_REQUEST;
  }
}

if (!function_exists('vietis_pagination')) {
  function vietis_pagination($custom_query = null, $is_echo = true)
  {
    if ($custom_query) {
      $query = $custom_query;
    } else {
      global $wp_query;
      $query = $wp_query;
    }

    $pages = paginate_links(array(
      'base'         => str_replace(999999999, '%#%', esc_url(get_pagenum_link(999999999))),
      'total'        => $query->max_num_pages,
      'current'      => max(1, get_query_var('paged')),
      'format'       => '?paged=%#%',
      'show_all'     => false,
      'type'         => 'array',
      'end_size'     => 2,
      'mid_size'     => 1,
      'prev_next'    => true,
      'prev_text'    => __('Prev', 'vietis'),
      'next_text'    => __('Next', 'vietis'),
      'add_args'     => false,
      'add_fragment' => '',
    ));
    $html = '';
    if (isset($pages) && !empty($pages)) {
      if ($is_echo) {
        echo '<ul class="pagination clearstyle">';
        foreach ($pages as $key => $page) {
          echo '<li>' . $page . '</li>';
        }
        echo '</ul>';
      } else {
        $html .= '<ul class="pagination clearstyle">';
        foreach ($pages as $key => $page) {
          $html .= '<li>' . $page . '</li>';
        }
        $html .= '</ul>';
        return $html;
      }
    }
  }
}

if (!function_exists('vietis_breadcrumb')) {
  function vietis_breadcrumb()
  {
    $breadcrumb = [];
    $breadcrumb[] = [
      'title' => __('Home'),
      'link' => home_url('/'),
    ];

    if (is_archive()) {
      global $wp_query;
      $object = get_queried_object();
      $post_type = vietis_func_check_data('post_type', $wp_query->query);
      $breadcrumb[] = [
        'title' => $object->label,
        // 'link' => get_post_type_archive_link($post_type),
      ];
    }

    if (is_search()) {
      $breadcrumb[] = [
        'title' => get_search_query(),
      ];
    }

    if (is_page()) {
      global $post;
      if ($post->post_parent !== 0) {
        $breadcrumb[] = [
          'title' => get_the_title($post->post_parent),
          'link' => get_the_permalink($post->post_parent),
        ];
      }

      $breadcrumb[] = [
        'title' => get_the_title($post),
        // 'link' => get_the_permalink($post),
      ];
    }

    if (is_single()) {
      global $post;
      if ($post->post_type == 'post') {
        $breadcrumb[] = [
          'title' => __('Blogs', 'vietis'),
          'link' => home_url('/blogs/'),
        ];
      } else if ($post->post_type == 'works') {
        $breadcrumb[] = [
          'title' => __('Case Study', 'vietis'),
          'link' => home_url('/works/'),
        ];
      }

      $post_categories = get_post_primary_category($post->ID);
      $primary_category = vietis_func_check_data('primary_category', $post_categories);
      // if ($primary_category) {
      // 	$breadcrumb[] = [
      // 		'title' => $primary_category->name,
      // 		'link' => get_term_link($primary_category),
      // 	];
      // }

      // $breadcrumb[] = [
      // 	'title' => get_the_title($post),
      // 	// 'link' => get_the_permalink($post),
      // ];
    }

    $html = '';
    if ($breadcrumb) {
      $html .= '<div class="block block-breadcrumbs"><ul>';
      foreach ($breadcrumb as $value) {
        $title = vietis_func_check_data('title', $value);
        if (!$title) continue;
        $link = vietis_func_check_data('link', $value);
        $html .= '<li>';
        $html .= $link ? '<a href="' . esc_attr($link) . '" title="' . esc_attr($title) . '">' : '';
        $html .= $title;
        $html .= $link ? '</a>' : '';
        $html .= '</li>';
      }
      $html .= '</ul></div>';
    }

    return $html;
  }
}

if (!function_exists('vietis_format_number_humanize')) {
  function vietis_format_number_humanize($number)
  {
    $abbrevs = array(12 => "T", 9 => "B", 6 => "M", 3 => "K", 0 => "");
    foreach ($abbrevs as $exponent => $abbrev) {
      if ($number >= pow(10, $exponent)) {
        $display_num = $number / pow(10, $exponent);
        $decimals = ($exponent >= 3 && round($display_num) < 100) ? 1 : 0;
        return number_format($display_num, $decimals) . $abbrev;
      }
    }
    return $number;
  }
}
