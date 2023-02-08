jQuery(function ($) {
  var metaBoxes = {};
  metaBoxes.gallery_frame = false;
  metaBoxes.image_gallery_ids = $(".js-imagesGallery");
  metaBoxes.images = $(".js-imagesListWrapper");
  metaBoxes.images_item = $(".js-imagesListItem");
  metaBoxes.custom_thumbnail_id = $(".js-thumbnailId");

  metaBoxes.images.on("click", ".js-imageSetActive", function (event) {
    var imageSetActive = metaBoxes.images.find(".js-imageSetActive");
    var checkActive = $(this).hasClass("active");
    imageSetActive.removeClass("active");
    var id = 0;
    if (!checkActive) {
      $(this).addClass("active");
      var id = $(this).closest(".js-imagesListItem").data("attachment_id");
    }
    metaBoxes.custom_thumbnail_id.val(id);
  });

  $(".js-addImage").on("click", "a", function (event) {
    var $el = $(this);
    event.preventDefault();

    // If the media frame already exists, reopen it.
    if (metaBoxes.gallery_frame) {
      metaBoxes.gallery_frame.open();
      return;
    }

    // Create the media frame.
    metaBoxes.gallery_frame = wp.media.frames.product_gallery = wp.media({
      // Set the title of the modal.
      title: $el.data("choose"),
      button: {
        text: $el.data("update"),
      },
      states: [
        new wp.media.controller.Library({
          title: $el.data("choose"),
          filterable: "all",
          multiple: true,
        }),
      ],
    });

    // When an image is selected, run a callback.
    metaBoxes.gallery_frame.on("select", function () {
      var selection = metaBoxes.gallery_frame.state().get("selection");
      var attachment_ids = metaBoxes.image_gallery_ids.val();

      selection.map(function (attachment) {
        attachment = attachment.toJSON();

        if (attachment.id) {
          attachment_ids = attachment_ids
            ? attachment_ids + "," + attachment.id
            : attachment.id;
          var attachment_image =
            attachment.sizes && attachment.sizes.thumbnail
              ? attachment.sizes.thumbnail.url
              : attachment.url;

          var emptyThumbnailId = metaBoxes.custom_thumbnail_id.val()
            ? false
            : true;

          var html = "";

          var classActive = "";
          if ($el.hasClass("hasThumb")) {
            classActive =
              "js-imageSetActive " + (emptyThumbnailId ? "active" : "");
          }

          html +=
            '<li class="js-imagesListItem item" data-attachment_id="' +
            attachment.id +
            '">';
          html +=
            '<div class="img' +
            classActive +
            '"><img src="' +
            attachment_image +
            '" /></div>';
          html +=
            '<a href="#" class="js-deleteItem delete">' +
            $el.data("text") +
            "</a>";
          html += "</li>";

          metaBoxes.images.append(html);
          metaBoxes.custom_thumbnail_id.val(attachment.id);
        }
      });

      metaBoxes.image_gallery_ids.val(attachment_ids);
    });

    metaBoxes.gallery_frame.open(); // Finally, open the modal.
  });

  // Image ordering.
  metaBoxes.images.sortable({
    items: ".js-imagesListItem",
    cursor: "move",
    scrollSensitivity: 40,
    forcePlaceholderSize: true,
    forceHelperSize: false,
    helper: "clone",
    opacity: 0.65,
    placeholder: "sortable-placeholder",
    start: function (event, ui) {
      ui.item.css("background-color", "#f6f6f6");
    },
    stop: function (event, ui) {
      ui.item.removeAttr("style");
    },
    update: function () {
      var attachment_ids = "";
      $(".js-imagesListItem")
        .css("cursor", "default")
        .each(function () {
          var attachment_id = $(this).attr("data-attachment_id");
          attachment_ids = attachment_ids + attachment_id + ",";
        });

      metaBoxes.image_gallery_ids.val(attachment_ids.substring(0, attachment_ids.length - 1));
    },
  });

  // Remove images.
  metaBoxes.images.on("click", ".js-deleteItem", function () {
    var deleteActive = false;
    if (
      $(this)
        .closest(".js-imagesListItem")
        .find(".js-imageSetActive")
        .hasClass("active")
    ) {
      var thumbnailId = metaBoxes.custom_thumbnail_id.val();
      metaBoxes.custom_thumbnail_id.val("");
      deleteActive = true;
    }

    var attachment_ids = "";
    var setThumbnailId = "";

    $(this).closest(".js-imagesListItem").remove();
    $(".js-imagesListItem")
      .css("cursor", "default")
      .each(function () {
        var attachment_id = $(this).attr("data-attachment_id");
        if (deleteActive && setThumbnailId == "") {
          setThumbnailId = attachment_id;
          $(this).find(".js-imageSetActive").addClass("active");
        }
        attachment_ids = attachment_ids + attachment_id + ",";
      });

    metaBoxes.custom_thumbnail_id.val(setThumbnailId);
    metaBoxes.image_gallery_ids.val(
      attachment_ids.substring(0, attachment_ids.length - 1)
    );

    return false;
  });
});
