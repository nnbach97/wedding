<?php
class metabox_work_color {
  public function __construct() {
    add_action('add_meta_boxes', [$this, 'meta_boxes']);
    add_action('save_post', [$this, 'save']); // Action to save metabox
  }

  public function meta_boxes() {
    add_meta_box('metabox_work_color', __('Title Color', 'vietis'), [$this, 'output'], [VIETIS_POST_TYPE_WORKS], 'side', 'default');
  }

  public function output() {
    global $post;
    $project_color = get_post_meta($post->ID, 'project_color', true );
    if(empty($project_color)){
      $project_color = "#2f5aa8";
    }
    ?>
      <div class="components-panel__body components-panel__body--banner">
        <div class="components-base-control">
          <div class="components-base-control__field">
            <p style="width: 100%">Chọn màu chủ đạo:</p>
            <input type="color" value="<?= $project_color ?>" class="my-color-field" name="project_color" />
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
    $project_color = (isset($_POST['project_color']) ? $_POST['project_color'] : '');
    update_post_meta($post_id, 'project_color', $project_color);
  }
}

new metabox_work_color();
