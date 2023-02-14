<?php

/**
 * get List images custom
 *
 * @return array
 */
if (!function_exists('get_list_images_custom')) {
    function get_list_images_custom($size = 'full'){
        global $post;
        $aImages = get_post_meta( $post->ID, '_image_gallery', false );
        $return = [];
        if ($aImages) {
            foreach ($aImages as $key => $attachment_id) {
                $attachment = wp_get_attachment_image_src($attachment_id, $size, false, '');
                if (isset($attachment[0])) {
                    $return[] = $attachment[0];
                }
            }
        }
        return $return;
    }
}
