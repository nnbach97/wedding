<?php

add_action( 'init', function(){
	register_block_type( wedding_plugin_root() . '/build');
});

add_filter('block_categories', function($categories, $post){
	$categoryExt = [];
	$categoryExt[] = [
		'slug' => 'wedding',
		'title' => __('wedding', 'wedding'),
	];
	return array_merge($categoryExt, $categories);
}, 10, 2);


function add_works_columns($columns) {
	return array_merge($columns, 
						array('isHighlight' => __('Highlight', 'wedding')));
}
add_filter('manage_works_posts_columns' , 'add_works_columns');

function add_works_columns_data($columns){
	global $post;
	if($columns === "isHighlight"){
		$value = get_post_meta($post->ID, 'isHighlight', true);
		echo $value !== '' && $value !== false && $value === 'true' ? '<span style="color: green" class="dashicons dashicons-yes-alt"></span>' : '<span style="color: red" class="dashicons dashicons-no-alt"></span>';
	}
}
add_action( 'manage_works_posts_custom_column' , 'add_works_columns_data' );

