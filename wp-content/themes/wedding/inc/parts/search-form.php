<div class="sidebar-filter">
  <div class="holder">
    <?php
      global $post;
      $params = wedding_get_all_params();
      $keyword = wedding_func_check_data('keyword', $params, '');
      $category = wedding_func_check_data('category', $params, null);
    ?>
    <form action="<?= BLOG_PAGE; ?>" method="GET">
      <div class="search-box">
        <input type="hidden" name="h" value="">
        <input type="search" class="search-field" name="keyword" value="<?= esc_attr($keyword); ?>" placeholder="<?= __('Search news', 'wedding'); ?>">
        <button type="submit"><img src="<?= RESOURCE_HOST . '/img/search-icon.svg' ?>" alt="" class="img"></button>
      </div>
      <?= form_checkbox_term('category', [
        'label' => __('Categories'),
        'value' => $category,
        'class_input' => 'js-multiple-checkbox-delay',
      ]); ?>
    </form>
  </div>
</div>
