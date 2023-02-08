<?php
global $registerBlock;
$registerBlock[] = [
  'block_type' => 'create-block/function',
  'callback' => 'vietis_shortcode_block_function'
];

function vietis_shortcode_block_function($atts, $content)
{
  $title = vietis_func_check_data('title', $atts, '<strong>Function list</strong>');
  $functions = vietis_func_check_data('items', $atts, [
    [
      'text' => 'Manager Project Bidding'
    ],
    [
      'text' => 'Weekly Report'
    ],
    [
      'text' => 'Project Opening (submit, review, approve)'
    ],
    [
      'text' => 'Resource Reports'
    ],
    [
      'text' => 'Redmine members Synchronize'
    ],
    [
      'text' => 'OT Registration'
    ],
    [
      'text' => 'Estimation Importing'
    ],
    [
      'text' => 'Members Management'
    ],
    [
      'text' => 'Requirements Importing'
    ],
    [
      'text' => 'Departments Management'
    ],
    [
      'text' => 'Requirements Synchronization'
    ],
    [
      'text' => 'Project Opening Decision'
    ],
  ]);

  ob_start(); ?>

  <div class="block block-functions">
    <div class="holder">
      <div class="wrapper">
        <h3 class="title"><?= $title; ?></h3>
        <ul class="list">
          <?php foreach ($functions as $value) : ?>
            <?php $text = vietis_func_check_data('text', $value, 'Your text', true) ?>
            <li class="item">
              <p class="txt"><?= $text ?></p>
            </li>
          <?php endforeach ?>
        </ul>
      </div>
    </div>
  </div>

<?php
  return ob_get_clean();
}
