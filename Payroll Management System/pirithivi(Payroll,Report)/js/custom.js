$(function() {
    $.scrollUp({
        scrollName: "scrollUp",
        scrollDistance: 180,
        scrollFrom: "top",
        scrollSpeed: 300,
        easingType: "linear",
        animation: "fade",
        animationSpeed: 200,
        scrollTrigger: !1,
        scrollText: '<i class="icon-anchor"></i>',
        scrollTitle: !1,
        scrollImg: !1,
        activeOverlay: !1,
        zIndex: 2147483647
    })
});
var element, circle, d, x, y;
$(".btn").click(function(a) {
    element = $(this), 0 == element.find(".circless").length && element.prepend("<span class='circless'></span>"), circle = element.find(".circless"), circle.removeClass("animate"), circle.height() || circle.width() || (d = Math.max(element.outerWidth(), element.outerHeight()), circle.css({
        height: d,
        width: d
    })), x = a.pageX - element.offset().left - circle.width() / 2, y = a.pageY - element.offset().top - circle.height() / 2, circle.css({
        top: y + "px",
        left: x + "px"
    }).addClass("animate")
}), $(function() {
    $(".loading-wrapper").fadeOut(2e3)
}), $(function() {
    $(".task-list").on("click", "li.task", function() {
        $(this).toggleClass("completed")
    })
});