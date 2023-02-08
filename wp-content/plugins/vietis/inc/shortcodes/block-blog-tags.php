<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/blogs-tags',
  'callback' => 'vietis_shortcode_block_blogs_tags'
];

function vietis_shortcode_block_blogs_tags($atts, $content)
{
  ob_start(); ?>

  <?php if (is_active_sidebar('primary-widget-area')) : ?>
    <?php dynamic_sidebar('primary-widget-area'); ?>
  <?php endif; ?>

  <?php
  $tags = get_tags([
    'taxonomy' => 'post_tag',
    'orderby' => 'name',
    'hide_empty' => false,
  ]);
  ?>
  <div class="sidebar-tags">
    <div class="holder">
      <div class="ttl"><?= __('Tags', 'vietis'); ?></div>
      <ul class="list">
        <?php if ($tags) : ?>
          <?php foreach ($tags as $key => $tag) : ?>
            <li class="item"><?= $tag->name; ?></li>
          <?php endforeach; ?>
        <?php endif; ?>
      </ul>
    </div>
  </div>
<?php
  return ob_get_clean();
}
