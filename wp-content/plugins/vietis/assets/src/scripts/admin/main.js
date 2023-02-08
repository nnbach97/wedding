var MainAdmin = {};
(function ($) {
  $(function () {
    $(".js-category-botton-add").click(function () {
      wp.media.editor.send.attachment = function (props, attachment) {
        if (!attachment) return false;
        $(".js-category-image-id").val(attachment.id);
        $(".js-category-image-wrapper")
          .show()
          .find(".wrap")
          .html('<img src="' + attachment.url + '" alt="" />');
        $(".js-category-botton-remove").show();
      };
      wp.media.editor.open();
      return false;
    });

    $(".js-category-botton-remove").click(function () {
      $(".js-category-image-id").val("");
      $(".js-category-image-wrapper").hide().find(".wrap").html("");
      $(".js-category-botton-remove").hide();
      return false;
    });

    $(document).ajaxComplete(function (event, xhr, settings) {
      var queryStringArr = settings.data.split("&");
      if ($.inArray("action=add-tag", queryStringArr) !== -1) {
        var xml = xhr.responseXML;
        $response = $(xml).find("term_id").text();
        if ($response != "") {
          $(".js-category-image-id").val("");
          $(".js-category-image-wrapper").hide().find(".wrap").html("");
          $(".js-category-botton-remove").hide();
        }
      }
    });
  });
})(jQuery);
