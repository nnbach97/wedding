<?php
class metabox_work_is_highlight {
  public function __construct() {
    add_action('add_meta_boxes', [$this, 'meta_boxes']);
    add_action('save_post', [$this, 'save']); // Action to save metabox
  }

  public function meta_boxes() {
    add_meta_box('metabox_work_is_highlight',
       __('Highlight Post', 'wedding'), [$this, 'output'], [wedding_POST_TYPE_WORKS], 'side', 'default');
  }

  public function output() {
    global $post;
    $show = get_post_meta($post->ID, 'isHighlight', true );
    ?>
      <div class="components-panel__body components-panel__body--banner">
        <div class="components-base-control">
          <div class="components-base-control__field">
            <select name="isHighlight" style="width: 80%">
              <option value="true" <?= $show === "true" && $show !== null && $show !== false ? "selected" : "" ?> >Có</option>
              <option value="false" <?= $show === "false" || $show === null || $show === '' || $show === false ? "selected" : "" ?>>Không</option>
            </select>
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
    $check_edit_post_2 = !in_array($post_type, [wedding_POST_TYPE_WORKS]); // Check if user can edit the post.
    if ($check_autosave || $check_revision || $check_edit_post_1 || $check_edit_post_2){
      return $post_id;
    }
    $show = (isset($_POST['isHighlight']) ? $_POST['isHighlight'] : '');
    update_post_meta($post_id, 'isHighlight', trim($show));
  }
}

new metabox_work_is_highlight();
