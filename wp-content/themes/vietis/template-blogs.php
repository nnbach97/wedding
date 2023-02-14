<?php get_header(); /* Template Name: Template Blogs */ ?>

<?php if (have_posts()) : while (have_posts()) : the_post(); ?>

  <!-- Banner -->
  <div class="block common-block-banner js-hero">
    <div class="overlay"></div>
    <div class="banner-bg">
      <?= wedding_func_get_thumbnail('full'); ?>
    </div>
    <div class="banner-inner">
      <h2 class="ttl"><?= __("Blogs", "wedding") ?></h2>
      <?php if (function_exists('wedding_breadcrumb')) echo wedding_breadcrumb(); ?>
    </div>
  </div>
  <!-- END: Banner -->

  <!-- Blogs -->
  <div class="block block-blogs">
    <div class="holder">
      <div class="blogs-inner">
        <?php
        $params = wedding_get_all_params();
        $keyword = wedding_func_check_data('keyword', $params, '');
        $category = wedding_func_check_data('category', $params, null);

        $args = [
          'post_type' => 'post',
          'post_status' => 'publish',
          'paged' => max(1, get_query_var('paged')),
        ];

        if ($keyword) $args['s'] = $keyword;
        if ($category) $args['category__in'] = $category;
        ?>
        <?php $the_query = new WP_Query($args); ?>
        <div class="content">
          <?php if ($the_query->have_posts()) : ?>
            <div class="list">
              <?php while ($the_query->have_posts()) : $the_query->the_post(); ?>
                <div class="item">
                  <div class="img-wrap">
                    <a href="<?= get_the_permalink(); ?>">
                      <?= wedding_func_get_thumbnail('full'); ?>
                    </a>
                  </div>
                  <div class="wrap">
                    <div class="head">
                      <div class="category"><?= wedding_get_post_primary_category(); ?></div>
                      <div class="time"><?= get_the_date(); ?></div>
                    </div>
                    <div class="blogs-wrap">
                      <h3 class="ttl"><a href="<?= get_the_permalink(); ?>"><?= get_the_title(); ?></a></h3>
                      <div class="des"><?= get_the_excerpt(); ?></div>
                    </div>
                  </div>
                </div>
              <?php endwhile;  ?>
            </div>
          <?php else : echo wedding_func_no_content();
          endif; ?>
          <?php wp_reset_postdata(); ?>
        </div><!-- /.content -->

        <?php get_sidebar(); ?>

        <?php get_template_part('pagination', null, ['custom_query' => $the_query]); ?>
      </div>
    </div>
  </div>
  <!-- END: Blogs -->

<?php endwhile;
endif; ?>
<?php get_footer(); ?>
