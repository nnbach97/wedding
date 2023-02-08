(function ($) {
  $(function () {
    /* Scroll header handling */
    function fixHeader() {
      const heroHeight = $(".js-hero").outerHeight();
      const scroll = $(window).scrollTop();

      if (scroll >= heroHeight) {
        $(".js-header").addClass("fixed");
        $(".js-header .header-inner").addClass("fixed");
        $(".js-backTop").addClass("visible");
      } else {
        $(".js-header").removeClass("fixed");
        $(".js-header .header-inner").removeClass("fixed");
        $(".js-backTop").removeClass("visible");
      }
    }

    fixHeader();

    $(window).on("scroll", function () {
      fixHeader();
    });

    $(".js-backTop").on("click", function (e) {
      e.preventDefault();
      $("html, body").animate({ scrollTop: 0 }, "slow");
    });

    /* Menu SP handling */
    $(".js-toggle-menu").on("click", function () {
      $("body").toggleClass("isOpen");
    });

    $("body").on("click", function (e) {
      if ($(e.target).is(".js-header-sp")) {
        $("body").toggleClass("isOpen");
      }
    });

    /* Show/hidden sub-menu */

    // Create span
    $(".js-header-sp .menu-item-has-children").prepend(
      '<span class="header-sp-arrow js-header-sp-arrow"><i class="fa-solid fa-chevron-down"></i></span>'
    );

    $(".js-header-sp .js-header-sp-arrow").click(function () {
      var $this = $(this);
      var $listChild = $this.parent().find("> ul");
      if ($this.hasClass("show-menu")) {
        $listChild.slideUp();
      } else {
        $listChild.slideDown();
      }
      $this.toggleClass("show-menu");
    });

    /* Active current page */
    $(".js-nav-pc a, .js-nav-sp a").each(function () {
      if ($(this).attr("aria-current") === "page") $(this).addClass("active");
    });

    $(".js-nav-pc > ul > li, .js-nav-sp > li").each(function () {
      if ($(this).hasClass("current-menu-parent")) {
        $(this).children("a").addClass("active");
      }
    });

    var timer;
    var waitTime = 1000;
    $(".js-multiple-checkbox-delay").change(function () {
      if (timer) clearTimeout(timer);
      var $this = $(this);
      timer = setTimeout(function () {
        $this.closest("form").submit();
      }, waitTime);
    });

    // Scroll to id
    var flag = true;
    function scrollToID(isHash) {
      if (isHash) {
        // get the hash
        var target = window.location.hash;
        var heightPadding = $(target).innerHeight() - $(target).height();
        var heightNav = $(".js-header").height();
        $("html, body")
          .stop()
          .animate(
            {
              scrollTop: $(target).offset().top - heightNav - (flag ? heightPadding : 0),
            },
            "slow"
          );
        flag = false;
      }
    }

    scrollToID(window.location.hash);
    $(window).on("hashchange", function (e) {
      scrollToID(window.location.hash);
    });
  });
})(jQuery);
