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

    // Click Scroll to id
    // Xoa hash URL
    function removeHash() {
      history.replaceState(
        "",
        document.title,
        window.location.origin + window.location.pathname + window.location.search
      );
    }

    // Scroll
    function smoothScrolling($scrollLinks, $topOffset) {
      var links = $scrollLinks;
      var topGap = $topOffset;

      links.on("click", function () {
        if (
          location.pathname.replace(/^\//, "") === this.pathname.replace(/^\//, "") &&
          location.hostname === this.hostname
        ) {
          var target = $(this.hash);
          if (target.length) {
            $("html, body").animate(
              {
                scrollTop: target.offset().top - topGap,
              },
              1000
            );
            setTimeout(() => {
              removeHash();
            }, 5);

            return false;
          }
        }
        return false;
      });
    }

    smoothScrolling($(".js-header a[href^='#']"), $(".js-header").innerHeight());

    // Heart Fly
    var love = setInterval(function () {
      var r_num = Math.floor(Math.random() * 40) + 1;
      var r_size = Math.floor(Math.random() * 65) + 10;
      var r_left = Math.floor(Math.random() * 100) + 1;
      var r_bg = Math.floor(Math.random() * 25) + 100;
      var r_time = Math.floor(Math.random() * 5) + 5;

      $(".bg_heart").append(
        "<div class='heart' style='width:" +
          r_size +
          "px;height:" +
          r_size +
          "px;left:" +
          r_left +
          "%;background:rgba(255," +
          (r_bg - 25) +
          "," +
          r_bg +
          ",1);-webkit-animation:love " +
          r_time +
          "s ease;-moz-animation:love " +
          r_time +
          "s ease;-ms-animation:love " +
          r_time +
          "s ease;animation:love " +
          r_time +
          "s ease'></div>"
      );

      $(".bg_heart").append(
        "<div class='heart' style='width:" +
          (r_size - 10) +
          "px;height:" +
          (r_size - 10) +
          "px;left:" +
          (r_left + r_num) +
          "%;background:rgba(255," +
          (r_bg - 25) +
          "," +
          (r_bg + 25) +
          ",1);-webkit-animation:love " +
          (r_time + 5) +
          "s ease;-moz-animation:love " +
          (r_time + 5) +
          "s ease;-ms-animation:love " +
          (r_time + 5) +
          "s ease;animation:love " +
          (r_time + 5) +
          "s ease'></div>"
      );

      $(".heart").each(function () {
        var top = $(this)
          .css("top")
          .replace(/[^-\d\.]/g, "");
        var width = $(this)
          .css("width")
          .replace(/[^-\d\.]/g, "");
        if (top <= -100 || width >= 150) {
          $(this).detach();
        }
      });
    }, 500);

    // END: Heart Fly
  });
})(jQuery);
