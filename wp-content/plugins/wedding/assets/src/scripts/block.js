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

    /* Coming count down */
    const second = 1000,
      minute = second * 60,
      hour = minute * 60,
      day = hour * 24;

    let today = new Date(),
      dd = String(today.getDate()).padStart(2, "0"),
      mm = String(today.getMonth() + 1).padStart(2, "0"),
      yyyy = today.getFullYear(),
      nextYear = yyyy + 1,
      dayMonth = $("#countdown").attr("data-countdown"),
      weddingDate = dayMonth + "/" + yyyy;

    today = mm + "/" + dd + "/" + yyyy;
    if (today > weddingDate) {
      weddingDate = dayMonth + nextYear;
    }
    //end

    const countDown = new Date(weddingDate).getTime(),
      x = setInterval(function () {
        const now = new Date().getTime(),
          distance = countDown - now;
        $("#days").text(Math.floor(distance / day)),
          $("#hours").text(Math.floor((distance % day) / hour)),
          $("#minutes").text(Math.floor((distance % hour) / minute)),
          $("#seconds").text(Math.floor((distance % minute) / second));
        if (isNaN(distance) || distance < 0) {
          $("#countdown").hide();
          clearInterval(x);
        }
      }, 0);

    /* END: Coming count down */

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

    /* Form Contact */
    const showLoading = () => {
      $("#loader-wrapper").show();
    };

    const hideLoading = () => {
      $("#loader-wrapper").hide();
    };

    const convertSerialize = (datasArrays) => {
      let data = {};
      datasArrays.map((x) => {
        var isArray = x.name.includes("[]");
        if (isArray) {
          var name = x.name.replace("[]", "");
          if (data[name]) {
            data[name].push(x.value.trim());
          } else {
            data[name] = [x.value.trim()];
          }
        } else {
          data[x.name] = x.value.trim();
        }
      });
      return data;
    };

    const getSerializeForm = (form) => {
      return convertSerialize($(form).serializeArray());
    };

    $(document).on("submit", ".js-form-contact", (e) => {
      e.preventDefault();
      let dataForm = getSerializeForm(".js-form-contact");
      showLoading();

      $.ajax({
        type: "POST",
        url: PV_Admin.PV_URL_AJAX,
        data: dataForm,
        dataType: "json",
      })
        .done(function (result) {
          hideLoading();
          if (result.message) {
            modal.fadeIn("slow");
            body.css("overflow", "hidden");
            $(".message").html(result.message);
            $(".modal-title").html(result.data.title_modal);
            $(".icon-box--img").attr("src", `${PV_Admin.PV_RESOURCE_HOST}/img/thankiu.gif`);
          }
          if (!result.status) {
            $(".js-form-contact")[0].reset();
          } else {
            if (result.data.focus) {
              $("[name=" + result.data.focus + "]").focus();
            }

            $(".modal-title").html(result.data.title_modal);
            $(".icon-box--img").attr("src", `${PV_Admin.PV_RESOURCE_HOST}/img/thankiu.gif`);
          }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          console.log("textStatus", textStatus);
          console.log("errorThrown", errorThrown);
          hideLoading();
        });
    });

    // Show/hide modal Contact
    var modal = $(".js-modal-contact");
    var body = $(".page-template");
    $(".close-contact").click(function () {
      modal.fadeOut("slow");
      body.css("overflow", "auto");
    });

    $(window).on("click", function (e) {
      if ($(e.target).is(modal)) {
        modal.fadeOut("slow");
        body.css("overflow", "auto");
      }
    });
    /* Form Contact */
  });
})(jQuery);
