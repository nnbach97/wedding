!function(i){i(function(){function s(){i("#loader-wrapper").fadeOut("1000")}function e(){i(".js-counter").each(function(){i(this).hasClass("animated")&&(i(this).prop("Counter",0).animate({Counter:i(this).attr("data-value")},{duration:2e3,easing:"swing",step:function(s){i(this).text(Math.ceil(s))}}),i(this).removeClass("animated"))})}s(),i(window).on("load",function(){s()}),(new WOW).init(),i(".js-video-bg")[0]&&i(".js-video-bg")[0].play(),i(".js-film").on("click",function(s){s.preventDefault(),i("body").toggleClass("show-film"),i("body").hasClass("show-film")?i(".js-film-video")[0].play():i(".js-film-video")[0].pause()}),i(".js-list-whys").children().each(function(s,e){0===s&&(i(e).children().first().addClass("expanded"),i(e).children().last().addClass("show"),i(e).children().last().css("display","block"))}),i(".js-outsource-toggle").click(function(s){var e=i(this);s.preventDefault(),i(".js-outsource-toggle").removeClass("expanded"),e.next().hasClass("show")?e.next().removeClass("show").slideUp(350):(i(".js-outsource-expand").removeClass("show").slideUp(350),e.next().toggleClass("show").slideToggle(350),e.toggleClass("expanded"))}),i(window).on("load",function(){e()}),i(window).on("scroll",function(){e()}),i(".js-slick-feedback").slick({dots:!0,arrows:!1,speed:1e3,autoplay:!0,autoplaySpeed:3e3,slidesToShow:1,pauseOnHover:!0,pauseOnFocus:!0}),i(".js-slick-teams").slick({dots:!0,arrows:!1,speed:3e3,autoplay:!0,autoplaySpeed:3e3,slidesToShow:5,pauseOnHover:!0,pauseOnFocus:!0,slidesToScroll:5,responsive:[{breakpoint:992,settings:{slidesToShow:4,slidesToScroll:4}},{breakpoint:769,settings:{slidesToShow:3,slidesToScroll:3}},{breakpoint:600,settings:{slidesToShow:2,slidesToScroll:2}}]});for(var o=0;o<=9;o++)!function(s){setTimeout(function(){i(".js-animated-".concat(s)).css("opacity",1)},300*s)}(o)})}(jQuery);