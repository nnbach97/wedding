<?php get_header(); ?>

<div class="block-page-404">

  <div class="holder">
    <div class="error">
      <div class="holder">
        <div class="head text-center">
          <h1 class="head-ttl">4<span>0</span>4</h1>
          <h2 class="head-txt"><?= __('Whoops! This is not what you were looking for.', 'wedding'); ?></h2>
          <p class="head-desc"><?= __('You can click the button below to go back to the homepage. ', 'wedding') ?></p>
          <div class="head-lnk">
            <a href="<?= home_url() ?>"><span><?= __('Home Page', 'wedding'); ?></span></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<?php get_footer(); ?>
