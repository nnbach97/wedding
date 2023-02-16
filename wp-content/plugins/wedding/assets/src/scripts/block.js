(function ($) {
  $(function () {
    /* Loading */
    function isLoading() {
      $("#loader-wrapper").fadeOut("1000");
    }

    isLoading();
    $(window).on("load", function () {
      isLoading();
    });
    /* END: Loading */

    /*Init Animate */
    new WOW().init();
    /*END:Init Animate */

    /* Auto play video banner bg */
    $(".js-video-bg")[0] && $(".js-video-bg")[0].play();
    /* END: Auto play video banner bg */

    /* Home click button film */
    $(".js-film").on("click", function (e) {
      e.preventDefault();
      $("body").toggleClass("show-film");
      if ($("body").hasClass("show-film")) {
        $(".js-film-video")[0].play();
      } else {
        $(".js-film-video")[0].pause();
      }
    });
    /* END: Home click button film */

    /* Home - Outsource show/hide QA */
    $(".js-list-whys")
      .children()
      .each(function (index, value) {
        if (index !== 0) return;
        $(value).children().first().addClass("expanded");
        $(value).children().last().addClass("show");
        $(value).children().last().css("display", "block");
      });

    $(".js-outsource-toggle").click(function (e) {
      var $this = $(this);

      e.preventDefault();
      $(".js-outsource-toggle").removeClass("expanded");

      if ($this.next().hasClass("show")) {
        $this.next().removeClass("show").slideUp(350);
      } else {
        $(".js-outsource-expand").removeClass("show").slideUp(350);
        $this.next().toggleClass("show").slideToggle(350);
        $this.toggleClass("expanded");
      }
    });
    /* END: Home - Outsource show/hide QA */

    /* Home: Counter */

    function countAnimate() {
      $(".js-counter").each(function () {
        if ($(this).hasClass("animated")) {
          $(this)
            .prop("Counter", 0)
            .animate(
              {
                Counter: $(this).attr("data-value"),
              },
              {
                duration: 2000,
                easing: "swing",
                step: function (now) {
                  $(this).text(Math.ceil(now));
                },
              }
            );

          $(this).removeClass("animated");
        }
      });

      return;
    }

    $(window).on("load", function () {
      countAnimate();
    });

    $(window).on("scroll", function () {
      countAnimate();
    });

    /* END: Home Counter */

    /* FeedBack */
    $(".js-slick-feedback").slick({
      dots: true,
      arrows: false,
      speed: 1000,
      autoplay: true,
      autoplaySpeed: 3000,
      // infinite: true,
      slidesToShow: 1,
      pauseOnHover: true,
      pauseOnFocus: true,
    });
    /* END: FeedBack */

    /* Teams */
    $(".js-slick-teams").slick({
      dots: true,
      arrows: false,
      speed: 3000,
      autoplay: true,
      autoplaySpeed: 3000,
      slidesToShow: 5,
      pauseOnHover: true,
      pauseOnFocus: true,
      slidesToScroll: 5,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 4,
          },
        },
        {
          breakpoint: 769,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
      ],
    });
    /* END: Teams */

    /* Process Service page */
    for (let i = 0; i <= 9; i++) {
      setTimeout(() => {
        $(`.js-animated-${i}`).css("opacity", 1);
      }, 300 * i);
    }
    /* END: Process Service page */
  });
})(jQuery);
