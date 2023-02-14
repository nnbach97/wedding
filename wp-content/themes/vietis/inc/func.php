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
    $html .= '<div style="font-size:14px;line-height:1.4;font-weight:400;margin:0px;background-color:#eeeeee;padding-top:20px">';
    $html .= '<div style="max-width:580px;width:100%;border:0px;margin-right:auto;margin-left:auto;font-weight:500">';
    $html .= '<div style="background-color:#ffffff;font-weight:500">';
    $html .= '<div style="text-align:center;padding:18px 0">';
    $html .= '<a href=""><img src="' . RESOURCE_HOST . '/img/logo_color.png" alt="" width="170"></a>';
    $html .= '</div>';
    $html .= '<div style="background: #14479c; color: #fff; padding: 10px; text-align: center;">';
    $html .= '<p><strong style="font-size: 18px;">' . $company_name_vi . '</strong></p>';
    $html .= '</div>';

    $html .= '<div style="padding: 10px;">';
    $html .= '<h2 style="text-align: center; position: relative; margin: 50px 0; color: #000">';
    $html .= $title;
    $html .= '<span style="height: 8px;display: block;width: 40px;border-radius: 4px;background: #ffe000;margin: 5px auto;"></span>';
    $html .= '</h2>';
    $html .= '<br>';
    $html .= $content;
    $html .= '</div>';

    $html .= '<div style="padding: 10px;background: #14479c;color: #fff; margin-top: 30px;">';
    $html .= '<p style="text-align: center; position: relative; padding-bottom: 26px; text-transform: uppercase;">';
    $html .= '<strong>' . __("Contact Info", "wedding") . ':</strong>';
    $html .= '<span style="height: 8px;display: block;width: 40px;border-radius: 4px;background: #ffe000;margin: 5px auto;"></span>';
    $html .= '</p>';
    $html .= '<div>';
    $html .= '<p style="text-transform: uppercase; color: #fff""><strong>' . __("Vietnam", "wedding") . ':</strong></p>';
    $html .= '<ul style="list-style: none;padding: 0;margin: 0;line-height: 22px;">';
    $html .= '<li style="display: block; color: #fff"">' . __("Headquarters", "wedding") . '：' . $company_name_vi . '</li>';
    $html .= '<li style="display: block; color: #fff"">' . $address_vi . '</li>';
    $html .= '<li style="display: block; color: #fff"">TEL: <a href="tel:' . $phone_vi . '" style="color: #fff">' . $phone_vi . '</a></li>';
    $html .= '<li style="display: block; color: #fff">EMAIL: <a style="color: #fff" href="mailto: ' . $contact_email . '">' . $contact_email . '</a></li>';
    $html .= '</ul>';
    $html .= '</div>';
    $html .= '<hr style: "width: 40%">';
    $html .= '<div>';
    $html .= '<p style="text-transform: uppercase; color: #fff""><strong>' . __("Japane", "wedding") . ':</strong></p>';
    $html .= '<ul style="list-style: none;padding: 0;margin: 0;line-height: 22px;">';
    $html .= '<li style="display: block; color: #fff">' . __("Japanese legal entity", "wedding") . '：' . $company_name_jp . '</li>';
    // if (pll_current_language() === "ja") {
    //     $html .= '<li style="display: block; color: #fff">' . $address_jp_01 . '<br>' . $address_jp_02 . '</li>';
    // } else {
    //     $html .= '<li style="display: block; color: #fff">' . $address_en_01 . '<br>' . $address_en_02 . '</li>';
    // }
    $html .= '<li style="display: block; color: #fff">TEL： <a href="tel:' . $phone_jp . '" style="color: #fff">' . $phone_jp . '</a></li>';
    $html .= '<li style="display: block; color: #fff">EMAIL: <a style="color: #fff" href="mailto: ' . $contact_email . '">' . $contact_email . '</a></li>';
    $html .= '</ul>';
    $html .= '</div>';
    $html .= '<hr>';
    $html .= '<p style="text-align: center; color: #fff"">Copyright © 2022 wedding Corporation. All Rights Reserved.</p>';
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
