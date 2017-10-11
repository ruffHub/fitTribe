$(document).ready(function () {
    $(".humburger-menu-btn").on("click", function () {
        if ( $("header nav").css("display") === "none") {
            $("header nav").fadeIn(600);
        } else {
            $("header nav").fadeOut(300);
        }
    });
});