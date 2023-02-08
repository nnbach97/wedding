(function ($) {
  $(function () {
    $(window).scroll(function () {
      var scroll = $(window).scrollTop();
      var svgoffset = $(".block-product-overview").offset().top - 300;
      if (scroll >= svgoffset) {
        $(".block-product-overview-pc svg").addClass("active");
      }
    });
  });
})(jQuery);
