(function ($) {
  const showLoading = () => {
    $(".js-loading").css({ display: "flex" });
  };

  const hideLoading = () => {
    $(".js-loading").hide();
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

  $(function () {
    var checkboxes = $(".js-checkbox");
    checkboxes.change(function () {
      if ($(".form-check-input:checked").length > 0) {
        checkboxes.removeAttr("required");
      } else {
        checkboxes.attr("required", "required");
      }
    });

    $(document).on("submit", ".js-form-contact", (e) => {
      e.preventDefault();
      let dataForm = getSerializeForm(".js-form-contact");
      const $this = $(this);
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
            $(".icon-box").css("background", "#14479c");
            $(".close-contact--btn").css("background", "#14479c");
            $(".icon-box--img").attr("src", `${PV_Admin.PV_RESOURCE_HOST}/img/thankiu.gif`);
          }
          if (!result.status) {
            $(".js-form-contact")[0].reset();
            d = new Date();
            $(".js-img-captcha").attr("src", `${PV_Admin.PV_RESOURCE_HOST}/captcha.php?` + d.getTime());
          } else {
            if (result.data.focus) {
              $("[name=" + result.data.focus + "]").focus();
            }

            $(".icon-box").css("background", "#d63143");
            $(".close-contact--btn").css("background", "#d63143");
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
  });
})(jQuery);
