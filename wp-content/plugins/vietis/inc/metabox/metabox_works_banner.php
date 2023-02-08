<?php
class metabox_img_banner_works {
  public function __construct() {
    add_action('add_meta_boxes', [$this, 'meta_boxes']);
    add_action('save_post', [$this, 'save']); // Action to save metabox
  }

  public function meta_boxes() {
    add_meta_box('metabox_img_banner_works', __('Image Banner', 'vietis'), [$this, 'output'], [VIETIS_POST_TYPE_WORKS], 'side', 'default');
  }

  public function output() {
    global $post;
    $img_banner = get_post_meta($post->ID, 'img_banner', true );
    ?>
      <div class="components-panel__body components-panel__body--banner">
        <div class="components-base-control">
          <div class="components-base-control__field">
            <p>
              <input type="hidden" value="<?= esc_attr($img_banner) ?>" name="img_banner" class="regular-text process_custom_images js-attachmentInput" id="process_custom_images">
              <a href="" class="set_custom_images button">Click here to add banner image</a>
            </p>
            <figure style="margin: 0; width: 100%">
              <img src="<?= wp_get_attachment_url($img_banner) ?>" alt="" class="attachment_img">
            </figure>
            <a href="" class="js-deleteImg" style="color: #cc1818; display: none">Delete logo image</a>
          </div>
        </div>
      </div>
      <script>
      jQuery(document).ready(function() {
        var $ = jQuery;
        if ($('.set_custom_images').length > 0) {
          if ( typeof wp !== 'undefined' && wp.media && wp.media.editor) {
            $('.set_custom_images').on('click', function(e) {
              e.preventDefault();
              const self = $(this);
              var button = $(this);
              var id = button.prev();
              wp.media.editor.send.attachment = function(props, attachment) {
                id.val(attachment.id);
                self.parent().siblings().find(".attachment_img").attr('src', attachment.url);
                self.parent().siblings(".js-deleteImg").show();
              };
              wp.media.editor.open(button);
              return false;
            });
          }
        }

        $(".js-attachmentInput").each(function() {
          if($(this).val() !== "") $(this).parent().siblings(".js-deleteImg").show();
          else $(this).parent().siblings(".js-deleteImg").hide();
        });

        $(".js-deleteImg").on("click", function(e) {
          e.preventDefault();
          $(this).parent().find(".js-attachmentInput").val('');
          $(this).parent().find(".attachment_img").attr("src", "");
          $(this).hide();
        });
      });
    </script>
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
    $img_banner = (isset($_POST['img_banner']) ? $_POST['img_banner'] : '');
    update_post_meta($post_id, 'img_banner', $img_banner);
  }
}

new metabox_img_banner_works();
