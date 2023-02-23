<?php get_header(); /* Template Name: Template Home */ ?>

<div id="loader-wrapper">
    <div class="heart">
      <i class="fa-solid fa-heart"></i>
    </div>
</div>

<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
  <div class="entry-content">
    <?php the_content(); ?>
  </div>
</article>
<?php endwhile; endif; ?>

<?php get_footer(); ?>
