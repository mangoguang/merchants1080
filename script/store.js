$(document).ready(function() {
    var height = document.documentElement.clientHeight;
    //设置title的top值等于设备状态栏高度
    $(".header").css('margin-top', deviceTopHeight);

    //获取URL参数
    var storeName = decodeURIComponent(window.location.search.substr(11));
    storeName = storeName.split("&", 1);
    $(".storeName").html(storeName);

    $(".swiper-slide>img").click(function() {
        var src = $(this).attr('src');
        var img = '<div class="imgBox"><div class="img"><img src=' + src + '></div></div>';
        $('body').append(img);
        $('.imgBox').css('height', height);
        $('.imgBox').click(function() {
            $(this).hide();
        })
    })
    stateH();
    swiperSlide();

})

function stateH() {
    var topPaddingH = $('.topPadding').height();
    $('.topPadding').css({
        height: topPaddingH
    });

    $(".storeImgArea").css("margin-top", topPaddingH + 45 + 'px');
}

function swiperSlide() {
    var mySwiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        autoplay: 3000
    })
}