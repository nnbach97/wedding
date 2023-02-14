<?php

if ( ! function_exists('wedding_post_type_works') ) {
    function wedding_post_type_works() {
        $labels = array(
            'name'                  => _x( 'Case Study', 'Post Type General Name', 'wedding' ),
            'singular_name'         => _x( 'Works', 'Post Type Singular Name', 'wedding' ),
            'menu_name'             => __( 'Works', 'wedding' ),
            'name_admin_bar'        => __( 'Works', 'wedding' ),
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
            'label'                 => __( 'Works', 'wedding' ),
            'description'           => __( 'Works', 'wedding' ),
            'labels'                => $labels,
            'supports'              => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
            'taxonomies'            => array( wedding_TAXONOMY_TECHNOLOGY, wedding_TAXONOMY_SCOPE),
            'hierarchical'          => false,
            'public'                => true,
            'show_ui'               => true,
            'show_in_menu'          => true,
            'menu_position'         => 5,
            'menu_icon'             => 'dashicons-networking',
            'show_in_admin_bar'     => true,
            'show_in_nav_menus'     => true,
            'can_export'            => true,
            'has_archive'           => true,
            'exclude_from_search'   => true,
            'publicly_queryable'    => true,
            'show_in_rest'          => true,
            'capability_type'       => 'post',
        );
        register_post_type(wedding_POST_TYPE_WORKS, $args );

    }
    add_action( 'init', 'wedding_post_type_works', 0 );
}

if ( ! function_exists('wedding_taxonomy_technology') ) {
    function wedding_taxonomy_technology() {
        $labels = array(
            'name'                       => _x( 'Technologies', 'Taxonomy General Name', 'wedding' ),
            'singular_name'              => _x( 'Technology', 'Taxonomy Singular Name', 'wedding' ),
            'menu_name'                  => __( 'Technology', 'wedding' ),
            'all_items'                  => __( 'All Items', 'wedding' ),
            'parent_item'                => __( 'Parent Item', 'wedding' ),
            'parent_item_colon'          => __( 'Parent Item:', 'wedding' ),
            'new_item_name'              => __( 'New Item Name', 'wedding' ),
            'add_new_item'               => __( 'Add New Item', 'wedding' ),
            'edit_item'                  => __( 'Edit Item', 'wedding' ),
            'update_item'                => __( 'Update Item', 'wedding' ),
            'view_item'                  => __( 'View Item', 'wedding' ),
            'separate_items_with_commas' => __( 'Separate items with commas', 'wedding' ),
            'add_or_remove_items'        => __( 'Add or remove items', 'wedding' ),
            'choose_from_most_used'      => __( 'Choose from the most used', 'wedding' ),
            'popular_items'              => __( 'Popular Items', 'wedding' ),
            'search_items'               => __( 'Search Items', 'wedding' ),
            'not_found'                  => __( 'Not Found', 'wedding' ),
            'no_terms'                   => __( 'No items', 'wedding' ),
            'items_list'                 => __( 'Items list', 'wedding' ),
            'items_list_navigation'      => __( 'Items list navigation', 'wedding' ),
        );
        $args = array(
            'labels'                     => $labels,
            'hierarchical'               => true,
            'public'                     => false,
            'show_ui'                    => true,
            'show_admin_column'          => true,
            'show_in_nav_menus'          => true,
            'show_tagcloud'              => true,
            'show_in_rest'               => true,
        );
        register_taxonomy(wedding_TAXONOMY_TECHNOLOGY, array(wedding_POST_TYPE_WORKS), $args );

    }
    add_action( 'init', 'wedding_taxonomy_technology', 0 );
}

if ( ! function_exists('wedding_taxonomy_scope') ) {
    function wedding_taxonomy_scope() {
        $labels = array(
            'name'                       => _x( 'Scopes', 'Taxonomy General Name', 'wedding' ),
            'singular_name'              => _x( 'Scope', 'Taxonomy Singular Name', 'wedding' ),
            'menu_name'                  => __( 'Scope', 'wedding' ),
            'all_items'                  => __( 'All Items', 'wedding' ),
            'parent_item'                => __( 'Parent Item', 'wedding' ),
            'parent_item_colon'          => __( 'Parent Item:', 'wedding' ),
            'new_item_name'              => __( 'New Item Name', 'wedding' ),
            'add_new_item'               => __( 'Add New Item', 'wedding' ),
            'edit_item'                  => __( 'Edit Item', 'wedding' ),
            'update_item'                => __( 'Update Item', 'wedding' ),
            'view_item'                  => __( 'View Item', 'wedding' ),
            'separate_items_with_commas' => __( 'Separate items with commas', 'wedding' ),
            'add_or_remove_items'        => __( 'Add or remove items', 'wedding' ),
            'choose_from_most_used'      => __( 'Choose from the most used', 'wedding' ),
            'popular_items'              => __( 'Popular Items', 'wedding' ),
            'search_items'               => __( 'Search Items', 'wedding' ),
            'not_found'                  => __( 'Not Found', 'wedding' ),
            'no_terms'                   => __( 'No items', 'wedding' ),
            'items_list'                 => __( 'Items list', 'wedding' ),
            'items_list_navigation'      => __( 'Items list navigation', 'wedding' ),
        );
        $args = array(
            'labels'                     => $labels,
            'hierarchical'               => true,
            'public'                     => false,
            'show_ui'                    => true,
            'show_admin_column'          => true,
            'show_in_nav_menus'          => true,
            'show_tagcloud'              => true,
            'show_in_rest'               => true,
        );
        register_taxonomy(wedding_TAXONOMY_SCOPE, array(wedding_POST_TYPE_WORKS), $args );

    }
    add_action( 'init', 'wedding_taxonomy_scope', 0 );
}

