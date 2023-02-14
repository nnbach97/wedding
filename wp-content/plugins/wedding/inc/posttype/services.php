<?php

if ( ! function_exists('wedding_post_type_services') ) {
    function wedding_post_type_services() {
        $labels = array(
            'name'                  => _x( 'Services', 'Post Type General Name', 'wedding' ),
            'singular_name'         => _x( 'Services', 'Post Type Singular Name', 'wedding' ),
            'menu_name'             => __( 'Services', 'wedding' ),
            'name_admin_bar'        => __( 'Services', 'wedding' ),
            'archives'              => __( 'Item Archives', 'wedding' ),
            'attributes'            => __( 'Item Attributes', 'wedding' ),
            'parent_item_colon'     => __( 'Parent Item:', 'wedding' ),
            'all_items'             => __( 'All Items', 'wedding' ),
            'add_new_item'          => __( 'Add New Item', 'wedding' ),
            'add_new'               => __( 'Add New', 'wedding' ),
            'new_item'              => __( 'New Item', 'wedding' ),
            'edit_item'             => __( 'Edit Item', 'wedding' ),
            'update_item'           => __( 'Update Item', 'wedding' ),
            'view_item'             => __( 'View Item', 'wedding' ),
            'view_items'            => __( 'View Items', 'wedding' ),
            'search_items'          => __( 'Search Item', 'wedding' ),
            'not_found'             => __( 'Not found', 'wedding' ),
            'not_found_in_trash'    => __( 'Not found in Trash', 'wedding' ),
            'featured_image'        => __( 'Featured Image', 'wedding' ),
            'set_featured_image'    => __( 'Set featured image', 'wedding' ),
            'remove_featured_image' => __( 'Remove featured image', 'wedding' ),
            'use_featured_image'    => __( 'Use as featured image', 'wedding' ),
            'insert_into_item'      => __( 'Insert into item', 'wedding' ),
            'uploaded_to_this_item' => __( 'Uploaded to this item', 'wedding' ),
            'items_list'            => __( 'Items list', 'wedding' ),
            'items_list_navigation' => __( 'Items list navigation', 'wedding' ),
            'filter_items_list'     => __( 'Filter items list', 'wedding' ),
        );
        $args = array(
            'label'                 => __( 'Services', 'wedding' ),
            'description'           => __( 'Services', 'wedding' ),
            'labels'                => $labels,
            'supports'              => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
            'hierarchical'          => false,
            'public'                => true,
            'show_ui'               => true,
            'show_in_menu'          => true,
            'menu_position'         => 5,
            'menu_icon'             => 'dashicons-schedule',
            'show_in_admin_bar'     => true,
            'show_in_nav_menus'     => true,
            'can_export'            => true,
            'has_archive'           => true,
            'exclude_from_search'   => true,
            'publicly_queryable'    => true,
            'show_in_rest'          => true,
            'capability_type'       => 'post',
        );
        register_post_type(wedding_POST_TYPE_SERVICES, $args );
    
    }
    add_action( 'init', 'wedding_post_type_services', 0 );
}
