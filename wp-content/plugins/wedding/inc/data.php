<?php
$dataInput = [
  '1' => [
    'name' => 'company_name',
    'label' => __("Company name", "wedding"),
    'required' => true,
    'tag' => 'input'
  ],
  '2' => [
    'name' => 'email',
    'label' => __("Email", "wedding"),
    'required' => true,
    'tag' => 'input'
  ],
  '3' => [
    'name' => 'message',
    'label' => __("Message", "wedding"),
    'required' => true,
    'tag' => 'textarea'
  ]
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
        'tag' => $obj['tag']
      ]);
    }
    return $html;
  }
}

// Render html InquiryType
if (!function_exists("render_inquiry_type")) {
  function render_inquiry_type()
  {
    $datas = get_data_inquiry_type();
    $html = '';

    foreach ($datas as $key => $value) {
      $html .= form_checkbox("inquiry_$key", "inquiry_type[]", [
        'label' => $value,
        'value' => $key,
        "class_input" => 'js-checkbox',
        "required" => true,
      ]);
    }
    return $html;
  }
}

if (!function_exists("get_data_inquiry_type")) {
  function get_data_inquiry_type($key = null)
  {
    $dataInquiryType = [
      '1' => __("Digital Transformation", "wedding"),
      '2' => __("Dedicated Development Team", "wedding"),
      '3' => __("Development of Mobile and Web Applications", "wedding"),
      '4' => __("Development of Personalized Software", "wedding"),
      '5' => __("Blockchain", "wedding"),
      '6' => __("Others", "wedding"),
    ];

    if ($key === null) return $dataInquiryType;
    return isset($dataInquiryType[$key]) ? $dataInquiryType[$key] : false;
  }
}
