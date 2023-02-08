<?php

class vietis_class_views
{
    private static $key_count_view = KEY_COUNT_VIEW;

    public function __construct()
    {
    }

    private static function get_session()
    {
        $key = 'session_view_post_id';
        return isset($_SESSION[$key]) ? $_SESSION[$key] : [];
    }

    private static function set_session($post_id)
    {
        if (!$post_id) return;
        $key = 'session_view_post_id';
        if (!isset($_SESSION[$key])) $_SESSION[$key] = [];

        $post_ids = vietis_class_views::get_session();
        if (!in_array($post_id, $post_ids)) {
            $_SESSION[$key][] = $post_id;
            return $_SESSION[$key];
        }
        return false;
    }

    public static function get_view_count($post_id = null, $key = null)
    {
        if (!$post_id) {
            global $post;
            $post_id = $post->ID;
        }

        if (!$post_id) return 0;

        if ($key === null) {
            $key = vietis_class_views::$key_count_view;
        }

        $count = (int)get_post_meta($post_id, $key, true);
        $count = vietis_format_number_humanize($count);
        return $count;
    }

    public static function set_view_count($post_id = null)
    {
        global $post;
        if (!$post_id) {
            $post_id = isset($post->ID) ? $post->ID : false;
        }

        if (!$post_id) return 0;

        $post_ids = vietis_class_views::get_session();
        if (in_array($post_id, $post_ids)) {
            return false;
        }

        vietis_class_views::set_session($post_id);

        $count = (int) get_post_meta($post_id, vietis_class_views::$key_count_view, true);
        $count++;
        update_post_meta($post_id, vietis_class_views::$key_count_view, $count);
    }
}
