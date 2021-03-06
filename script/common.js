/*全局变量*/
var bgColor = '#e1eff7'; //地图容器背景色
var MapColorR = '#00acc1'; //完全开发颜色
var MapColorM = '#ff7373'; //未完全开发颜色
var MapColorL = '#e5e5e5'; //未开发颜色
var titleColor = '#1e2022'; //地图标题字体颜色
var borderColor = '#333'; //地图边界颜色
var pointColor = '#2196f3'; //地图气泡颜色
var textColor = '#dcdcdc'; //地图文字颜色

// var tips = localStorage.getItem("tips"); //本地存储
// var unclickTime
//屏幕可布局高度
var height = document.documentElement.clientHeight;

var dataPath = 'https://zs.derucci.net/deruccimid/cst/';
var dataPath1 = 'https://zs.derucci.net/deruccimid/businessapp/';
var picPath = 'http://oa.derucci.net:8901/businessfile/';

//body全屏
$("#body").height(height);

//点击底部导航栏按钮
$("#bottomBtn").click(function() {
        backHome();
    })
    // $("#bottomBtn").click(function() {
    //     $(".bottomNav").show();
    //     $("#bottomBtn").hide();
    // })
$(".navBtn").click(function() {
    $(".bottomNav").hide();
    $("#bottomBtn").show();
})

//回退到首页
backHome = function() {
    var index = window.location.href;
    index = index[(index.length - 1)];
    if (index != 'l') {
        window.history.go(-(parseInt(index)));
        return false;
    }
}

//设置设备状态栏
var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
var deviceTopHeight = 0;
if (isAndroid) {
    $('.topPadding').css({
        height: 25 + 'px'
    });
    deviceTopHeight = 25;
} else if (isiOS) {
    $('.topPadding').css({
        height: 20 + 'px'
    });
    deviceTopHeight = 20;
}
//设置h2.title的top值等于设备状态栏高度
$("h2.title").css("top", deviceTopHeight - 1);
$("#main").css('padding-top', deviceTopHeight);

/*获取url相应参数*/
getQueryString = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    }
    // localStorage.setItem("tips", '');

// addTips = function() {
//     var tipsBox = '<div class="tipsBox"><div id="tips"><p>长按地图，可查看详细信息。</p><div><span></span><input name="tip" id="tip" type="checkbox" style="display: none;" /><label for="tip">不再提示</label><button>我知道了</button></div></div></div>';
//     $('body').append(tipsBox);

//     $('#tips button').click(function() {
//         var tips = $('#tips input').prop("checked");
//         if (tips == true) {
//             localStorage.setItem("tips", 'true');
//         }
//         $('.tipsBox').hide();
//     })
// }

// function Tips() {
//     if (tips != 'true') {
//         addTips();
//     }
//     // alert(tipp + typeof(tipp));
//     $('#tips input').click(function() {
//         var tips = $('#tips input').prop("checked");
//         if (tips) {
//             $('#tips span').addClass('on');
//             $('#tips input').attr('checked', 'checked');
//         } else {
//             $('#tips span').removeClass('on');
//             $('#tips input').attr('checked', '');
//         }
//     })
// }

/*水波纹*/
var addRippleEffect = function(e) {
    var target = e.target;
    if (target.tagName.toLowerCase() !== 'button') return false;
    var rect = target.getBoundingClientRect();
    var ripple = target.querySelector('.ripple');
    if (!ripple) {
        ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
        target.appendChild(ripple);
    }
    ripple.classList.remove('show');
    var top = e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop;
    var left = e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft;
    ripple.style.top = top + 'px';
    ripple.style.left = left + 'px';
    ripple.classList.add('show');
    return false;
}

document.addEventListener('click', addRippleEffect, false);

/*------获取数据------*/
function getData1(url, ajaxData) {
    var data = new Promise(function(resolve, reject) {
        $.ajax({
            type: 'post',
            url: url,
            dataType: 'jsonp',
            jsonp: "jsoncallback",
            data: ajaxData,
            success: function(data) {
                resolve(data);
            },
            error: function(data) {
                // alert('网络异常，数据获取失败。');
            }
        });
    });
    return data;
}

