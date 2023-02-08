<?php
$dataInput = [
  '1' => [
    'name' => 'company_name',
    'label' => __("Company name", "vietis"),
    'required' => true,
    'tag' => 'input'
  ],
  '2' => [
    'name' => 'your_name',
    'label' => __("Name", "vietis"),
    'required' => true,
    'tag' => 'input'
  ],
  '3' => [
    'name' => 'email',
    'label' => __("Email", "vietis"),
    'required' => true,
    'tag' => 'input'
  ],
  '4' => [
    'name' => 'linkedin',
    'label' => __("LinkedIn", "vietis"),
    'required' => false,
    'tag' => 'input'
  ],
  '5' => [
    'name' => 'message',
    'label' => __("Message", "vietis"),
    'required' => false,
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
      '1' => __("Digital Transformation", "vietis"),
      '2' => __("Dedicated Development Team", "vietis"),
      '3' => __("Development of Mobile and Web Applications", "vietis"),
      '4' => __("Development of Personalized Software", "vietis"),
      '5' => __("Blockchain", "vietis"),
      '6' => __("Others", "vietis"),
    ];

    if ($key === null) return $dataInquiryType;
    return isset($dataInquiryType[$key]) ? $dataInquiryType[$key] : false;
  }
}
