<?php
class metabox_work_custom_description {
  public function __construct() {
    add_action('add_meta_boxes', [$this, 'meta_boxes']);
    add_action('save_post', [$this, 'save']); // Action to save metabox
  }

  public function meta_boxes() {
    add_meta_box('class metabox_work_custom_description {
      ', __('Custom Description', 'vietis'), [$this, 'output'], [VIETIS_POST_TYPE_WORKS], 'side', 'default');
  }

  public function output() {
    global $post;
    $desc = get_post_meta($post->ID, 'custom_description_work', true );
    ?>
      <div class="components-panel__body components-panel__body--banner">
        <div class="components-base-control">
          <div class="components-base-control__field">
            <p style="width: 100%">Description</p>
            <textarea style="width: 100%" rows="4" name="custom_description_work"><?=$desc?></textarea>
          </div>
        </div>
      </div>
    <?php
  }

  public function save($post_id) {
    global $post_type;
    $check_autosave = defined( 'DOING_AUTOSAVE') && DOING_AUTOSAVE; // Check Autosave
    $check_revision = !isset($_POST['post_ID']) || $post_id != $_POST['post_ID']; // Check Revision
    $check_edit_post_1 = !current_user_can('edit_post', $post_id); // Check if user can edit the post.
    $check_edit_post_2 = !in_array($post_type, [VIETIS_POST_TYPE_WORKS]); // Check if user can edit the post.
    if ($check_autosave || $check_revision || $check_edit_post_1 || $check_edit_post_2){
      return $post_id;
    }
    $desc = (isset($_POST['custom_description_work']) ? $_POST['custom_description_work'] : '');
    update_post_meta($post_id, 'custom_description_work', trim($desc));
  }
}

new metabox_work_custom_description();
