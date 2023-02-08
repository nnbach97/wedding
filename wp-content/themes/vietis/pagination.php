<?php
    $custom_query = vietis_func_check_data('custom_query', $args, null);
	if ($custom_query) {
		$query = $custom_query;
	} else {
        global $wp_query;
        $query = $wp_query;
    }
?>
<?php if ($query->found_posts > 0): ?>
    <div class="block-pagination">
        <div class="holder">
            <?php vietis_pagination($query); ?>
        </div>
    </div>
<?php endif; ?>
