<?php
class metabox_url_release_works {
  public function __construct() {
    add_action('add_meta_boxes', [$this, 'meta_boxes']);
    add_action('save_post', [$this, 'save']); // Action to save metabox
  }

  public function meta_boxes() {
    add_meta_box('metabox_url_release_works', __('Link release', 'vietis'), [$this, 'output'], [VIETIS_POST_TYPE_WORKS], 'side', 'default');
  }

  public function output() {
    global $post;
    $link_release = get_post_meta($post->ID, 'link_release', true );
    ?>
      <div class="components-panel__body components-panel__body--url">
        <div class="components-base-control">
          <div class="components-base-control__field">
            <input type="text" name="link_release" class="components-text-control__input" placeholder="<?= __('Link release', 'vietis'); ?>" value="<?= esc_attr($link_release); ?>">
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
    $link_release = (isset($_POST['link_release']) ? $_POST['link_release'] : '');
    update_post_meta($post_id, 'link_release', $link_release);
  }
}

new metabox_url_release_works();
