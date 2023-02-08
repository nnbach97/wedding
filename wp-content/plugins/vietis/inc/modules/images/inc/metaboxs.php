<?php

class vietis_modules_images_settings {
	public function __construct() {
		add_action('add_meta_boxes', [$this, 'meta_boxes']);
		add_action('save_post', [$this, 'save']);
	}

	public function meta_boxes() {
		add_meta_box('images-metabox-images', __('Images', 'vietis'), [$this, 'output'], REGISTER_POST_TYPE, 'side', 'default');
	}

	public function output() {
		global $post;
		$thumbnailId = get_post_thumbnail_id($post->ID);
		$attachments = get_post_meta($post->ID, IMAGES_META_KEY, true );
		$update_meta   = false;
		$attachmentIds = [];
		?>
		<div class="images_list_container js-imagesListContainer">
			<ul class="js-imagesListWrapper wrapper_item">
				<?php if (!empty($attachments)): $isActive = false; ?>
					<?php foreach ( $attachments as $attachment_id ): ?>
						<?php
							$attachment = wp_get_attachment_image($attachment_id, 'thumbnail' );
							if ( empty( $attachment ) ) {
								$update_meta = true;
								continue;
							}
							$attachmentIds[] = $attachment_id;

							$classImage = '';
							if ($attachment_id == $thumbnailId && !$isActive) {
								$isActive = true;
								$classImage = 'active';
							}
						?>
						<li class="js-imagesListItem item" data-attachment_id="<?= esc_attr($attachment_id); ?>">
							<div class="img <?= IMAGES_IS_THUMB ? 'js-imageSetActive ' . $classImage : '' ?>"><?= $attachment; ?></div>
							<a href="#" class="js-deleteItem delete">Delete</a>
						</li>
					<?php endforeach; ?>
				<?php endif; ?>
			</ul>

			<?php if (IMAGES_IS_THUMB): ?>
				<input type="hidden" id="_thumbnail_id" class="js-thumbnailId" name="_custom_thumbnail_id" value="<?= $thumbnailId; ?>">
			<?php endif; ?>

			<input type="hidden" class="js-imagesGallery" name="<?= IMAGES_META_KEY; ?>" value="<?= $attachments ? esc_attr(implode(',', $attachments)) : ''; ?>" />
		</div>
		<p class="metabox_link hide-if-no-js js-addImage <?= IMAGES_IS_THUMB ? 'hasThumb' : '' ?>">
			<a href="javascript:void(0)" data-choose="Add Images to Gallery" data-update="Add to gallery" data-delete="Delete image" data-text="Delete">Add images</a>
		</p>
		<?php
	}

	public function save($post_id) {
		global $post_type;
		$check_autosave = defined( 'DOING_AUTOSAVE') && DOING_AUTOSAVE; // Check Autosave
		$check_revision = !isset($_POST['post_ID']) || $post_id != $_POST['post_ID']; // Check Revision
		$check_edit_post_1 = !current_user_can('edit_post', $post_id); // Check if user can edit the post.
		$check_edit_post_2 = !in_array($post_type, explode(',', REGISTER_POST_TYPE)); // Check if user can edit the post.

		if ($check_autosave || $check_revision || $check_edit_post_1 || $check_edit_post_2){
		  return $post_id;
		}

		if (IMAGES_IS_THUMB) {
			$customThumbnailId = isset( $_POST['_custom_thumbnail_id'] ) ? sanitize_text_field( $_POST['_custom_thumbnail_id'] ) : '';
			if (!empty($customThumbnailId)) {
				update_post_meta($post_id, IMAGES_THUMBNAIL_ID, $customThumbnailId);
			}
		}

		$images = isset($_POST[IMAGES_META_KEY]) ? explode(',', $_POST[IMAGES_META_KEY]) : [];
		update_post_meta($post_id, IMAGES_META_KEY, $images);
	}
}

new vietis_modules_images_settings();
