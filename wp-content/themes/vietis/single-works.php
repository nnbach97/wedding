<?php vietis_class_views::set_view_count(); get_header(); ?>
<?php
  if (have_posts()) : while (have_posts()) : the_post();
  $img_banner = get_post_meta($post->ID, 'img_banner', true );
  $title_color = get_post_meta($post->ID, 'project_color', true);
  $custom_description = get_post_meta($post->ID, 'custom_description_work', true);
  if($title_color === ""){
    $title_color = "#2f5aa8";
  }
?>
  <div class="casestudy-detail">
    <!-- Banner -->
    <div class="block block-casestudy-banner js-hero">
      <div class="banner-bg">
        <?php if($img_banner): ?>
          <img src="<?= wp_get_attachment_url($img_banner) ?>" alt="" />
        <?php else: ?>
          <?= vietis_func_get_image_default() ?>
        <?php endif; ?>
      </div>
      <div class="container">
        <div class="holder">
          <div class="banner-inner">
            <h1 class="ttl" style="color: <?=$title_color?>"><?= get_the_title(); ?></h1>
            <?php if (function_exists('vietis_breadcrumb')) echo vietis_breadcrumb(); ?>
            <?php
            $category = get_the_terms(get_the_ID(), VIETIS_TAXONOMY_WORKS_CATEGORY);
            $technology = get_the_terms(get_the_ID(), VIETIS_TAXONOMY_TECHNOLOGY);
            if($category) { ?>
            <div class="tag-list">
              <?php
                foreach($category as $item) : ?>
                <div class="item"><?=$item->name?></div>
              <?php endforeach ?>
            </div>
            <?php } ?>
          </div>
        </div>
      </div>
    </div>
    <!-- END: Banner -->

    <!-- Casetudy-content -->
    <div class="block block-casestudy-content">
      <div class="holder">
        <?php if(!empty($custom_description)){ ?>
          <div class="desc"><?= $custom_description ?></div>
        <?php } ?>

        <?php if ($technology) { ?>
          <div class="technology">
            <p class="ttl-common"><?= __("Technologies", "vietis") ?></p>
            <ul class="technology-list">
              <?php
                foreach($technology as $item){
                  $term_meta = get_term_meta($item->term_id, 'category-image-id', true);
                  $image = wp_get_attachment_image($term_meta);
                  if($image !== null && $image !== "" && $image !== false){
              ?>
                <li class="item"><?=$image?></li>
              <?php }
                else{
                  echo('<li class="item">'.vietis_func_get_image_default().'</li>');
                }
              }?>
            </ul>
          </div>
        <?php } ?>

        <div class="solution">
          <p class="ttl-common"><?= __("Our Solution", "vietis") ?></p>
          <?php if(!empty(get_the_content())) : ?>
              <?= __(get_template_part('entry', 'content'), "vietis") ?>
          <?php endif ?>
          <?php
            $images =  get_post_meta(get_the_ID(), IMAGES_META_KEY, true);
          ?>
            <div class="wrap">
              <div class="slider js-slick-casestudy">
                <?php
                  foreach($images as $key => $img){
                    $image = wp_get_attachment_image_url($img, 'full');
                    if($image !== null && $image !== "" && $image !== false){
                ?>
                  <div class="item">
                    <div class="image <?='image' . $key?>">
                      <img class="img" src="<?=$image?>" alt="">
                    </div>
                    <div class="slider-desc">
                      <p class="number"><span class="currentSlide strong"><?= $key + 1 ?></span>/<span class="totalSlide"><?= count($images) ?></span></p>
                      <p class="sub-image"><?= wp_get_attachment_caption($img); ?></p>
                    </div>
                  </div>
                <?php
                  }}
                ?>
              </div>
            </div>
        </div>

        <div class="content">
          <h3 class="title"><?= __("OTHER PROJECT", "vietis") ?></h3>
          <div class="list">
            <?= vietis_work_related(get_the_ID(), $category) ?>
          </div>
        </div>
      </div>
    </div>
    <!-- END: Casetudy-content -->
  </div>
<?php endwhile; endif; ?>
<?php get_footer(); ?>
