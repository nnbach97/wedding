<?php get_header(); ?>

<?php
  global $wp_query;
  $object = get_queried_object();
  $post_type = vietis_func_check_data('post_type', $wp_query->query);
  $action = get_post_type_archive_link($post_type);
  $total = $wp_query->found_posts;
?>

<div class="block-casestudy-list">
  <!-- Banner -->
  <?php if (is_active_sidebar('work-list-widget')) dynamic_sidebar('work-list-widget'); ?>
  <!-- END: Banner -->

  <?php
    $params = vietis_get_all_params();
    $keyword = vietis_func_check_data('keyword', $params, '');
    $category = vietis_func_check_data('category', $params, []);
    $tag = vietis_func_check_data('work-tag', $params, []);
  ?>

  <!-- Search -->
  <div class="multisearch">
    <div class="holder">
      <form action="<?= $action; ?>" method="GET" class="multisearch-form">
        <input type="hidden" name="h" value="">
        <div class="multisearch-form__wrap">
          <div class="multisearch-form-item">
            <a href="#" class="multisearch-form-item__cap js-itemCap">Categories</a>
            <div class="multisearch-form-item-check js-itemCheck" style="display: none;">
              <?= form_checkbox_term('category', [
                'label' => false,
                'value' => $category,
                'taxonomy' => VIETIS_TAXONOMY_WORKS_CATEGORY,
              ]); ?>
            </div>
          </div>

          <div class="multisearch-form-item multisearch-form-item--tag">
            <a href="" class="multisearch-form-item__cap js-itemCap">Tags</a>
            <div class="multisearch-form-item-check js-itemCheck" style="display: none;">
              <?= form_checkbox_term('work-tag', [
                'label' => false,
                'value' => $tag,
                'taxonomy' => VIETIS_TAXONOMY_WORKS_TAG,
              ]); ?>
            </div>
          </div>
          <div class="multisearch-form-item multisearch-form-item--result">
            <span class="multisearch-form-item__txt"><?= sprintf(__('%s Results'), $total); ?></span>
          </div>

          <div class="multisearch-form-item multisearch-form-item--search">
            <input type="search" class="multisearch-form-item__input" name="keyword" value="<?= esc_attr($keyword); ?>" placeholder="<?= __("Search news", 'vietis') ?>">
            <button type="submit" class="multisearch-form-item__btn"><img src="<?= RESOURCE_HOST . '/img/casestudy/icon-search.svg' ?>" alt=""></button>
          </div>
        </div>
      </form>
    </div>
  </div>
  <!-- END: Search -->

  <!-- Content -->
  <div class="content">
    <div class="holder">
      <?php if (have_posts()) : ?>
        <div class="list">
          <?php while (have_posts()) : the_post(); ?>
            <div class="item">
              <div class="img-wrap">
                <a href="<?= get_the_permalink(); ?>">
                  <?= vietis_func_get_thumbnail('full'); ?>
                  <p class="date"><?= __("Date done", "vietis") ?>: <?= get_the_date(DATE_FORMAT_WORKS); ?></p>
                </a>
              </div>
              <div class="wrap">
                <h3 class="ttl"><a href="<?= get_the_permalink(); ?>"><?= get_the_title(); ?></a></h3>
                <ul class="tags">
                  <?php $category = get_the_terms(get_the_ID(), VIETIS_TAXONOMY_WORKS_CATEGORY); ?>
                  <?php if ($category): ?>
                    <?php foreach ($category as $item) : ?>
                      <li class="tags-item"><?= $item->name ?></li>
                    <?php endforeach ?>
                  <?php endif; ?>
                </ul>
              </div>
            </div>
          <?php endwhile; ?>
        </div>
      <?php else : ?>
        <?= vietis_func_no_content(); ?>
      <?php endif; ?>
    </div>
  </div>
  <!-- END: Content -->
  <?php get_template_part('pagination', null); ?>

</div>
<?php get_footer(); ?>
