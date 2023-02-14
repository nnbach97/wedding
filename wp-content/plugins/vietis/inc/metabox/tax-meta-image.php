<?php

if (!class_exists('wedding_tax_meta_image')) {
    class wedding_tax_meta_image {
        public function __construct() {
            add_action( 'technology_add_form_fields', array ( $this, 'add_category_image' ), 10, 2 );
            add_action( 'created_technology', array ( $this, 'save_category_image' ), 10, 2 );
            add_action( 'technology_edit_form_fields', array ( $this, 'update_category_image' ), 10, 2 );
            add_action( 'edited_technology', array ( $this, 'updated_category_image' ), 10, 2 );
        }

        public function add_category_image ($taxonomy) { ?>
            <div class="wrapper-images-list single">
                <label><?php _e( 'Hình ảnh', 'wedding' ); ?></label>
                <div class="images-list js-category-image-wrapper" style="display: none;">
                    <div class="item" style="width: 100px;">
                        <div class="wrap"></div>
                    </div>
                    <br>
                </div>
                <br>
                <input type="hidden" class="js-category-image-id" name="category-image-id" value="">
                <input type="button" class="button button-secondary js-category-botton-add" value="<?php _e( 'Add Image', 'wedding' ); ?>" />
                <input type="button" class="button button-secondary js-category-botton-remove" style="display: none;" value="<?php _e( 'Remove Image', 'wedding' ); ?>" />
            </div>
        <?php }

        public function update_category_image ( $term, $taxonomy ) { ?>
            <tr class="form-field term-group-wrap">
                <th scope="row"><label><?php _e( 'Hình ảnh', 'wedding' ); ?></label></th>
                <td>
                    <?php $image_id = get_term_meta ($term->term_id, 'category-image-id', true ); ?>
                    <div class="wrapper-images-list single">
                        <label><?php _e( 'Hình ảnh', 'wedding' ); ?></label>
                        <div class="images-list js-category-image-wrapper" style="<?= $image_id ? '' : 'display: none;'; ?>">
                            <div class="item" style="width: 100px;">
                                <div class="wrap">
                                    <?php if ($image_id): ?>
                                        <?= wp_get_attachment_image($image_id, 'thumbnail'); ?>
                                    <?php endif; ?>
                                </div>
                            </div>
                            <br>
                        </div>
                        <br>
                        <input type="hidden" class="js-category-image-id" name="category-image-id" value="<?= $image_id; ?>">
                        <input type="button" class="button button-secondary js-category-botton-add" value="<?php _e( 'Add Image', 'wedding' ); ?>" />
                        <input type="button" class="button button-secondary js-category-botton-remove" style="<?= $image_id ? '' : 'display: none;'; ?>" value="<?php _e( 'Remove Image', 'wedding' ); ?>" />
                    </div>
                </td>
            </tr>
        <?php }

        public function save_category_image ( $term_id, $tt_id ) {
            $id = wedding_func_check_data('category-image-id', $_POST);
            if ($id) add_term_meta($term_id, 'category-image-id', $id, true );
        }

        public function updated_category_image ( $term_id, $tt_id ) {
            $id = wedding_func_check_data('category-image-id', $_POST);
            update_term_meta($term_id, 'category-image-id', ($id ? $id : ''));
        }
    }
    new wedding_tax_meta_image();
}
