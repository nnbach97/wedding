<?php

if ( ! function_exists('vietis_post_type_services') ) {
    function vietis_post_type_services() {
        $labels = array(
            'name'                  => _x( 'Services', 'Post Type General Name', 'vietis' ),
            'singular_name'         => _x( 'Services', 'Post Type Singular Name', 'vietis' ),
            'menu_name'             => __( 'Services', 'vietis' ),
            'name_admin_bar'        => __( 'Services', 'vietis' ),
            'archives'              => __( 'Item Archives', 'vietis' ),
            'attributes'            => __( 'Item Attributes', 'vietis' ),
            'parent_item_colon'     => __( 'Parent Item:', 'vietis' ),
            'all_items'             => __( 'All Items', 'vietis' ),
            'add_new_item'          => __( 'Add New Item', 'vietis' ),
            'add_new'               => __( 'Add New', 'vietis' ),
            'new_item'              => __( 'New Item', 'vietis' ),
            'edit_item'             => __( 'Edit Item', 'vietis' ),
            'update_item'           => __( 'Update Item', 'vietis' ),
            'view_item'             => __( 'View Item', 'vietis' ),
            'view_items'            => __( 'View Items', 'vietis' ),
            'search_items'          => __( 'Search Item', 'vietis' ),
            'not_found'             => __( 'Not found', 'vietis' ),
            'not_found_in_trash'    => __( 'Not found in Trash', 'vietis' ),
            'featured_image'        => __( 'Featured Image', 'vietis' ),
            'set_featured_image'    => __( 'Set featured image', 'vietis' ),
            'remove_featured_image' => __( 'Remove featured image', 'vietis' ),
            'use_featured_image'    => __( 'Use as featured image', 'vietis' ),
            'insert_into_item'      => __( 'Insert into item', 'vietis' ),
            'uploaded_to_this_item' => __( 'Uploaded to this item', 'vietis' ),
            'items_list'            => __( 'Items list', 'vietis' ),
            'items_list_navigation' => __( 'Items list navigation', 'vietis' ),
            'filter_items_list'     => __( 'Filter items list', 'vietis' ),
        );
        $args = array(
            'label'                 => __( 'Services', 'vietis' ),
            'description'           => __( 'Services', 'vietis' ),
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
        register_post_type(VIETIS_POST_TYPE_SERVICES, $args );
    
    }
    add_action( 'init', 'vietis_post_type_services', 0 );
}