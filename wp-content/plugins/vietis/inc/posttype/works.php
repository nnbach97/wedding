<?php

if ( ! function_exists('vietis_post_type_works') ) {
    function vietis_post_type_works() {
        $labels = array(
            'name'                  => _x( 'Case Study', 'Post Type General Name', 'vietis' ),
            'singular_name'         => _x( 'Works', 'Post Type Singular Name', 'vietis' ),
            'menu_name'             => __( 'Works', 'vietis' ),
            'name_admin_bar'        => __( 'Works', 'vietis' ),
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
            'label'                 => __( 'Works', 'vietis' ),
            'description'           => __( 'Works', 'vietis' ),
            'labels'                => $labels,
            'supports'              => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
            'taxonomies'            => array( VIETIS_TAXONOMY_TECHNOLOGY, VIETIS_TAXONOMY_SCOPE),
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
        register_post_type(VIETIS_POST_TYPE_WORKS, $args );

    }
    add_action( 'init', 'vietis_post_type_works', 0 );
}

if ( ! function_exists('vietis_taxonomy_technology') ) {
    function vietis_taxonomy_technology() {
        $labels = array(
            'name'                       => _x( 'Technologies', 'Taxonomy General Name', 'vietis' ),
            'singular_name'              => _x( 'Technology', 'Taxonomy Singular Name', 'vietis' ),
            'menu_name'                  => __( 'Technology', 'vietis' ),
            'all_items'                  => __( 'All Items', 'vietis' ),
            'parent_item'                => __( 'Parent Item', 'vietis' ),
            'parent_item_colon'          => __( 'Parent Item:', 'vietis' ),
            'new_item_name'              => __( 'New Item Name', 'vietis' ),
            'add_new_item'               => __( 'Add New Item', 'vietis' ),
            'edit_item'                  => __( 'Edit Item', 'vietis' ),
            'update_item'                => __( 'Update Item', 'vietis' ),
            'view_item'                  => __( 'View Item', 'vietis' ),
            'separate_items_with_commas' => __( 'Separate items with commas', 'vietis' ),
            'add_or_remove_items'        => __( 'Add or remove items', 'vietis' ),
            'choose_from_most_used'      => __( 'Choose from the most used', 'vietis' ),
            'popular_items'              => __( 'Popular Items', 'vietis' ),
            'search_items'               => __( 'Search Items', 'vietis' ),
            'not_found'                  => __( 'Not Found', 'vietis' ),
            'no_terms'                   => __( 'No items', 'vietis' ),
            'items_list'                 => __( 'Items list', 'vietis' ),
            'items_list_navigation'      => __( 'Items list navigation', 'vietis' ),
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
        register_taxonomy(VIETIS_TAXONOMY_TECHNOLOGY, array(VIETIS_POST_TYPE_WORKS), $args );

    }
    add_action( 'init', 'vietis_taxonomy_technology', 0 );
}

if ( ! function_exists('vietis_taxonomy_scope') ) {
    function vietis_taxonomy_scope() {
        $labels = array(
            'name'                       => _x( 'Scopes', 'Taxonomy General Name', 'vietis' ),
            'singular_name'              => _x( 'Scope', 'Taxonomy Singular Name', 'vietis' ),
            'menu_name'                  => __( 'Scope', 'vietis' ),
            'all_items'                  => __( 'All Items', 'vietis' ),
            'parent_item'                => __( 'Parent Item', 'vietis' ),
            'parent_item_colon'          => __( 'Parent Item:', 'vietis' ),
            'new_item_name'              => __( 'New Item Name', 'vietis' ),
            'add_new_item'               => __( 'Add New Item', 'vietis' ),
            'edit_item'                  => __( 'Edit Item', 'vietis' ),
            'update_item'                => __( 'Update Item', 'vietis' ),
            'view_item'                  => __( 'View Item', 'vietis' ),
            'separate_items_with_commas' => __( 'Separate items with commas', 'vietis' ),
            'add_or_remove_items'        => __( 'Add or remove items', 'vietis' ),
            'choose_from_most_used'      => __( 'Choose from the most used', 'vietis' ),
            'popular_items'              => __( 'Popular Items', 'vietis' ),
            'search_items'               => __( 'Search Items', 'vietis' ),
            'not_found'                  => __( 'Not Found', 'vietis' ),
            'no_terms'                   => __( 'No items', 'vietis' ),
            'items_list'                 => __( 'Items list', 'vietis' ),
            'items_list_navigation'      => __( 'Items list navigation', 'vietis' ),
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
        register_taxonomy(VIETIS_TAXONOMY_SCOPE, array(VIETIS_POST_TYPE_WORKS), $args );

    }
    add_action( 'init', 'vietis_taxonomy_scope', 0 );
}

if ( ! function_exists('vietis_taxonomy_works_category') ) {
    function vietis_taxonomy_works_category() {
        $labels = array(
            'name'                       => _x( 'Categories', 'Taxonomy General Name', 'vietis' ),
            'singular_name'              => _x( 'Categories', 'Taxonomy Singular Name', 'vietis' ),
            'menu_name'                  => __( 'Categories', 'vietis' ),
            'all_items'                  => __( 'All Items', 'vietis' ),
            'parent_item'                => __( 'Parent Item', 'vietis' ),
            'parent_item_colon'          => __( 'Parent Item:', 'vietis' ),
            'new_item_name'              => __( 'New Item Name', 'vietis' ),
            'add_new_item'               => __( 'Add New Item', 'vietis' ),
            'edit_item'                  => __( 'Edit Item', 'vietis' ),
            'update_item'                => __( 'Update Item', 'vietis' ),
            'view_item'                  => __( 'View Item', 'vietis' ),
            'separate_items_with_commas' => __( 'Separate items with commas', 'vietis' ),
            'add_or_remove_items'        => __( 'Add or remove items', 'vietis' ),
            'choose_from_most_used'      => __( 'Choose from the most used', 'vietis' ),
            'popular_items'              => __( 'Popular Items', 'vietis' ),
            'search_items'               => __( 'Search Items', 'vietis' ),
            'not_found'                  => __( 'Not Found', 'vietis' ),
            'no_terms'                   => __( 'No items', 'vietis' ),
            'items_list'                 => __( 'Items list', 'vietis' ),
            'items_list_navigation'      => __( 'Items list navigation', 'vietis' ),
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
        register_taxonomy(VIETIS_TAXONOMY_WORKS_CATEGORY, array(VIETIS_POST_TYPE_WORKS), $args );

    }
    add_action( 'init', 'vietis_taxonomy_works_category', 0 );
}

if ( ! function_exists('vietis_taxonomy_works_tag') ) {
    function vietis_taxonomy_works_tag() {
        $labels = array(
            'name'                       => _x( 'Tags', 'Taxonomy General Name', 'vietis' ),
            'singular_name'              => _x( 'Tags', 'Taxonomy Singular Name', 'vietis' ),
            'menu_name'                  => __( 'Tags', 'vietis' ),
            'all_items'                  => __( 'All Items', 'vietis' ),
            'parent_item'                => __( 'Parent Item', 'vietis' ),
            'parent_item_colon'          => __( 'Parent Item:', 'vietis' ),
            'new_item_name'              => __( 'New Item Name', 'vietis' ),
            'add_new_item'               => __( 'Add New Item', 'vietis' ),
            'edit_item'                  => __( 'Edit Item', 'vietis' ),
            'update_item'                => __( 'Update Item', 'vietis' ),
            'view_item'                  => __( 'View Item', 'vietis' ),
            'separate_items_with_commas' => __( 'Separate items with commas', 'vietis' ),
            'add_or_remove_items'        => __( 'Add or remove items', 'vietis' ),
            'choose_from_most_used'      => __( 'Choose from the most used', 'vietis' ),
            'popular_items'              => __( 'Popular Items', 'vietis' ),
            'search_items'               => __( 'Search Items', 'vietis' ),
            'not_found'                  => __( 'Not Found', 'vietis' ),
            'no_terms'                   => __( 'No items', 'vietis' ),
            'items_list'                 => __( 'Items list', 'vietis' ),
            'items_list_navigation'      => __( 'Items list navigation', 'vietis' ),
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
        register_taxonomy(VIETIS_TAXONOMY_WORKS_TAG, array(VIETIS_POST_TYPE_WORKS), $args );

    }
    add_action( 'init', 'vietis_taxonomy_works_tag', 0 );
}