/*弹框*/
function MELDialog() {
    var m = {
        width: "200px",
        height: "auto",
        minHeight: "auto",
        radius: "5px",
    };
    var c = {
        mode: undefined,
        title: "温馨提示",
        okTitle: "确定",
        cancelTitle: "取消"
    };
    var f;
    var g;
    var n;
    var a;
    var l = this;
    var i;
    var d;
    var b;
    var e = function() {
        var q = $(window).width();
        var o = $(window).height();
        var p = $(window).scrollTop();
        f.css("top", p);
        f.width(q);
        f.height(o);
        n.width(q);
        n.height(o)
    };
    var h = function() {
        var p = $(window).width();
        var o = $(window).scrollTop();
        var q = $(window).scrollLeft();
        f.css({
            "top": o,
            "left": q
        });
        g.css({
            "top": a - o
        })
    };

    function k() {
        f = $("<div class='MELDialog'></div>");
        f.appendTo($("body"));
        g.appendTo(f);
        g.addClass("dia");
        n = $('<div class="mask"></div>');
        f.prepend(n);
        if (m.width != "auto") {
            g.width(m.width)
        }
        if (m.height != "auto") {
            g.height(m.height)
        }
        if (m.minHeight != "auto") {
            g.css("min-height", "150px")
        }
        g.css({
            "border": m.border,
            "border-radius": m.radius
        });
        e()
    }

    function j() {
        if (c.mode == "OkCancle") {
            var o = $('<div class="head"></div>');
            g.prepend(o);
            var q = $('<div class="MELDialogClose"></div>');
            var s = $('<p class="MELDialogTitle"></p>');
            var r = $('<div class="okcancel"><span></span></div>');
            s.text(c.title);
            o.prepend(q);
            o.append(r);
            var p = $("<div><table><tr></tr></table></div>");
            p.css({
                "position": "absolute",
                "width": "100%",
                "bottom": "0px",
                "text-align": "center",
                "font-size": "16px",
                "font-weight": "bold",
                "color": "grey"
            });
            g.append(p);
            d = $('<button style="border: none;"></button>');
            d.css({
                "color": "#4b4b4b",
                "font-weight": "bold",
                "background-color": "white",
                "font-size": "20px"
            });
            d.text(c.okTitle);
            var t = $("<td></td>");
            t.append(d);
            p.find("tr").append(t);
            i = $('<button style="border: none;"></button>');
            i.css({
                "color": "#4b4b4b",
                "font-weight": "bold",
                "background-color": "white",
                "font-size": "20px"
            });
            i.text(c.cancelTitle);
            t = $("<td></td>");
            t.append(i);
            p.find("tr").append(t);
            q.off("click").on("click", function() {
                l.close();
                if (b.cancel != undefined) {
                    b.cancel()
                }
            })
        } else {
            if (c.mode == "Ok") {
                var o = $('<div class="head"></div>');
                g.prepend(o);
                var q = $('<div class="MELDialogClose"></div>');
                var s = $('<p class="MELDialogTitle"></p>');
                var r = $('<div class="ok"><span></span></div>');
                s.text(c.title);
                o.prepend(q);
                o.append(r);
                var p = $("<div></div>");
                p.css({
                    "position": "absolute",
                    "width": "100%",
                    "bottom": "0px",
                    "text-align": "center",
                    "font-size": "16px",
                    "font-weight": "bold",
                    "padding-bottom": "15px",
                    "border": "1px solid rgba(209, 209, 209, 0.2)",
                    "border-left": "none",
                    "border-right": "none"
                });
                g.append(p);
                d = $('<button style="margin:auto;border: none;"></button>');
                d.css({
                    "color": "#4b4b4b",
                    "font-weight": "bold",
                    "background-color": "white",
                    "font-size": "20px",
                    "top": "10px",
                    "position": "relative"
                });
                d.text(c.okTitle);
                p.append(d);
                q.off("click").on("click", function() {
                    l.close();
                    if (b.ok != undefined) {
                        b.ok()
                    }
                })
            } else {
                if (c.mode == "Warn") {
                    var o = $('<div class="head"></div>');
                    g.prepend(o);
                    var q = $('<div class="MELDialogClose"></div>');
                    var s = $('<p class="MELDialogTitle"></p>');
                    var r = $('<div class="warn"><span></span></div>');
                    s.text(c.title);
                    o.prepend(q);
                    o.append(r);
                    var p = $("<div></div>");
                    p.css({
                        "position": "absolute",
                        "width": "100%",
                        "bottom": "0px",
                        "text-align": "center",
                        "font-size": "16px",
                        "font-weight": "bold",
                        "padding-bottom": "15px",
                        "border": "1px solid rgba(209, 209, 209, 0.2)",
                        "border-left": "none",
                        "border-right": "none"
                    });
                    g.append(p);
                    d = $('<button style="margin:auto;border: none;"></button>');
                    d.css({
                        "color": "#4b4b4b",
                        "font-weight": "bold",
                        "background-color": "white",
                        "font-size": "20px",
                        "top": "10px",
                        "position": "relative"
                    });
                    d.text(c.okTitle);
                    p.append(d);
                    q.off("click").on("click", function() {
                        l.close();
                        if (b.ok != undefined) {
                            b.ok()
                        }
                    })
                }
            }
        }
    }
    this.init = function(q, p, o) {
        if (p != undefined) {
            $.extend(m, p)
        }
        g = q;
        if (o != undefined) {
            $.extend(c, o);
            j()
        }
        k();
        return this
    };
    this.open = function(t) {
        b = t;
        g.css({
            "top": 0
        });
        e();
        f.show();
        var s = $(window).width();
        var o = $(window).height();
        var q = $(window).scrollTop();
        var p = g.width();
        var r = g.height();
        if (r > o) {
            a = 20
        } else {
            a = (o - r) / 2
        }
        g.css({
            "left": (s - p) / 2,
            "top": a
        });
        a = q + a;
        window.addEventListener("resize", e, false);
        window.addEventListener("scroll", h, false);
        if (b != undefined) {
            if (c.mode == "OkCancle") {
                i.off("click").on("click", function() {
                    if ((b != undefined) && (b.cancel != undefined)) {
                        b.cancel()
                    }
                    l.close()
                });
                d.off("click").on("click", function() {
                    if ((b != undefined) && (b.ok != undefined)) {
                        b.ok()
                    }
                    l.close()
                })
            } else {
                if (c.mode == "Ok") {
                    d.off("click").on("click", function() {
                        if ((b != undefined) && (b.ok != undefined)) {
                            b.ok()
                        }
                        l.close()
                    })
                } else {
                    if (c.mode == "Warn") {
                        d.off("click").on("click", function() {
                            if ((b != undefined) && (b.ok != undefined)) {
                                b.ok()
                            }
                            l.close()
                        })
                    }
                }
            }
        }
        return this
    };
    this.close = function() {
        window.removeEventListener("resize", e, false);
        window.removeEventListener("scroll", h, false);
        f.hide();
        return this
    }
}

