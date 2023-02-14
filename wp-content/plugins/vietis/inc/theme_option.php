<?php
/**
 * Create A Simple Theme Options Panel
 *
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

// Start Class
if ( ! class_exists( 'theme_options' ) ) {
  class theme_options {

    /**
     * Start things up
     *
     * @since 1.0.0
     */
    public function __construct() {
      if ( is_admin() ) {
        add_action('admin_menu', array( 'theme_options', 'add_admin_menu' ) );
        add_action('admin_init', array( 'theme_options', 'register_settings' ) );
      }
    }

    /**
     * Returns all theme options
     *
     * @since 1.0.0
     */
    public static function get_theme_options() {
      return get_option('theme_options');
    }

    /**
     * Returns single theme option
     *
     * @since 1.0.0
     */
    public static function get_theme_option( $id ) {
      $options = self::get_theme_options();
      if (isset( $options[$id]) ) {
        return $options[$id];
      }
    }

    /**
     * Add sub menu page
     *
     * @since 1.0.0
     */
    public static function add_admin_menu() {
      add_menu_page(
        __( 'Cấu hình Theme', 'wedding' ),
        __( 'Cấu hình Theme', 'wedding' ),
        'manage_options',
        'theme-settings',
        array('theme_options', 'create_admin_page' )
      );
    }

    /**
     * Register a setting and its sanitization callback.
     *
     * We are only registering 1 setting so we can store all options in a single option as
     * an array. You could, however, register a new setting for each option
     *
     * @since 1.0.0
     */
    public static function register_settings() {
      register_setting( 'theme_options', 'theme_options', array('theme_options', 'sanitize'));
    }

    /**
     * Sanitization callback
     *
     * @since 1.0.0
     */
    public static function sanitize( $options ) {
      if ( $options ) {
        if ( ! empty( $options['page_register_member_id'] ) ) {
          $options['page_register_member_id'] = sanitize_text_field($options['page_register_member_id']);
        }
      }
      return $options;

    }

    /**
     * Settings page output
     *
     * @since 1.0.0
     */
    public static function create_admin_page() { ?>

      <div class="wrap">

        <h1><?php esc_html_e( 'Theme Options', 'text-domain' ); ?></h1>

        <form method="post" action="options.php">

          <?php settings_fields( 'theme_options' ); ?>

          <div class="company-information">
            <div class="company-information__item">
              <h3 class="company-information"><?= __('wedding Corporation', 'wedding'); ?></h3>
              <table class="form-table wpex-custom-admin-login-table">
                <tr valign="top">
                  <th scope="row"><?= __('Tên công ty:', 'wedding'); ?></th>
                  <td>
                    <?php $value = self::get_theme_option('company_name_vi'); ?>
                    <input type="tel" name="theme_options[company_name_vi]" value="<?= esc_attr($value); ?>" placeholder="Nhập tên công ty" class="regular-text">
                  </td>
                </tr>

                <tr valign="top">
                  <th scope="row"><?= __('Năm thành lập:', 'wedding'); ?></th>
                  <td>
                    <?php $value = self::get_theme_option('year_of_incorporation_vi'); ?>
                    <input type="tel" name="theme_options[year_of_incorporation_vi]" value="<?= esc_attr($value); ?>" placeholder="Nhập năm thành lập" class="regular-text">
                  </td>
                </tr>

                <tr valign="top">
                  <th scope="row"><?= __('Người đại diện:', 'wedding'); ?></th>
                  <td>
                    <?php $value = self::get_theme_option('representative_vi'); ?>
                    <input type="tel" name="theme_options[representative_vi]" value="<?= esc_attr($value); ?>" placeholder="Nhập tên người đại diện" class="regular-text">
                  </td>
                </tr>

                <tr valign="top">
                  <th scope="row"><?= __('Địa chỉ:', 'wedding'); ?></th>
                  <td>
                    <?php $value = self::get_theme_option('address_vi'); ?>
                    <input type="tel" name="theme_options[address_vi]" value="<?= esc_attr($value); ?>" placeholder="Nhập địa chỉ tại Việt Nam" class="regular-text">
                  </td>
                </tr>

                <tr valign="top">
                  <th scope="row"><?= __('Số điện thoại:', 'wedding'); ?></th>
                  <td>
                    <?php $value = self::get_theme_option('phone_vi'); ?>
                    <input type="tel" name="theme_options[phone_vi]" value="<?= esc_attr($value); ?>" placeholder="Nhập SĐT tại Việt Nam" class="regular-text">
                  </td>
                </tr>
              </table>
            </div><!-- ./company-information__item -->

            <div class="company-information__item">
              <h2 class="company-information"><?= __('wedding Solution', 'wedding'); ?></h2>
              <table class="form-table wpex-custom-admin-login-table">
                <tr valign="top">
                  <th scope="row"><?= __('Tên công ty:', 'wedding'); ?></th>
                  <td>
                    <?php $value = self::get_theme_option('company_name_jp'); ?>
                    <input type="tel" name="theme_options[company_name_jp]" value="<?= esc_attr($value); ?>" placeholder="Nhập tên công ty ở Nhật" class="regular-text">
                  </td>
                </tr>

                <tr valign="top">
                  <th scope="row"><?= __('Năm thành lập:', 'wedding'); ?></th>
                  <td>
                    <?php $value = self::get_theme_option('year_of_incorporation_jp'); ?>
                    <input type="tel" name="theme_options[year_of_incorporation_jp]" value="<?= esc_attr($value); ?>" placeholder="Nhập năm thành lập (Nhật Bản)" class="regular-text">
                  </td>
                </tr>

                <tr valign="top">
                  <th scope="row"><?= __('Người đại diện:', 'wedding'); ?></th>
                  <td>
                    <?php $value = self::get_theme_option('representative_jp'); ?>
                    <input type="tel" name="theme_options[representative_jp]" value="<?= esc_attr($value); ?>" placeholder="Nhập tên người đại diện (Nhật Bản)" class="regular-text">
                  </td>
                </tr>

                <tr valign="top">
                  <th scope="row"><?= __('Địa chỉ 1:', 'wedding'); ?></th>
                  <td>
                    <?php $value = self::get_theme_option('address_jp_01'); ?>
                    <input type="tel" name="theme_options[address_jp_01]" value="<?= esc_attr($value); ?>" placeholder="Nhập địa chỉ tại Nhật Bản 1" class="regular-text">
                  </td>
                </tr>

                <tr valign="top">
                  <th scope="row"><?= __('Địa chỉ 2:', 'wedding'); ?></th>
                  <td>
                    <?php $value = self::get_theme_option('address_jp_02'); ?>
                    <input type="tel" name="theme_options[address_jp_02]" value="<?= esc_attr($value); ?>" placeholder="Nhập địa chỉ tại Nhật Bản 2" class="regular-text">
                  </td>
                </tr>

                <tr valign="top">
                  <th scope="row"><?= __('Số điện thoại:', 'wedding'); ?></th>
                  <td>
                    <?php $value = self::get_theme_option('phone_jp'); ?>
                    <input type="tel" name="theme_options[phone_jp]" value="<?= esc_attr($value); ?>" placeholder="Nhập SĐT tại Nhật Bản" class="regular-text">
                  </td>
                </tr>
              </table>
            </div><!-- ./company-information__item -->

            <div class="company-information__item">
              <h2 class="company-information"><?= __('Us office', 'wedding'); ?></h2>
              <table class="form-table wpex-custom-admin-login-table">
                <tr valign="top">
                  <th scope="row"><?= __('Tên công ty:', 'wedding'); ?></th>
                  <td>
                    <?php $value = self::get_theme_option('company_name_us'); ?>
                    <input type="tel" name="theme_options[company_name_us]" value="<?= esc_attr($value); ?>" placeholder="Nhập tên văn phòng đại diện ở Mỹ" class="regular-text">
                  </td>
                </tr>
                <tr valign="top">
                  <th scope="row"><?= __('Địa chỉ:', 'wedding'); ?></th>
                  <td>
                    <?php $value = self::get_theme_option('address_us'); ?>
                    <input type="tel" name="theme_options[address_us]" value="<?= esc_attr($value); ?>" placeholder="Nhập địa chỉ tại Mỹ" class="regular-text">
                  </td>
                </tr>

              </table>
            </div><!-- ./company-information__item -->

            <div class="company-information__item">
              <h2 class="company-information"><?= __('Viet FinTech', 'wedding'); ?></h2>
              <table class="form-table wpex-custom-admin-login-table">
                <tr valign="top">
                  <th scope="row"><?= __('Tên công ty:', 'wedding'); ?></th>
                  <td>
                    <?php $value = self::get_theme_option('company_name_fin'); ?>
                    <input type="tel" name="theme_options[company_name_fin]" value="<?= esc_attr($value); ?>" placeholder="Nhập tên văn phòng đại diện ở Mỹ" class="regular-text">
                  </td>
                </tr>
                <tr valign="top">
                  <th scope="row"><?= __('Địa chỉ:', 'wedding'); ?></th>
                  <td>
                    <?php $value = self::get_theme_option('address_fin'); ?>
                    <input type="tel" name="theme_options[address_fin]" value="<?= esc_attr($value); ?>" placeholder="Nhập địa chỉ Fintech" class="regular-text">
                  </td>
                </tr>
              </table>
            </div><!-- ./company-information__item -->
          </div>
          <table class="form-table wpex-custom-admin-login-table">
            <tr valign="top">
              <th scope="row"><?= __('Email liên hệ:', 'wedding'); ?></th>
              <td>
                <?php $value = self::get_theme_option('contact_email'); ?>
                <input type="tel" name="theme_options[contact_email]" value="<?= esc_attr($value); ?>" placeholder="Nhập email liên hệ" class="regular-text">
              </td>
            </tr>
            <tr valign="top">
              <th scope="row"><?= __('Link facebook:', 'wedding'); ?></th>
              <td>
                <?php $value = self::get_theme_option('link_facebook'); ?>
                <input type="tel" name="theme_options[link_facebook]" value="<?= esc_attr($value); ?>" placeholder="Nhập link facebook" class="regular-text">
              </td>
            </tr>
            <tr valign="top">
              <th scope="row"><?= __('Link youtube:', 'wedding'); ?></th>
              <td>
                <?php $value = self::get_theme_option('link_youtube'); ?>
                <input type="tel" name="theme_options[link_youtube]" value="<?= esc_attr($value); ?>" placeholder="Nhập link youtube" class="regular-text">
              </td>
            </tr>
            <tr valign="top">
              <th scope="row"><?= __('Cấu hình nhận mail'); ?></th>
              <td>
                <?php $value = self::get_theme_option('receive_mail'); ?>
                <textarea placeholder="<?= __('Cấu hình nhận mail'); ?>" name="theme_options[receive_mail]" rows="5" class="regular-text"><?= esc_attr($value); ?></textarea>
                <p class="description">
                  <?= __('US Office Mỗi mail nhận cách nhau bởi dấu phẩy "," hoặc mỗi mail nhận trên 1 dòng.', 'wedding'); ?><br>
                  <em><strong><?= __('Ví dụ 1:', 'wedding'); ?> </strong> <?= __('contact.001@gmail.com, contact.002@gmail.com', 'wedding'); ?></em><br>
                  <em><strong><?= __('Ví dụ 2:', 'wedding'); ?> </strong><br><?= __('contact.001@gmail.com', 'wedding'); ?><br><?= __('contact.002@gmail.com', 'wedding'); ?></em>
                </p>
              </td>
            </tr>
          </table>
          <?php submit_button(); ?>
        </form>
      </div><!-- .wrap -->
    <?php }
  }
}
new theme_options();
