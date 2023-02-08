<?php
class vietis_modules_images_assets {
    public function __construct() {
        add_action('wp_print_scripts', [$this, 'loadScripts']);
        add_action('wp_enqueue_scripts', [$this, 'loadStyles']);
        add_action('admin_enqueue_scripts', [$this, 'loadAdminScripts']);
    }

    public function loadScripts() {
        if ($GLOBALS['pagenow'] != 'wp-login.php' && !is_admin()) {

        }
    }

    public function loadStyles() {

    }

    public function loadAdminScripts() {
        global $post_type, $typenow;
        if( in_array($post_type, explode(',', REGISTER_POST_TYPE)) ) {
            wp_register_style('module-images-admin-style', IMAGES_PATH_HOST . '/css/admin.css', null, '1.0.0');
            wp_enqueue_style('module-images-admin-style');

            wp_enqueue_script( 'jquery-ui-sortable' );
            wp_register_script('images-admin-script', IMAGES_PATH_HOST . '/js/admin.js', array('jquery'), '1.0.0', true );
            wp_enqueue_script('images-admin-script');
            wp_enqueue_media();
        }
    }
}

new vietis_modules_images_assets();