function MELDialog() {
    var m = {
        width: "200px",
        height: "auto",
        minHeight: "auto",
        radius: "5px",
    };
    var c = {
        mode: undefined,
        title: "温馨提示",
        okTitle: "确定",
        cancelTitle: "取消"
    };
    var f;
    var g;
    var n;
    var a;
    var l = this;
    var i;
    var d;
    var b;
    var e = function() {
        var q = $(window).width();
        var o = $(window).height();
        var p = $(window).scrollTop();
        f.css("top", p);
        f.width(q);
        f.height(o);
        n.width(q);
        n.height(o)
    };
    var h = function() {
        var p = $(window).width();
        var o = $(window).scrollTop();
        var q = $(window).scrollLeft();
        f.css({
            "top": o,
            "left": q
        });
        g.css({
            "top": a - o
        })
    };

    function k() {
        f = $("<div class='MELDialog'></div>");
        f.appendTo($("body"));
        g.appendTo(f);
        g.addClass("dia");
        n = $('<div class="mask"></div>');
        f.prepend(n);
        if (m.width != "auto") {
            g.width(m.width)
        }
        if (m.height != "auto") {
            g.height(m.height)
        }
        if (m.minHeight != "auto") {
            g.css("min-height", "150px")
        }
        g.css({
            "border": m.border,
            "border-radius": m.radius
        });
        e()
    }

    function j() {
        if (c.mode == "OkCancle") {
            var o = $('<div class="head"></div>');
            g.prepend(o);
            var q = $('<div class="MELDialogClose"></div>');
            var s = $('<p class="MELDialogTitle"></p>');
            var r = $('<div class="okcancel"><span></span></div>');
            s.text(c.title);
            o.prepend(q);
            o.append(r);
            var p = $("<div><table><tr></tr></table></div>");
            p.css({
                "position": "absolute",
                "width": "100%",
                "bottom": "0px",
                "text-align": "center",
                "font-size": "16px",
                "font-weight": "bold",
                "color": "grey"
            });
            g.append(p);
            d = $('<button style="border: none;"></button>');
            d.css({
                "color": "#4b4b4b",
                "font-weight": "bold",
                "background-color": "white",
                "font-size": "20px"
            });
            d.text(c.okTitle);
            var t = $("<td></td>");
            t.append(d);
            p.find("tr").append(t);
            i = $('<button style="border: none;"></button>');
            i.css({
                "color": "#4b4b4b",
                "font-weight": "bold",
                "background-color": "white",
                "font-size": "20px"
            });
            i.text(c.cancelTitle);
            t = $("<td></td>");
            t.append(i);
            p.find("tr").append(t);
            q.off("click").on("click", function() {
                l.close();
                if (b.cancel != undefined) {
                    b.cancel()
                }
            })
        } else {
            if (c.mode == "Ok") {
                var o = $('<div class="head"></div>');
                g.prepend(o);
                var q = $('<div class="MELDialogClose"></div>');
                var s = $('<p class="MELDialogTitle"></p>');
                var r = $('<div class="ok"><span></span></div>');
                s.text(c.title);
                o.prepend(q);
                o.append(r);
                var p = $("<div></div>");
                p.css({
                    "position": "absolute",
                    "width": "100%",
                    "bottom": "0px",
                    "text-align": "center",
                    "font-size": "16px",
                    "font-weight": "bold",
                    "padding-bottom": "15px",
                    "border": "1px solid rgba(209, 209, 209, 0.2)",
                    "border-left": "none",
                    "border-right": "none"
                });
                g.append(p);
                d = $('<button style="margin:auto;border: none;"></button>');
                d.css({
                    "color": "#4b4b4b",
                    "font-weight": "bold",
                    "background-color": "white",
                    "font-size": "20px",
                    "top": "10px",
                    "position": "relative"
                });
                d.text(c.okTitle);
                p.append(d);
                q.off("click").on("click", function() {
                    l.close();
                    if (b.ok != undefined) {
                        b.ok()
                    }
                })
            } else {
                if (c.mode == "Warn") {
                    var o = $('<div class="head"></div>');
                    g.prepend(o);
                    var q = $('<div class="MELDialogClose"></div>');
                    var s = $('<p class="MELDialogTitle"></p>');
                    var r = $('<div class="warn"><span></span></div>');
                    s.text(c.title);
                    o.prepend(q);
                    o.append(r);
                    var p = $("<div></div>");
                    p.css({
                        "position": "absolute",
                        "width": "100%",
                        "bottom": "0px",
                        "text-align": "center",
                        "font-size": "16px",
                        "font-weight": "bold",
                        "padding-bottom": "15px",
                        "border": "1px solid rgba(209, 209, 209, 0.2)",
                        "border-left": "none",
                        "border-right": "none"
                    });
                    g.append(p);
                    d = $('<button style="margin:auto;border: none;"></button>');
                    d.css({
                        "color": "#4b4b4b",
                        "font-weight": "bold",
                        "background-color": "white",
                        "font-size": "20px",
                        "top": "10px",
                        "position": "relative"
                    });
                    d.text(c.okTitle);
                    p.append(d);
                    q.off("click").on("click", function() {
                        l.close();
                        if (b.ok != undefined) {
                            b.ok()
                        }
                    })
                }
            }
        }
    }
    this.init = function(q, p, o) {
        if (p != undefined) {
            $.extend(m, p)
        }
        g = q;
        if (o != undefined) {
            $.extend(c, o);
            j()
        }
        k();
        return this
    };
    this.open = function(t) {
        b = t;
        g.css({
            "top": 0
        });
        e();
        f.show();
        var s = $(window).width();
        var o = $(window).height();
        var q = $(window).scrollTop();
        var p = g.width();
        var r = g.height();
        if (r > o) {
            a = 20
        } else {
            a = (o - r) / 2
        }
        g.css({
            "left": (s - p) / 2,
            "top": a
        });
        a = q + a;
        window.addEventListener("resize", e, false);
        window.addEventListener("scroll", h, false);
        if (b != undefined) {
            if (c.mode == "OkCancle") {
                i.off("click").on("click", function() {
                    if ((b != undefined) && (b.cancel != undefined)) {
                        b.cancel()
                    }
                    l.close()
                });
                d.off("click").on("click", function() {
                    if ((b != undefined) && (b.ok != undefined)) {
                        b.ok()
                    }
                    l.close()
                })
            } else {
                if (c.mode == "Ok") {
                    d.off("click").on("click", function() {
                        if ((b != undefined) && (b.ok != undefined)) {
                            b.ok()
                        }
                        l.close()
                    })
                } else {
                    if (c.mode == "Warn") {
                        d.off("click").on("click", function() {
                            if ((b != undefined) && (b.ok != undefined)) {
                                b.ok()
                            }
                            l.close()
                        })
                    }
                }
            }
        }
        return this
    };
    this.close = function() {
        window.removeEventListener("resize", e, false);
        window.removeEventListener("scroll", h, false);
        f.hide();
        return this
    }
}
MELDialog.prototype = {
    openOk: function(c, a) {
        var e = $("<div></div>");
        $("body").append(e);
        if (c != undefined) {
            var d = $("<p>" + c + "</p>").css({
                "margin": "40px",
                "text-align": "center",
                "font-size": "16px",
                "font-weight": "bold",
                "color": "grey"
            });
            e.append(d)
        }
        var b = new MELDialog().init(e, {
            width: "90%",
            minHeight: "280px"
        }, {
            mode: "Ok"
        });
        e.parent().addClass("okdialog");
        b.open({
            ok: function() {
                e.parent().remove();
                if ((a != undefined) && (a.ok != undefined)) {
                    a.ok()
                }
            },
            cancel: function() {
                e.parent().remove();
                if ((a != undefined) && (a.ok != undefined)) {
                    a.ok()
                }
            }
        })
    },
    openWarn: function(c, a) {
        var e = $("<div></div>");
        $("body").append(e);
        if (c != undefined) {
            var d = $("<p>" + c + "</p>").css({
                "margin": "40px",
                "text-align": "center",
                "font-size": "16px",
                "font-weight": "bold",
                "color": "grey"
            });
            e.append(d)
        }
        var b = new MELDialog().init(e, {
            width: "90%",
            minHeight: "280px"
        }, {
            mode: "Warn"
        });
        e.parent().addClass("warndialog");
        b.open({
            ok: function() {
                e.parent().remove();
                if ((a != undefined) && (a.ok != undefined)) {
                    a.ok()
                }
            },
            cancel: function() {
                e.parent().remove();
                if ((a != undefined) && (a.ok != undefined)) {
                    a.ok()
                }
            }
        })
    },
    openOkCancle: function(c, a) {
        var e = $("<div></div>");
        $("body").append(e);
        if (c != undefined) {
            var d = $("<p>" + c + "</p>").css({
                "margin": "40px",
                "text-align": "center",
                "font-size": "16px",
                "font-weight": "bold",
                "color": "grey"
            });
            e.append(d)
        }
        var b = new MELDialog().init(e, {
            width: "90%",
            minHeight: "280px"
        }, {
            mode: "OkCancle"
        });
        e.parent().addClass("okcanceldialog");
        b.open({
            ok: function() {
                e.parent().remove();
                if ((a != undefined) && (a.ok != undefined)) {
                    a.ok()
                }
            },
            cancel: function() {
                e.parent().remove();
                if ((a != undefined) && (a.cancel != undefined)) {
                    a.cancel()
                }
            }
        })
    },
    openPrompt: function(d, b) {
        var f = $("<div></div>");
        $("body").append(f);
        if (d != undefined) {
            var e = $("<p>" + d + "(<span>0</span>/100)</p>").css({
                "margin": "20px 0px 0px 16px",
                "text-align": "left",
                "font-size": "100%"
            });
            f.append(e)
        }
        var a = $('<div class="textarea"><textarea></textarea></div>');
        f.append(a);
        a.find("textarea").on("input propertychange", function() {
            var g = $(this).val().length;
            if (g > 100) {
                g = 100
            }
            f.find("p span").text(g);
            var h = $(this).val().substring(0, g);
            $(this).val(h)
        });
        var c = new MELDialog().init(f, {
            width: "90%",
            minHeight: "300px"
        }, {
            mode: "OkCancle"
        });
        f.parent().addClass("openPrompt");
        c.open({
            ok: function() {
                f.parent().remove();
                if ((b != undefined) && (b.ok != undefined)) {
                    b.ok(a.find("textarea").val())
                }
            },
            cancel: function() {
                f.parent().remove();
                if ((b != undefined) && (b.cancel != undefined)) {
                    b.cancel()
                }
            }
        })
    },
    openText: function(d, a) {
        var f = $("<div></div>");
        $("body").append(f);
        var b = $('<div class="inside"></div>');
        if (d != undefined) {
            var e = $("<p></p>");
            b.append(e);
            f.append(b);
            e.text(d)
        }
        var c = new MELDialog().init(f, {
            width: "90%",
            minHeight: "80%"
        }, {
            mode: "Ok"
        });
        f.parent().addClass("openText");
        c.open({
            ok: function() {
                f.parent().remove();
                if ((a != undefined) && (a.ok != undefined)) {
                    a.ok()
                }
            },
            cancel: function() {
                f.parent().remove();
                if ((a != undefined) && (a.cancel != undefined)) {
                    a.cancel()
                }
            }
        })
    },
    openScrollImg: function(c, e) {
        var d = $('<div class="num"><span></span><span></span></div>');
        var a = $("<div><ul></ul></div>");
        $("body").append(a);
        a.append(d);
        a.on("click", "li,img", function() {
            h.close();
            a.parent().remove()
        });
        var g = a.find("ul");
        d.find("span").eq(1).text("/" + c.length);
        d.find("span").eq(0).text(1);
        for (var b = 0; b < c.length; b++) {
            var k = $("<li><img></img></li>");
            k.find("img").attr("src", c[b]);
            g.append(k)
        }
        var j = $(window).width();
        g.width(c.length * j);
        g.find("li").width(j);
        var f = new iScroll(a[0], {
            snap: true,
            hScrollbar: false,
            vScrollbar: false,
            momentum: false,
            bounce: false,
            zoom: true,
            onScrollEnd: function() {
                d.find("span").eq(0).text(this.currPageX + 1)
            }
        });
        if (e != undefined) {
            f.scrollToPage(e, e, 1)
        }
        var h = new MELDialog().init(a);
        a.parent().addClass("openScrollImg");
        h.open()
    },
    openBinding: function(wxUser) {
        exitCookie();
        var f = $("<div style='position: fixed;top: 0;width: 100%;height: 100%;background-color: black;opacity: 0.6;z-index: 1000;'></div>");
        $("body").append(f);
        var tip = "<div class='tip' style='position: fixed;background-color: white;width: 80%;height: 58%;border-radius: 6px;top: 21%;left: 10%;z-index: 2000;'>";
        tip += '<div class="sms" style="position:relative">';
        tip += '<div class="closeSms" style="cursor:point;width:25px;height:25px;border-radius:50%;background-color:gray;line-height:25px;text-align:center;color:white;float:right;position: absolute;top: -25px;right: 7px;">Ｘ</div>';
        tip += '<p style="margin-left: 10%;margin-top:30px;color: #949494;    font-size: 15px;line-height: 32px;height: 32px;">请输入您的常用手机号</p>';
        tip += '<div class="phone_form">';
        tip += '<input type="text" class="phone" value="' + phone + '"/>';
        tip += '<a class="getCode" style="margin:0;position: absolute;top: 40px;right: 3%;width: 100px!important;height: 32px!important; background-color: #FF971C;color: white;border: 1px solid #FF971C;border-radius: 3px!important;font-size: 14px;text-align: center;line-height: 32px;">' + text + "</a>";
        tip += "</div>";
        tip += '<p style=" margin-left: 10px;color: rgb(21, 19, 19);font-size: 15px;line-height: 32px;height: 32px;"><span style="color:red;    font-size: 15px;line-height: 32px;height: 32px;" class="phone_error"></span></p>';
        tip += '<p style="margin-left: 10%;margin-top:30px;color: #949494;font-size: 15px;line-height: 32px;height: 32px;">请输入您收到的4位数验证码</p>';
        tip += '<div class="code_form">';
        tip += '<input type="text" class="identifyingCode" />';
        tip += '<a class="ok" style="margin:0;position: absolute;top: 183px;right: 3%;width: 100px!important;height: 32px!important; background-color: #FF971C;color: white;border: 1px solid #FF971C;border-radius: 3px!important;font-size: 14px;text-align: center;line-height: 32px;">验&nbsp;证</a>';
        tip += "</div>";
        tip += '<p><span style="color:red" class="code_error"></span></p>';
        tip += "</div>";
        tip += "</div>";
        $("body").append($(tip));
        $(".closeSms").click(function() {
            f.remove();
            $(".tip").remove()
        });
        var myClick = function(obj, callback) {
            $(obj).click(function() {
                if ($(this).attr("isClick") == null || $(this).attr("isClick") == "") {
                    $(this).attr("isClick", "clicked");
                    callback(this)
                }
            })
        };
        myClick(".getCode", function(obj) {
            if ($(".getCode").html() != "获取验证码") {
                $(obj).attr("isClick", "");
                return
            }
            if ($(".phone_form .phone").val() != "") {
                var patrn = /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
                if (patrn.test($(".phone_form .phone").val())) {
                    var http = Common.homeurl + "Iphone/sms_wx_registe.jsp";
                    phone = $(".phone_form .phone").val();
                    Common.jsonp(http, {
                        "phone": phone
                    }, function(json) {
                        if (json.status == "error") {
                            $(".phone_error").html("提示:发送出错!")
                        } else {
                            $(".phone_error").html("");
                            Common.setCookie("phone", phone);
                            Common.setCookie("codeTime", new Date().getTime());
                            timer = setInterval(function() {
                                if (reg_time == 0) {
                                    $(".getCode").html("获取验证码");
                                    reg_time = 120;
                                    clearInterval(timer);
                                    Common.setCookie("codeTime", "");
                                    $(obj).attr("isClick", "")
                                } else {
                                    $(".getCode").html("重新发送(" + reg_time + ")");
                                    reg_time--
                                }
                            }, 1000)
                        }
                    })
                } else {
                    $(".phone_error").html("提示:手机号码格式不正确!");
                    $(obj).attr("isClick", "")
                }
            } else {
                $(".phone_error").html("提示:请输入手机号码!");
                $(obj).attr("isClick", "")
            }
        });
        myClick(".ok", function(obj) {
            if (phone == null) {
                $(".code_error").html("提示:请输入手机号码!");
                $(obj).attr("isClick", "");
                return
            }
            var patrn = /^[0-9]{4}$/;
            if ($(".identifyingCode").val() == "") {
                $(".code_error").html("提示:请输入验证码!");
                $(obj).attr("isClick", "");
                return
            }
            if (!patrn.test($(".identifyingCode").val())) {
                $(".code_error").html("提示:验证码格式不正确!");
                $(obj).attr("isClick", "");
                return
            }
            var data = {
                "phone": phone,
                "userScore": $(".identifyingCode").val(),
                "shopsid": Common.getQueryString("shopsid"),
                "openid": wxUser.key,
                "nickName": wxUser.nickName,
                "sex": wxUser.sex,
                "headImg": wxUser.headImg,
                "distributionUserId": Common.getQueryString("distributionUserId")
            };
            Common.jsonp(Common.homeurl + "wxUserBinding!binding.action", data, function(json) {
                if (json.status == "codeError") {
                    $(".code_error").html("提示:验证错误!")
                } else {
                    if (json.status == "error") {
                        $(".code_error").html("提示:绑定出错!")
                    } else {
                        f.remove();
                        $(".tip").remove();
                        new MELDialog().openOk("绑定成功!", {
                            ok: function() {
                                location = location
                            }
                        })
                    }
                }
                $(obj).attr("isClick", "")
            })
        })
    }
};

