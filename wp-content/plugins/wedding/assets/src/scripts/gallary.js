(function ($) {
  $(function () {
    /* Gallary */
    $(".js-slick-gallary .slick-slide img").click(function () {
      var src = $(this).attr("src");
    });

    $(".js-slick-gallary a.grouped_elements").fancybox({
      showNavArrows: true,
    });
    /* END: Gallary */
  });
})(jQuery);
