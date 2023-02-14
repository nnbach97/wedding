<?php wedding_class_views::set_view_count(); get_header(); ?>
<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
  <!-- Banner -->
  <div class="block common-block-banner js-hero">
    <div class="overlay"></div>
    <div class="banner-bg">
      <?= wedding_func_get_thumbnail('full'); ?>
    </div>
    <div class="banner-inner">
      <h1 class="ttl"><a href="<?= get_the_permalink(); ?>"><?= get_the_title(); ?></a></h1>
      <?php if (function_exists('wedding_breadcrumb')) echo wedding_breadcrumb(); ?>
      <div class="des"><?= get_the_date(); ?> / <?= wedding_get_post_primary_category(); ?></div>
    </div>
  </div>
  <!-- END: Banner -->
  <!-- Blogs -->
  <div class="block block-blogs-detail">
    <div class="holder">
      <div class="blogs-inner">
        <div class="content">
          <?php get_template_part('entry', 'content'); ?>
          <div class="new-nav">
            <?php
              $next = get_previous_post();
              $disableNext = !$next || $next->ID == get_the_ID();
              $prev = get_next_post();
              $disablePrev = !$prev || $prev->ID == get_the_ID();
            ?>
            <a class="btn-prev <?= $disablePrev ? 'disabled' : ''; ?>" href="<?= get_the_permalink(get_next_post()) ?>"><?= __("Previous post", "wedding") ?></a>
            <a class="btn-next <?= $disableNext ? 'disabled' : ''; ?>" href="<?= get_the_permalink(get_previous_post()) ?>"><?= __("Next post", "wedding") ?></a>
          </div>
        </div>
        <?php get_sidebar('single'); ?>
      </div>
    </div>
  </div>
  <!-- END: Blogs -->
<?php endwhile; endif; ?>
<?php get_footer(); ?>