// 中国主要城市列表
var cityMap = {
    "北京市": "110100",
    "天津市": "120100",
    "上海市": "310100",
    "重庆市": "500100",
    "崇明县": "310200", // ??
    "湖北省直辖县市": "429000", // ??
    "铜仁市": "522200", // ??
    "毕节市": "522400", // ??
    "石家庄市": "130100",
    "唐山市": "130200",
    "秦皇岛市": "130300",
    "邯郸市": "130400",
    "邢台市": "130500",
    "保定市": "130600",
    "张家口市": "130700",
    "承德市": "130800",
    "沧州市": "130900",
    "廊坊市": "131000",
    "衡水市": "131100",
    "太原市": "140100",
    "大同市": "140200",
    "阳泉市": "140300",
    "长治市": "140400",
    "晋城市": "140500",
    "朔州市": "140600",
    "晋中市": "140700",
    "运城市": "140800",
    "忻州市": "140900",
    "临汾市": "141000",
    "吕梁市": "141100",
    "呼和浩特市": "150100",
    "包头市": "150200",
    "乌海市": "150300",
    "赤峰市": "150400",
    "通辽市": "150500",
    "鄂尔多斯市": "150600",
    "呼伦贝尔市": "150700",
    "巴彦淖尔市": "150800",
    "乌兰察布市": "150900",
    "兴安盟": "152200",
    "锡林郭勒盟": "152500",
    "阿拉善盟": "152900",
    "沈阳市": "210100",
    "大连市": "210200",
    "鞍山市": "210300",
    "抚顺市": "210400",
    "本溪市": "210500",
    "丹东市": "210600",
    "锦州市": "210700",
    "营口市": "210800",
    "阜新市": "210900",
    "辽阳市": "211000",
    "盘锦市": "211100",
    "铁岭市": "211200",
    "朝阳市": "211300",
    "葫芦岛市": "211400",
    "长春市": "220100",
    "吉林市": "220200",
    "四平市": "220300",
    "辽源市": "220400",
    "通化市": "220500",
    "白山市": "220600",
    "松原市": "220700",
    "白城市": "220800",
    "延边朝鲜族自治州": "222400",
    "哈尔滨市": "230100",
    "齐齐哈尔市": "230200",
    "鸡西市": "230300",
    "鹤岗市": "230400",
    "双鸭山市": "230500",
    "大庆市": "230600",
    "伊春市": "230700",
    "佳木斯市": "230800",
    "七台河市": "230900",
    "牡丹江市": "231000",
    "黑河市": "231100",
    "绥化市": "231200",
    "大兴安岭地区": "232700",
    "南京市": "320100",
    "无锡市": "320200",
    "徐州市": "320300",
    "常州市": "320400",
    "苏州市": "320500",
    "南通市": "320600",
    "连云港市": "320700",
    "淮安市": "320800",
    "盐城市": "320900",
    "扬州市": "321000",
    "镇江市": "321100",
    "泰州市": "321200",
    "宿迁市": "321300",
    "杭州市": "330100",
    "宁波市": "330200",
    "温州市": "330300",
    "嘉兴市": "330400",
    "湖州市": "330500",
    "绍兴市": "330600",
    "金华市": "330700",
    "衢州市": "330800",
    "舟山市": "330900",
    "台州市": "331000",
    "丽水市": "331100",
    "合肥市": "340100",
    "芜湖市": "340200",
    "蚌埠市": "340300",
    "淮南市": "340400",
    "马鞍山市": "340500",
    "淮北市": "340600",
    "铜陵市": "340700",
    "安庆市": "340800",
    "黄山市": "341000",
    "滁州市": "341100",
    "阜阳市": "341200",
    "宿州市": "341300",
    "六安市": "341500",
    "亳州市": "341600",
    "池州市": "341700",
    "宣城市": "341800",
    "福州市": "350100",
    "厦门市": "350200",
    "莆田市": "350300",
    "三明市": "350400",
    "泉州市": "350500",
    "漳州市": "350600",
    "南平市": "350700",
    "龙岩市": "350800",
    "宁德市": "350900",
    "南昌市": "360100",
    "景德镇市": "360200",
    "萍乡市": "360300",
    "九江市": "360400",
    "新余市": "360500",
    "鹰潭市": "360600",
    "赣州市": "360700",
    "吉安市": "360800",
    "宜春市": "360900",
    "抚州市": "361000",
    "上饶市": "361100",
    "济南市": "370100",
    "青岛市": "370200",
    "淄博市": "370300",
    "枣庄市": "370400",
    "东营市": "370500",
    "烟台市": "370600",
    "潍坊市": "370700",
    "济宁市": "370800",
    "泰安市": "370900",
    "威海市": "371000",
    "日照市": "371100",
    "莱芜市": "371200",
    "临沂市": "371300",
    "德州市": "371400",
    "聊城市": "371500",
    "滨州市": "371600",
    "菏泽市": "371700",
    "郑州市": "410100",
    "开封市": "410200",
    "洛阳市": "410300",
    "平顶山市": "410400",
    "安阳市": "410500",
    "鹤壁市": "410600",
    "新乡市": "410700",
    "焦作市": "410800",
    "濮阳市": "410900",
    "许昌市": "411000",
    "漯河市": "411100",
    "三门峡市": "411200",
    "南阳市": "411300",
    "商丘市": "411400",
    "信阳市": "411500",
    "周口市": "411600",
    "驻马店市": "411700",
    "省直辖县级行政区划": "469000",
    "武汉市": "420100",
    "黄石市": "420200",
    "十堰市": "420300",
    "宜昌市": "420500",
    "襄阳市": "420600",
    "鄂州市": "420700",
    "荆门市": "420800",
    "孝感市": "420900",
    "荆州市": "421000",
    "黄冈市": "421100",
    "咸宁市": "421200",
    "随州市": "421300",
    "恩施土家族苗族自治州": "422800",
    "长沙市": "430100",
    "株洲市": "430200",
    "湘潭市": "430300",
    "衡阳市": "430400",
    "邵阳市": "430500",
    "岳阳市": "430600",
    "常德市": "430700",
    "张家界市": "430800",
    "益阳市": "430900",
    "郴州市": "431000",
    "永州市": "431100",
    "怀化市": "431200",
    "娄底市": "431300",
    "湘西土家族苗族自治州": "433100",
    "广州市": "440100",
    "韶关市": "440200",
    "深圳市": "440300",
    "珠海市": "440400",
    "汕头市": "440500",
    "佛山市": "440600",
    "江门市": "440700",
    "湛江市": "440800",
    "茂名市": "440900",
    "肇庆市": "441200",
    "惠州市": "441300",
    "梅州市": "441400",
    "汕尾市": "441500",
    "河源市": "441600",
    "阳江市": "441700",
    "清远市": "441800",
    "东莞市": "441900",
    "中山市": "442000",
    "潮州市": "445100",
    "揭阳市": "445200",
    "云浮市": "445300",
    "南宁市": "450100",
    "柳州市": "450200",
    "桂林市": "450300",
    "梧州市": "450400",
    "北海市": "450500",
    "防城港市": "450600",
    "钦州市": "450700",
    "贵港市": "450800",
    "玉林市": "450900",
    "百色市": "451000",
    "贺州市": "451100",
    "河池市": "451200",
    "来宾市": "451300",
    "崇左市": "451400",
    "海口市": "460100",
    "三亚市": "460200",
    "三沙市": "460300",
    "成都市": "510100",
    "自贡市": "510300",
    "攀枝花市": "510400",
    "泸州市": "510500",
    "德阳市": "510600",
    "绵阳市": "510700",
    "广元市": "510800",
    "遂宁市": "510900",
    "内江市": "511000",
    "乐山市": "511100",
    "南充市": "511300",
    "眉山市": "511400",
    "宜宾市": "511500",
    "广安市": "511600",
    "达州市": "511700",
    "雅安市": "511800",
    "巴中市": "511900",
    "资阳市": "512000",
    "阿坝藏族羌族自治州": "513200",
    "甘孜藏族自治州": "513300",
    "凉山彝族自治州": "513400",
    "贵阳市": "520100",
    "六盘水市": "520200",
    "遵义市": "520300",
    "安顺市": "520400",
    "黔西南布依族苗族自治州": "522300",
    "黔东南苗族侗族自治州": "522600",
    "黔南布依族苗族自治州": "522700",
    "昆明市": "530100",
    "曲靖市": "530300",
    "玉溪市": "530400",
    "保山市": "530500",
    "昭通市": "530600",
    "丽江市": "530700",
    "普洱市": "530800",
    "临沧市": "530900",
    "楚雄彝族自治州": "532300",
    "红河哈尼族彝族自治州": "532500",
    "文山壮族苗族自治州": "532600",
    "西双版纳傣族自治州": "532800",
    "大理白族自治州": "532900",
    "德宏傣族景颇族自治州": "533100",
    "怒江傈僳族自治州": "533300",
    "迪庆藏族自治州": "533400",
    "拉萨市": "540100",
    "昌都地区": "542100",
    "山南地区": "542200",
    "日喀则地区": "542300",
    "那曲地区": "542400",
    "阿里地区": "542500",
    "林芝地区": "542600",
    "西安市": "610100",
    "铜川市": "610200",
    "宝鸡市": "610300",
    "咸阳市": "610400",
    "渭南市": "610500",
    "延安市": "610600",
    "汉中市": "610700",
    "榆林市": "610800",
    "安康市": "610900",
    "商洛市": "611000",
    "兰州市": "620100",
    "嘉峪关市": "620200",
    "金昌市": "620300",
    "白银市": "620400",
    "天水市": "620500",
    "武威市": "620600",
    "张掖市": "620700",
    "平凉市": "620800",
    "酒泉市": "620900",
    "庆阳市": "621000",
    "定西市": "621100",
    "陇南市": "621200",
    "临夏回族自治州": "622900",
    "甘南藏族自治州": "623000",
    "西宁市": "630100",
    "海东地区": "632100",
    "海北藏族自治州": "632200",
    "黄南藏族自治州": "632300",
    "海南藏族自治州": "632500",
    "果洛藏族自治州": "632600",
    "玉树藏族自治州": "632700",
    "海西蒙古族藏族自治州": "632800",
    "银川市": "640100",
    "石嘴山市": "640200",
    "吴忠市": "640300",
    "固原市": "640400",
    "中卫市": "640500",
    "乌鲁木齐市": "650100",
    "克拉玛依市": "650200",
    "吐鲁番地区": "652100",
    "哈密地区": "652200",
    "昌吉回族自治州": "652300",
    "博尔塔拉蒙古自治州": "652700",
    "巴音郭楞蒙古自治州": "652800",
    "阿克苏地区": "652900",
    "克孜勒苏柯尔克孜自治州": "653000",
    "喀什地区": "653100",
    "和田地区": "653200",
    "伊犁哈萨克自治州": "654000",
    "塔城地区": "654200",
    "阿勒泰地区": "654300",
    "自治区直辖县级行政区划": "659000",
    "台湾省": "710000",
    "香港特别行政区": "810100",
    "澳门特别行政区": "820000"
};