<?php

/**
 * API
 */
abstract class class_wedding_plugin_api
{
  public $response = [
    'status' => 0,
    'data' => [],
    'message' => '',
  ];

  public function __construct()
  {
    add_action('wp_ajax_wpdocs_action', [$this, 'check_security']);
  }

  public function response()
  {
    if (wp_doing_ajax()) {
      echo json_encode($this->response, JSON_UNESCAPED_UNICODE);
      die;
    }
    return $this->response;
  }

  public function check_data($name, $datas, $messageError = '')
  {
    $str_check = '<script';
    if ($this->response['status'] == 0 && (!isset($datas[$name]) || empty($datas[$name]) || strpos($datas[$name], $str_check) !== false)) {
      if ($messageError && is_string($messageError)) {
        $this->response['status'] = 1;
        $this->response['message'] = $messageError;
        $this->response['data']['focus'] = $name;
        $this->response['data']['title_modal'] = __('Failed', 'wedding');
        return false;
      }
    }
    return true;
  }

  public function check_data_checkbox_group($name, $datas, $messageError = '')
  {
    if ($this->response['status'] == 0 && (!isset($datas[$name]) || empty($datas[$name]))) {
      if ($messageError && is_string($messageError)) {
        $this->response['status'] = 1;
        $this->response['message'] = $messageError;
        $this->response['data']['title_modal'] = __('Failed', 'wedding');
        $this->response['data']['focus'] = $name;
        return false;
      }
    }
    return true;
  }

  public function getMailReceive()
  {
    $mails = theme_options::get_theme_option('receive_mail');
    $mails = explode(',', $mails);
    $listMails = [];
    if ($mails) {
      foreach ($mails as $mail) {
        $list = explode("\n", $mail);
        $listMails = array_merge($listMails, $list);
      }
      $listMails = array_map('trim', $listMails);
    }

    if ($listMails) {
      foreach ($listMails as $key => $mail) {
        if (!$mail || !is_email($mail)) {
          unset($listMails[$key]);
        }
      }
    }

    if (!$listMails) {
      $this->response['status'] = 1;
      $this->response['message'] = __('Your administrator hasn\'t set up email yet. Contact your administrator.', 'wedding');
    }

    return $listMails;
  }

  public function checkMail($name, $datas, $messageError = '')
  {
    if ($this->response['status'] == 0) {
      $datas[$name] = trim($datas[$name]);
      if (!isset($datas[$name]) || empty($datas[$name]) || !is_email($datas[$name])) {
        $this->response['status'] = 1;
        $this->response['message'] = $messageError ? $messageError : __('Invalid email address', 'wedding');
        $this->response['data']['title_modal'] = __('Failed', 'wedding');
        $this->response['data']['focus'] = $name;
        return false;
      }
    }
  }

  public function checkCaptcha($name, $datas, $messageError = '')
  {
    session_start();
    if ($this->response['status'] == 0) {
      $datas[$name] = trim($datas[$name]);
      if (!isset($datas[$name]) || empty($datas[$name]) || $datas['captcha'] != $_SESSION['captcha']) {
        $this->response['status'] = 1;
        $this->response['message'] = $messageError ? $messageError : __('Invalid Captcha', 'wedding');
        $this->response['title_modal'] = __('Failed', 'wedding');
        $this->response['data']['focus'] = $name;
        return false;
      }
    }
  }

  public function check_captcha($data)
  {
    return true;
    if (isset($data['g-recaptcha-response']))  $captcha = $data['g-recaptcha-response'];

    if (!isset($captcha)) return;

    $response = json_decode(file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=" . SECRET_KEY_CAPTCHA . "&response=" . $captcha . "&remoteip=" . $_SERVER['REMOTE_ADDR']), true);
    if ($response['success'] === false) {
      $this->response['status'] = 1;
      $this->response['message'] = __('Capchaを入力してください。', 'wedding');
      $this->response['title_modal'] = __('Failed', 'wedding');
    }
  }

  public function security()
  {
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
  }

  public function check_security()
  {
    // check_ajax_referer('wedding_SECURITY', 'security');
  }
}

wedding_include('inc/api/blocks/get-data-post.php');
wedding_include('inc/api/blocks/get-data-post-casestudy.php');
wedding_include('inc/api/mail/mail.php');
