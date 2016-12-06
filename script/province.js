var height = document.documentElement.clientHeight;
var danpin = 0; //初始化单品店数
var zonghe = 0; //初始化综合店数

//获取URL参数
var provinceName = decodeURIComponent(window.location.search.substr(6));
provinceName = provinceName.split("&", 1).toString(); //省份中文名

//初始化地图设置
if (provinceName == '海南') {
  var geoTop = 2600;
  var geoL = 1600;
  var geoZoom = 8;
} else {
  var geoTop = 80;
  var geoL = 300;
  var geoZoom = 1.1;
}


$(document).ready(function() {
  $(".deviceHeight").css("height", height - deviceTopHeight);
  $("h2.title").html('<span onclick="javascript :history.back(-1);"></span>' + provinceName + '加盟商');
  //id省份拼音名称
  var id = getQueryString("id");
  setData(id);
});

//招商经理名片数据初始化
managerMsg = function() {
  var ajaxData = {
    country: '中国'
  };

  getData1(dataPath + "managerbyinfo", ajaxData).then(function(arr) {
    for (var i = 0; i < arr.length; i++) {
      var citys = arr[i].city;
      var cityList = citys.split(',');
      if (cityList.indexOf(provinceName) >= 0) {
        var msg = arr[i];
        $('.name').text(msg.name);
        $('.area').text(msg.area);
        $('.provinces').text(msg.city);
        $('.phone').text(msg.phone);
      }
    }
  })
}
managerMsg();

setData = function(id) {
  /*载入中国主要城市地图*/
  var ajaxData = {
    country: '中国',
    province: provinceName
  };
  getData1(dataPath + "distributeinfo", ajaxData).then(function(arr) {
    console.log(arr);
    var data = [];
    var storeNames = [];
    var jingdus = [];
    var weidus = [];
    var types = [];


    //获取各城市品牌信息
    var Brands = [];
    var Citys = [];
    for (var i = 0; i < arr.length; i++) {
      Brands.push(arr[i].brands);
      Citys.push(arr[i].cityName);
    }


    for (var i = 0; i < arr.length; i++) {
      if (arr[i].allDevStatus) {
        var obj = { //obj为城市对象数组123123
          name: arr[i].cityName,
          value: 3
        };
      } else {
        var obj = { //obj为城市对象数组
          name: arr[i].cityName,
          value: 1
        };
      }

      data.push(obj);

      var stores = arr[i].stores;
      for (var j = 0; j < stores.length; j++) {
        storeNames.push(stores[j].storeName);
        jingdus.push(stores[j].jingdu);
        weidus.push(stores[j].weidu);
        types.push(stores[j].type);
      }
    }


    //定义series数组
    var series = new Array();
    for (var i = 0; i < 1 /*data.length*/ ; i++) {
      //如果该城市没有加盟店或者品牌数大于3
      if (data.length != 0) {
        if (data[i].length == 0) {
          continue;
        } else {
          var obj = new Object();
          obj = {
            // name: brands[i],
            type: 'map',
            // roam: true,
            top: geoTop,
            left: geoL,
            zoom: geoZoom,
            map: id,
            symbol: 'pin',
            symbolSize: 50,
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: '#525252',
                  fontSize: 18
                }
              },
              emphasis: {
                show: true,
                textStyle: {
                  color: '#525252',
                  fontSize: 18
                }
              }
            },
            itemStyle: {
              normal: {
                borderColor: borderColor,
                areaColor: MapColorL
              }
            },
            data: data
          };
          series.push(obj);
        }
      }
    }

    //添加店铺数据
    for (var i = 0; i < storeNames.length; i++) {
      if (types[i] == '综合店') {
        zonghe++;
        var symbol = 'image://../image1080/9-yellow.png';
      } else {
        danpin++;
        var symbol = 'image://../image1080/10-pink.png';
      }
      var obj = {
        type: "scatter",
        coordinateSystem: "geo",
        zlevel: 12,
        data: [{
          name: storeNames[i],
          value: [jingdus[i], weidus[i]]
        }],
        symbol: symbol,
        symbolSize: [16, 20]
      }
      series.push(obj);
    }


    setOption(id, series, storeNames, Brands, Citys);
    load();
    //计算出单品点以及综合店的数量
    $('.symbol .li1 span').text('(' + danpin + ')');
    $('.symbol .li2 span').text('(' + zonghe + ')');



  })

  tooltipData = function(params, storeNames, Brands, Citys) {
    var name = params.name;
    var tooltip = params.name;
    if (Citys.indexOf(name) != -1) {
      var index = Citys.indexOf(name);
      for (var i = 0; i < Brands[index].length; i++) {
        tooltip += '<br/>' + Brands[index][i].BRAND + '店铺数：' + Brands[index][i].QTY + '家';
      }
    } else {
      var index = storeNames.indexOf(name);
      tooltip = params.name + '<br/>';
    }
    return (tooltip);
  }

  //   })
  // });
}

