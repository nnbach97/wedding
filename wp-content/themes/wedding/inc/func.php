<?php

if (!function_exists('wedding_schema_type')) {
  function wedding_schema_type()
  {
    $schema = 'https://schema.org/';
    if (is_single()) {
      $type = "Article";
    } elseif (is_author()) {
      $type = 'ProfilePage';
    } elseif (is_search()) {
      $type = 'SearchResultsPage';
    } else {
      $type = 'WebPage';
    }
    echo 'itemscope itemtype="' . esc_url($schema) . esc_attr($type) . '"';
  }
}

if (!function_exists('template_mail')) {
  function template_mail($title, $content)
  {
    require get_template_directory() . '/inc/theme_data.php';
    $html = '';

    $html .= '<!DOCTYPE html>';
    $html .= '<html>';
    $html .= '<body>';
    $html .= '<div style="font-size:14px;line-height:1.4;font-weight:400;margin:0px;background-color:#f9667e73;padding:80px">';
    $html .= '<div style="max-width:580px;width:100%;border:0px;margin-right:auto;margin-left:auto;font-weight:500">';
    $html .= '<div style="background-color:#ffffff;font-weight:500;padding: 20px;">';
    $html .= '<div style="padding: 10px;">';
    $html .= '<h2 style="text-align: center; position: relative; margin: 0 0 30px; color: #000">';
    $html .= $title;
    $html .= '</h2>';
    $html .= $content;
    $html .= '</div>';
    $html .= '</div>';
    $html .= '</div>';
    $html .= '</div>';
    $html .= '</body>';
    $html .= '</html>';
    return $html;
  }
}

if(!function_exists('wedding_work_related')) {
  function wedding_work_related($postID, $taxCategory = [], $perPage = 3) {
    $tag_ids = [];
    if (!empty($taxCategory)) {
        foreach ($taxCategory as $key => $tag) {
            $tag_ids[] = (isset($tag->term_id) ? $tag->term_id : []);
        }
    }
    
    $args = [
      'post_type' => get_post_type(),
      'post__not_in' => [$postID],
      'posts_per_page' => $perPage > 0 ? $perPage : 3,
      'post_status' => 'publish',

      'tax_query' => array(
        array(
            'taxonomy' => wedding_TAXONOMY_WORKS_CATEGORY,
            'field'    => 'term_id',
            'terms'    => $tag_ids,
            'operator' => 'IN',
        )
      ),
    ];

    $result = new WP_Query($args);

    if ($result->have_posts()) { ?>
      <?php while ($result->have_posts()) : $result->the_post(); ?>
        <?php $category = get_the_terms(get_the_ID(), wedding_TAXONOMY_WORKS_CATEGORY);  ?>
        <div class="item">
          <div class="img-wrap">
            <a href="<?= get_the_permalink(); ?>">
              <?= wedding_func_get_thumbnail(); ?>
              <p class="date"><?= __("Date done", "wedding") ?>: <?= get_the_date("m/Y"); ?></p>
            </a>
          </div>
          <div class="wrap">
            <h3 class="ttl"><a href="<?= get_the_permalink(); ?>"><?= get_the_title(); ?></a></h3>
            <ul class="tags">
              <?php foreach($category as $tax) : ?>
              <li class="tags-item"><?= $tax->name ?></li>
              <?php endforeach ?>
            </ul>
          </div>
        </div>
      <?php endwhile; ?>
    <?php
    }
    else{
      wedding_func_no_content();
    }
    wp_reset_postdata();
    return false;
  }
}
