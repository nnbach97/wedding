(function ($) {
  $(function () {
    function showMoreSearch(showMoreEl, listItemEl) {
      const showMore = $(showMoreEl);
      const listItem = $(`${listItemEl} > li`);
      const showTxt = showMore.data("show");
      const hideTxt = showMore.data("hide");

      showMore.html(showTxt);

      listItem.each(function (index, element) {
        if (index > 4 && index < listItem.length - 1) {
          $(element).addClass("unactive");
        }
      });

      showMore.on("click", function (event) {
        event.preventDefault();

        listItem.each(function (index, element) {
          if (index > 4 && index < listItem.length - 1) {
            if ($(element).hasClass("unactive")) {
              $(element).removeClass("unactive");
              showMore.html(hideTxt);
            } else {
              $(element).addClass("unactive");
              showMore.html(showTxt);
            }
          }
        });
      });
    };

    showMoreSearch(".js-show-more-category", ".js-list-category");
    showMoreSearch(".js-show-more-tag", ".js-list-work-tag");

    $(".js-itemCap").on("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      const itemCheck = $(this).siblings(".js-itemCheck");
      $(".js-itemCap").not(this).siblings(".js-itemCheck").slideUp().removeClass("active");
      if (itemCheck.hasClass("active")) {
        itemCheck.slideUp().removeClass("active");
      } else {
        itemCheck.slideDown().addClass("active");
      }
    });

    $(".js-itemCheck").on("click", function (event) {
      event.stopPropagation();
    });

    $(document).on("click", function (event) {
      if ($(".js-itemCheck").hasClass("active")) {
        $(".js-itemCheck").slideUp().removeClass("active");
      }
    });
  });
})(jQuery);
