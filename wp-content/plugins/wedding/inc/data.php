<?php
$dataInput = [
  '1' => [
    'name' => 'company_name',
    'label' => __("Họ tên", "wedding"),
    'required' => true,
    'tag' => 'input',
    'placeholder' => 'Nhập họ tên',
    'class' => ' input-name '
  ],
  '2' => [
    'name' => 'email',
    'label' => __("Email", "wedding"),
    'required' => true,
    'tag' => 'input',
    'placeholder' => 'Nhập email',
    'class' => ' input-email '
  ],
  // '3' => [
  //   'name' => 'message',
  //   'label' => __("Lời chức mừng", "wedding"),
  //   'required' => false,
  //   'tag' => 'textarea',
  //   'placeholder' => 'Nhập Lời chức mừng',
  //   'class' => ' input-message '
  // ]
];

if (!defined('INPUT_TYPE')) define('INPUT_TYPE', $dataInput);

// Render html InputType
if (!function_exists("render_input_type")) {
  function render_input_type()
  {
    if (!defined('INPUT_TYPE')) return;
    $html = '';
    foreach (INPUT_TYPE as $key => $obj) {
      $html .= form_input($obj['name'], [
        'label' => $obj['label'],
        'value' => $key,
        'required' => $obj['required'],
        'placeholder' => $obj['placeholder'],
        'class' => $obj['class'],
        'tag' => $obj['tag']
      ]);
    }
    return $html;
  }
}
