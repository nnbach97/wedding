<?php
class VIETIS_API_MAIL extends class_vietis_plugin_api
{
  public function __construct()
  {
    add_action('wp_ajax_contact_mail', [$this, 'contact_mail']);
    add_action('wp_ajax_nopriv_contact_mail', [$this, 'contact_mail']);
  }

  public function contact_mail()
  {
    $mails = $this->getMailReceive();
    $data = $_POST;

    $this->check_data_checkbox_group('inquiry_type', $data, __('You have not entered the inquiry type.', 'vietis'));

    $this->check_data('company_name', $data, __('The company name has not been entered', 'vietis'));

    $this->check_data('your_name', $data, __('The person\'s name has not been entered', 'vietis'));

    $this->check_data('email', $data, __('Email has not been entered', 'vietis'));
    $this->checkMail('email', $data);

    $this->check_data('captcha', $data, __('Captcha is not authenticated', 'vietis'));
    $this->checkCaptcha('captcha', $data);

    if (isset($data['inquiry_type']) && $data['inquiry_type']) {
      foreach ($data['inquiry_type'] as $key => $value) {
        if ($value) {
          $data['inquiry_type'][$key] = get_data_inquiry_type($value);
        } else {
          $data['inquiry_type'][$key] = __("Others", "vietis");
        }
      }
    }

    if ($this->response['status'] === 0) {
      $to = $mails;
      $subject = __('[REQUEST CONTACT] FROM', 'vietis') . ' ' . mb_strtoupper($data['your_name']);
      $headers = array('Content-Type: text/html; charset=UTF-8', 'From:' . $data['email']);

      $content = '';

      $content .= '<h3 style="color: #000; text-transform: uppercase;">';
      $content .= __('Contact Info', 'vietis');
      $content .= '<span style="height: 8px; display: block; width: 40px;border-radius: 4px; background: #ffe000; margin: 10px 0 0"></span>';
      $content .= '</h3>';

      $content .= '<div>';
      $content .= '<table style="width: 100%, color: #000">';
      $content .= '<tr style="color: #000">';
      $content .= '<td style="width: 40%">' . __('Name', 'vietis') . ':</td>';
      $content .= '<td>' .  $data['your_name'] . '</td>';
      $content .= '</tr>';

      $content .= '<tr style="color: #000">';
      $content .= '<td>' . __('Email', 'vietis') . ':</td>';
      $content .= '<td>' . $data['email'] . '</td>';
      $content .= '</tr>';

      $content .= '<tr style="color: #000">';
      $content .= '<td>' . __('Company name', 'vietis') . ':</td>';
      $content .= '<td>' . $data['company_name'] . '</td>';
      $content .= '</tr>';

      $content .= '<tr style="color: #000">';
      $content .= '<td>' . __('LinkedIn', 'vietis') . ':</td>';
      $content .= '<td>' . $data['linkedin'] . '</td>';
      $content .= '</tr>';

      $content .= '<tr style="color: #000">';
      $content .= '<td style="display: flex;">' . __('Inquiry type', 'vietis') . ':</td>';
      $content .= '<td>' . implode('<br>', $data['inquiry_type']) . '</td>';
      $content .= '</tr>';

      $content .= '<tr style="color: #000">';
      $content .= '<td>' . __('Message', 'vietis') . ':</td>';
      $content .= '<td>' . $data['message'] . '</td>';
      $content .= '</tr>';

      $content .= '</table>';
      $content .= '</div>';

      $title = __('VIETIS RECEIVED A CONTACT REQUEST FROM ', 'vietis') . mb_strtoupper($data['your_name']);

      $body = template_mail($title, $content);

      $mail = wp_mail($to, $subject, $body, $headers);
      if ($mail) {
        $to_rep = $data['email'];
        $subject = __('REQUEST TO CONTACT VIETIS', 'vietis');
        $headers = array('Content-Type: text/html; charset=UTF-8', 'From:' . $data['email']);

        $content = '';

        $content .= '<h3 style="color: #000; text-transform: uppercase;">';
        $content .= __('Contact Info', 'vietis');
        $content .= '<span style="height: 8px; display: block; width: 40px;border-radius: 4px; background: #ffe000; margin: 10px 0 0"></span>';
        $content .= '</h3>';

        $content .= '<div>';
        $content .= '<table style="width: 100%>';
        $content .= '<tr style="color: #000">';
        $content .= '<td style="width: 40%">' . __('Name', 'vietis') . ':</td>';
        $content .= '<td>' .  $data['your_name'] . '</td>';
        $content .= '</tr>';

        $content .= '<tr style="color: #000">';
        $content .= '<td>' . __('Email', 'vietis') . ':</td>';
        $content .= '<td>' . $data['email'] . '</td>';
        $content .= '</tr>';

        $content .= '<tr style="color: #000">';
        $content .= '<td>' . __('Company name', 'vietis') . ':</td>';
        $content .= '<td>' . $data['company_name'] . '</td>';
        $content .= '</tr>';

        $content .= '<tr style="color: #000">';
        $content .= '<td>' . __('LinkedIn', 'vietis') . ':</td>';
        $content .= '<td>' . $data['linkedin'] . '</td>';
        $content .= '</tr>';

        $content .= '<tr style="color: #000">';
        $content .= '<td style="display: flex;">' . __('Inquiry type', 'vietis') . ':</td>';
        $content .= '<td>' . implode('<br>', $data['inquiry_type']) . '</td>';
        $content .= '</tr>';

        $content .= '<tr style="color: #000">';
        $content .= '<td>' . __('Message', 'vietis') . ':</td>';
        $content .= '<td>' . $data['message'] . '</td>';
        $content .= '</tr>';

        $content .= '</table>';
        $content .= '</div>';

        $title = __('THANK YOU FOR SENDING CONTACT INFORMATION TO VIETIS', 'vietis');
        $body_rep = template_mail($title, $content);
        wp_mail($to_rep, $subject, $body_rep, $headers);
        $this->response['message'] = __('Contact Was Successful', 'vietis');
        $this->response['data']['title_modal'] = __('Success', 'vietis');
      } else {
        $this->response['message'] = __('Failed To Send Email', 'vietis');
        $this->response['data']['title_modal'] = __('Failed', 'vietis');
      }
    }

    $this->response();
  }
}

new VIETIS_API_MAIL();