if ( ! function_exists('wedding_taxonomy_works_category') ) {
    function wedding_taxonomy_works_category() {
        $labels = array(
            'name'                       => _x( 'Categories', 'Taxonomy General Name', 'wedding' ),
            'singular_name'              => _x( 'Categories', 'Taxonomy Singular Name', 'wedding' ),
            'menu_name'                  => __( 'Categories', 'wedding' ),
            'all_items'                  => __( 'All Items', 'wedding' ),
            'parent_item'                => __( 'Parent Item', 'wedding' ),
            'parent_item_colon'          => __( 'Parent Item:', 'wedding' ),
            'new_item_name'              => __( 'New Item Name', 'wedding' ),
            'add_new_item'               => __( 'Add New Item', 'wedding' ),
            'edit_item'                  => __( 'Edit Item', 'wedding' ),
            'update_item'                => __( 'Update Item', 'wedding' ),
            'view_item'                  => __( 'View Item', 'wedding' ),
            'separate_items_with_commas' => __( 'Separate items with commas', 'wedding' ),
            'add_or_remove_items'        => __( 'Add or remove items', 'wedding' ),
            'choose_from_most_used'      => __( 'Choose from the most used', 'wedding' ),
            'popular_items'              => __( 'Popular Items', 'wedding' ),
            'search_items'               => __( 'Search Items', 'wedding' ),
            'not_found'                  => __( 'Not Found', 'wedding' ),
            'no_terms'                   => __( 'No items', 'wedding' ),
            'items_list'                 => __( 'Items list', 'wedding' ),
            'items_list_navigation'      => __( 'Items list navigation', 'wedding' ),
        );
        $args = array(
            'labels'                     => $labels,
            'hierarchical'               => true,
            'public'                     => false,
            'show_ui'                    => true,
            'show_admin_column'          => true,
            'show_in_nav_menus'          => true,
            'show_tagcloud'              => true,
            'show_in_rest'               => true,
        );
        register_taxonomy(wedding_TAXONOMY_WORKS_CATEGORY, array(wedding_POST_TYPE_WORKS), $args );

    }
    add_action( 'init', 'wedding_taxonomy_works_category', 0 );
}

if ( ! function_exists('wedding_taxonomy_works_tag') ) {
    function wedding_taxonomy_works_tag() {
        $labels = array(
            'name'                       => _x( 'Tags', 'Taxonomy General Name', 'wedding' ),
            'singular_name'              => _x( 'Tags', 'Taxonomy Singular Name', 'wedding' ),
            'menu_name'                  => __( 'Tags', 'wedding' ),
            'all_items'                  => __( 'All Items', 'wedding' ),
            'parent_item'                => __( 'Parent Item', 'wedding' ),
            'parent_item_colon'          => __( 'Parent Item:', 'wedding' ),
            'new_item_name'              => __( 'New Item Name', 'wedding' ),
            'add_new_item'               => __( 'Add New Item', 'wedding' ),
            'edit_item'                  => __( 'Edit Item', 'wedding' ),
            'update_item'                => __( 'Update Item', 'wedding' ),
            'view_item'                  => __( 'View Item', 'wedding' ),
            'separate_items_with_commas' => __( 'Separate items with commas', 'wedding' ),
            'add_or_remove_items'        => __( 'Add or remove items', 'wedding' ),
            'choose_from_most_used'      => __( 'Choose from the most used', 'wedding' ),
            'popular_items'              => __( 'Popular Items', 'wedding' ),
            'search_items'               => __( 'Search Items', 'wedding' ),
            'not_found'                  => __( 'Not Found', 'wedding' ),
            'no_terms'                   => __( 'No items', 'wedding' ),
            'items_list'                 => __( 'Items list', 'wedding' ),
            'items_list_navigation'      => __( 'Items list navigation', 'wedding' ),
        );
        $args = array(
            'labels'                     => $labels,
            'hierarchical'               => false,
            'public'                     => false,
            'show_ui'                    => true,
            'show_admin_column'          => true,
            'show_in_nav_menus'          => true,
            'show_tagcloud'              => true,
            'show_in_rest'               => true,
        );
        register_taxonomy(wedding_TAXONOMY_WORKS_TAG, array(wedding_POST_TYPE_WORKS), $args );

    }
    add_action( 'init', 'wedding_taxonomy_works_tag', 0 );
}
