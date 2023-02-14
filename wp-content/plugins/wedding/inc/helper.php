<?php

if (!function_exists('form_input')) {
  function form_input($name, $args = [])
  {
    if (!$name) return false;
    $class = wedding_func_check_data('class', $args, '');
    $type = wedding_func_check_data('type', $args, 'text');
    $label = wedding_func_check_data('label', $args);

    $required = wedding_func_check_data('required', $args);
    $tag = wedding_func_check_data('tag', $args);
    $class .= $required ? ' required' : '';
    $required_attr = $required ? ' required="required" ' : '';

    $class_input = wedding_func_check_data('class_input', $args, '');
    $placeholder = wedding_func_check_data('placeholder', $args, '');

    $errors = wedding_func_check_data('errors', $args, []);
    $error = wedding_func_check_data($name, $errors, '');
    $fill = wedding_func_check_data('fill', $args, true);
    $value = '';
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
      if ($fill !== false) {
        $value = wedding_func_check_data($name, $_POST, '');
      }
      if ($error) {
        $class_input .= ' is-invalid ';
      } else {
        if ($fill !== false) {
          $class_input .= ' is-valid ';
        }
      }
    }
    $class_input .= 'form-control';
    $class_textarea = $tag === 'textarea' ? ' group-input-item--textarea' : '';
    $html = '';
    $html .= '<div class="group-input-item' . esc_attr($class) . esc_attr($class_textarea) . '">';
    if ($label) {
      $html .= '<label ' .'for="'. $label .'" class="label form-label">' . $label . '</label>';
    }
    if ($tag === 'textarea') {
      $html .= '<textarea ' . 'class="' . esc_attr($class_input) . '" cols="30" rows="5"' . '" name="' . esc_attr($name) . '" autocomplete="off" ' . ' value="' . esc_attr($value) . '"></textarea>';
    } else {
      $html .= '<input ' . $required_attr . 'id="'. $label .'" value="' . esc_attr($value) . '" type="' . esc_attr($type) . '" name="' . esc_attr($name) . '" class="' . esc_attr($class_input) . '" placeholder="' . esc_attr($placeholder) . '">';
    }
    $html .= '<div class="invalid-feedback">' . $error . '</div>';
    $html .= '</div>';
    return $html;
  }
}

if (!function_exists('form_checkbox')) {
  function form_checkbox($name, $key, $args = [])
  {
    if (!$name) return false;
    $class = wedding_func_check_data('class', $args, '');
    $type = wedding_func_check_data('type', $args, 'checkbox');
    $label = wedding_func_check_data('label', $args);

    $required = wedding_func_check_data('required', $args);
    // $class .= $required ? 'required' : '';
    $required_attr = $required ? ' required="required" ' : '';

    $class_input = wedding_func_check_data('class_input', $args, '');
    $errors = wedding_func_check_data('errors', $args, []);
    $error = wedding_func_check_data($name, $errors, '');
    $fill = wedding_func_check_data('fill', $args, true);
    $value = wedding_func_check_data('value', $args, '');
    $data = '';
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
      $datas = wedding_func_check_data($name, $_POST, []);
      if ($datas) $data = wedding_func_check_data($key, $datas, []);
    }
    $class_input .= ' form-check-input ';
    $html = '';
    $html .= '<div class="form-check' . esc_attr($class) . '">';
    $html .= '<input ' . checked($data, $value, false) . ' id="input-check-' . $name . '" ' . $required_attr . ' value="' . esc_attr($value) . '" type="' . esc_attr($type) . '" name="' . $key . '" class="' . esc_attr($class_input) . '">';
    if ($label) {
      $html .= '<label class="form-check-label" for="input-check-' . $name . '">' . $label . '</label>';
    }
    $html .= '<div class="invalid-feedback">' . $error . '</div>';
    $html .= '</div>';
    return $html;
  }
}

if (!function_exists('form_checkbox_term')) {
  function form_checkbox_term($name, $args = [])
  {
    if (!$name) return false;
    $class = wedding_func_check_data('class', $args, '');
    $label = wedding_func_check_data('label', $args);
    $required = wedding_func_check_data('required', $args);
    $required_attr = $required ? ' required="required" ' : '';

    $class_input = wedding_func_check_data('class_input', $args, '');
    $value = wedding_func_check_data('value', $args, []);

    $args = [
      'taxonomy' => wedding_func_check_data('taxonomy', $args, 'category'),
      'hide_empty' => wedding_func_check_data('hide_empty', $args, false),
    ];
    $terms = get_terms($args);
    $class_input .= ' check-input ';

    $html = '';
    $html .= '<div class="wrap">';
    $html .= '<div class="ttl">' . $label . '</div>';
    $html .= '<ul class="list form-check-list-term ' . 'js-list-' . $name . esc_attr($class) . '">';

    if ($terms) {
      $i = 0;
      $total = count($terms);

      $totalCount = 0;
      foreach ($terms as $term) {
        $countPost = $term->count;
        $totalCount += $countPost;
      }

      foreach ($terms as $term) {
        $i++;
        $checked = '';
        if (in_array($term->term_id, $value)) $checked = ' checked="checked" ';
        $html .= '<li class="item">';
        $html .= '<input ' . $checked . ' id="input-check-' . $term->term_id . '" ' . $required_attr . ' value="' . $term->term_id . '" type="checkbox" name="' . $name . '[]" class="' . esc_attr($class_input) . '">';
        $html .= '<label class="form-check-label" for="input-check-' . $term->term_id . '">' . $term->name . ' <span> (' . $term->count . ')</span></label>';
        $html .= '</li>';
      }

      if ($total > 6) {
        if ($name === 'category') {
          $html .= '<li class="item">';
          $html .= '<a class="js-show-more-category" href="#" data-hide="Hide Categories(' . $totalCount . ')" data-show="All Categories(' . $totalCount . ')"></a>';
          $html .= '</li>';
        } elseif ($name === 'work-tag') {
          $html .= '<li class="item">';
          $html .= '<a class="js-show-more-tag" href="#" data-hide="Hide Tags(' . $totalCount . ')" data-show="All Tags(' . $totalCount . ')"></a>';
          $html .= '</li>';
        } else {
          $html .= '<li class="item">';
          $html .= '<a class="js-showMore" href="#" data-hide="Hide ' . $name . '(' . $totalCount . ')" data-show="All ' . $name . '(' . $totalCount . ')"></a>';
          $html .= '</li>';
        }
      }
    }
    $html .= '</ul>';
    $html .= '</div>';

    return $html;
  }
}

if (!function_exists('form_captcha')) {
  function form_captcha($name = 'captcha', $args = [])
  {
    if (!$name) return false;

    $html = '';
    $html .= '<div class="row">';
    $html .= '<div class="col-6">';
    $html .= form_input($name, $args);
    $html .= '</div>';
    $html .= '<div class="col-6">';
    $html .= '<div class="mb-3">';
    $html .= '<label class="form-label">&nbsp;</label>';
    $html .= '<img src="' . home_url('captcha.php') . '" alt="" class="captcha">';
    $html .= '</div>';
    $html .= '</div>';
    $html .= '</div>';
    return $html;
  }
}
