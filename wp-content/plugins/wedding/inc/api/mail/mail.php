<?php
class wedding_API_MAIL extends class_wedding_plugin_api
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

    $this->check_data('company_name', $data, __('Bạn chưa nhập họ tên', 'wedding'));
    $this->check_data('email', $data, __('Bạn chưa nhập Email', 'wedding'));
    $this->checkMail('email', $data);
    $this->check_data('message', $data, __('Bạn chưa nhập lời chúc mừng', 'wedding'));


    if ($this->response['status'] === 0) {
      $to = $mails;
      $subject = __('Lời chúc mừng từ ', 'wedding') . ' ' . mb_strtoupper($data['company_name']);
      $headers = array('Content-Type: text/html; charset=UTF-8', 'From:' . $data['email']);

      $content = '';

      $content .= '<h3 style="color: #000; text-transform: uppercase;">';
      $content .= __('Thông tin lời chúc', 'wedding');
      $content .= '</h3>';

      $content .= '<div>';
      $content .= '<table style="width: 100%, color: #000">';
      $content .= '<tr style="color: #000">';
      $content .= '<td>' . __('Email', 'wedding') . ':</td>';
      $content .= '<td>' . $data['email'] . '</td>';
      $content .= '</tr>';

      $content .= '<tr style="color: #000">';
      $content .= '<td>' . __('Họ tên', 'wedding') . ':</td>';
      $content .= '<td>' . $data['company_name'] . '</td>';
      $content .= '</tr>';

      $content .= '<tr style="color: #000">';
      $content .= '<td>' . __('Lời chúc', 'wedding') . ':</td>';
      $content .= '<td>' . $data['message'] . '</td>';
      $content .= '</tr>';

      $content .= '</table>';
      $content .= '</div>';

      $title = __('Lời chúc mừng từ ', 'wedding') . mb_strtoupper($data['company_name']);

      $body = template_mail($title, $content);

      $mail = wp_mail($to, $subject, $body, $headers);
      if ($mail) {
        $to_rep = $data['email'];
        $subject = __('Lời cảm ơn', 'wedding');
        $headers = array('Content-Type: text/html; charset=UTF-8', 'From:' . $data['email']);

        $content = '';

        $content .= '<h3 style="color: #000; text-transform: uppercase;">';
        $content .= __('Thông tin lời chúc của bạn', 'wedding');
        $content .= '</h3>';

        $content .= '<div>';
        $content .= '<table style="width: 100%>';

        $content .= '<tr style="color: #000">';
        $content .= '<td>' . __('Email', 'wedding') . ':</td>';
        $content .= '<td>' . $data['email'] . '</td>';
        $content .= '</tr>';

        $content .= '<tr style="color: #000">';
        $content .= '<td>' . __('Họ tên', 'wedding') . ':</td>';
        $content .= '<td>' . $data['company_name'] . '</td>';
        $content .= '</tr>';

        $content .= '<tr style="color: #000">';
        $content .= '<td>' . __('Lời chúc', 'wedding') . ':</td>';
        $content .= '<td>' . $data['message'] . '</td>';
        $content .= '</tr>';

        $content .= '</table>';
        $content .= '</div>';

        $title = __('Cảm ơn bạn rất nhiều vì đã gửi những lời chúc mừng tốt đẹp nhất đến đám cưới của chúng tôi!', 'wedding');
        $body_rep = template_mail($title, $content);
        wp_mail($to_rep, $subject, $body_rep, $headers);
        $this->response['message'] = __('Bạn đã gửi lời chúc đến Bách & Trang', 'wedding');
        $this->response['data']['title_modal'] = __('Chúc mừng', 'wedding');
      } else {
        $this->response['message'] = __('Không gửi được email', 'wedding');
        $this->response['data']['title_modal'] = __('Thất bại', 'wedding');
      }
    }

    $this->response();
  }
}

new wedding_API_MAIL();
