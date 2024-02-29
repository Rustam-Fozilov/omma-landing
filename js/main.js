$(document).ready(function () {
  $(".owl-carousel").owlCarousel({
    loop: true,
    margin: 30,
    nav: false,
    responsive: {
      0: {
        items: 1,
      },
      500: {
        items: 2,
      },
      750: {
        items: 3,
      },
      1000: {
        items: 4,
      },
    },
  });
  // scroll menu effect
  $(".menu-item").click(function (e) {
    e.preventDefault();
    var aid = $(this).attr("href");
    $("html,body").animate({ scrollTop: $(aid).offset().top }, "slow");
  });
  // activ menu select
  $(".block-id").hover(
    function () {
      var anchor = $(this).attr("id");

      $('li[href="#' + anchor + '"]').addClass("activ-menus-list");
    },
    function () {
      $("li").removeClass("activ-menus-list");
    }
  );
  // open sidebar menu
  $("#openMenu").click(function activMenu(e) {
    $(".right-sidebar").addClass("activMenu");
  });
  $("#closeMenu").click(function activMenu(e) {
    $(".right-sidebar").removeClass("activMenu");
  });

  $(".menu-item").click(function activMenu(e) {
    $(".right-sidebar").removeClass("activMenu");
  });
});
