<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/blogs-featured',
  'callback' => 'vietis_shortcode_block_blogs_featured'
];

function vietis_shortcode_block_blogs_featured($atts, $content)
{
  ob_start(); ?>
    <?php
    $args = [
      'post_type' => 'post',
      'post_status' => 'publish',
      'orderby' => [
        'view_count_exists' => 'DESC',
        'post_date' => 'DESC',
      ],
      'meta_query' => [
          'relation' => 'OR',
          'view_count_exists' => [
              'key' => KEY_COUNT_VIEW,
              'compare' => 'EXISTS',
          ]
      ],
    ];
    $the_query = new WP_Query($args);
    ?>
    <?php if (is_active_sidebar('primary-widget-area')) : ?>
      <?php dynamic_sidebar('primary-widget-area'); ?>
    <?php endif; ?>

    <div class="sidebar-featured">
      <div class="holder">
        <div class="ttl"><?= __('Featured blogs', 'vietis'); ?></div>
        <?php if ($the_query->have_posts()) : ?>
          <ul class="list">
            <?php while ($the_query->have_posts()) : $the_query->the_post(); ?>
              <li class="item">
                <div class="img-wrap"><a href="<?= get_the_permalink(); ?>"><?= vietis_func_get_thumbnail('full'); ?></a></div>
                <div class="wrap">
                  <h3 class="ttl"><a href="<?= get_the_permalink(); ?>"><?= get_the_title(); ?></a></h3>
                  <div class="category"><?= vietis_get_post_primary_category(); ?></div>
                </div>
              </li>
            <?php endwhile;  ?>
          </ul>
        <?php else : echo vietis_func_no_content();
        endif; ?>
        <?php wp_reset_postdata(); ?>
      </div>
    </div>
<?php
  return ob_get_clean();
}
