<?php get_header(); /* Template Name: Template Gallary */ ?>

<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
  <div class="entry-content">
    <?php the_content(); ?>
  </div>
</article>
<?php endwhile; endif; ?>
<?php get_footer(); ?>