setOption = function(id, series, storeNames, Brands, Citys) {
  $.get('../geojson/province/' + id + '.json', function(Json, brands) {
    //地图加载成功
    $('.animate').css('background', 'none').fadeOut(600);
    Tips();
    //初始化地图
    echarts.registerMap(id, Json);
    option = {
      // backgroundColor: bgColor, //bgColor变量在common.js定义
      title: {
        text: provinceName + '加盟商分布',
        top: 30,
        right: 30,
        // subtext: 'Data from www.musi.com',
        sublink: 'http://www.musi.com',
        textStyle: {
          color: '#dcdcdc',
          fontSize: 40,
          fontWeight: 300
        }
      },
      tooltip: {
        trigger: 'item',
        showDelay: 0,
        transitionDuration: 0.2,
        // position: [10, 80],
        trigger: 'item',
        textStyle: {
          color: '#e5e5e5',
          fontSize: 28
        },
        extraCssText: 'border: 1px solid #e5e5e5;border-radius: 12px;background: rgba(110,110,110,0.2)',
        formatter: function(params) {
          return tooltipData(params, storeNames, Brands, Citys);
        }
      },
      visualMap: {
        type: 'piecewise',
        right: 92,
        bottom: 30,
        align: 'left',
        itemWidth: 40,
        itemHeight: 40,
        orient: 'vertical',
        // itemSymbol: 'rect',
        outOfRange: {
          color: pointColor
        },
        textStyle: {
          color: '#e5e5e5',
          fontSize: 26
        },
        pieces: [{
          min: 3,
          max: 4,
          label: '完全开发区域'
        }, {
          min: 1,
          max: 2,
          label: '未完全开发区域'
        }, {
          min: 0,
          max: 0,
          label: '未开发区域'
        }, ],
        color: [MapColorM, MapColorR, MapColorL]
      },
      toolbox: {
        show: false,
        //orient: 'vertical',
        left: 'left',
        top: 'top',
        feature: {
          dataView: {
            readOnly: false
          },
          restore: {},
          saveAsImage: {}
        }
      },
      geo: {
        map: id,
        top: geoTop,
        left: geoL,
        zoom: geoZoom,
        // roam: true,
        label: {
          emphasis: {
            show: false
          }
        },
        itemStyle: {
          normal: {
            borderColor: borderColor,
            areaColor: MapColorL
          }
        },
      },
      series: series
    };

    var myChart = echarts.init(document.getElementById('main'));
    myChart.setOption(option);

    myChart.on('click', function(params) {
      var str = params.name;
      //cityMap在common.js文件定义
      var city = cityMap[str];
      if ((Citys.indexOf(str) != -1) && (city != undefined)) {
        location.href = 'city.html?id=' + city + '&name=' + encodeURIComponent(str) + '&province=' + encodeURIComponent(provinceName) + '&index=3';
      } else {
        alert('该市地图数据暂时缺失！');
      }
    });
  })
}

//底部导航背景懒加载
function load() {
  $('.bottomNav').css({
    'background': 'url(../image1080/7-menuon.png) no-repeat',
    'background-size': '1144px 140px'
  });
}

/**
 *
 * 　　　┏┓　　　┏┓
 * 　　┏┛┻━━━┛┻┓
 * 　　┃　　　　　　　┃
 * 　　┃　　　━　　　┃
 * 　　┃　┳┛　┗┳　┃
 * 　　┃　　　　　　　┃
 * 　　┃　　　┻　　　┃
 * 　　┃　　　　　　　┃
 * 　　┗━┓　　　┏━┛Code is far away from bug with the animal protecting
 * 　　　　┃　　　┃    神兽保佑,代码无bug
 * 　　　　┃　　　┃
 * 　　　　┃　　　┗━━━┓
 * 　　　　┃　　　　　 ┣┓
 * 　　　　┃　　　　 ┏┛
 * 　　　　┗┓┓┏━┳┓┏┛
 * 　　　　　┃┫┫　┃┫┫
 * 　　　　　┗┻┛　┗┻┛
 *
 */