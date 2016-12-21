//地图相对位置参数
var geoTop = 200;
var geoLeft = 'center';
var zoom = 1.1;
var visualMapT = 180;
var visualMapL = 40;
var visualMapOrient = 'vertical';
var visualMapShow = true;

var urlStr = decodeURIComponent(window.location.search.substr(8));
var urlArr = urlStr.split('=');
urlArr = urlArr[1].split('&');
var CNname = urlArr[0];

$(document).ready(function() {
  document.addEventListener('plusready', function() {
    plus.key.addEventListener('backbutton', function() {
      alert('back');
    })
  })

  //设置地图高度
  $(".deviceHeight").css("height", height - 40 - deviceTopHeight);

  var name = getQueryString("name");
  if (name == 'Japan') {
    zoom = 1.5;
    geoTop = 300;
  } else if (name == 'German') {
    zoom = 1;
    geoTop = 100;
  } else if (name == 'India') {
    geoTop = 120;
  }
  //获取URL参数
  var subStr = decodeURIComponent(window.location.search.substr(6));
  subStr = subStr.split('=');
  var countryName = subStr[1];
  subArr = countryName.split('&');
  countryName = subArr[0];

  // if (countryName == 'China') {
  getData(countryName, name);
  // }

})

/*载入中国主要城市地图*/
getData = function(countryName, name) {
  var ajaxData = {
    country: countryName
  };
  getData1(dataPath + "distributeinfo", ajaxData).then(function(arr) {
    console.log(arr);
    setStoreSum(arr.totalCount);
    arr = arr.detailCount;
    //店铺资料
    //获取店铺信息列表
    var stores = []; //店铺列表
    var areas = []; //国家下一级行政区域列表
    for (i in arr) {
      var Arr = (arr[i].cityName).split('|');
      areas.push(Arr[0]);
      var temp = arr[i].stores;
      for (j in temp) {
        stores.push(temp[j])
      }
    }
    var areaData = [];
    for (i in areas) {
      var obj = {
        name: areas[i],
        value: 1
      };
      areaData.push(obj);
    }

    var series = [{
      name: name,
      top: geoTop,
      left: geoLeft,
      zoom: zoom,
      type: 'map',
      // roam: true,
      map: name,
      label: {
        normal: {
          show: true
        },
        emphasis: {
          show: true
        }
      },
      itemStyle: {
        emphasis: {
          label: {
            show: true
          }
        }
      },
      data: areaData
    }];

    for (i in stores) {
      if (stores[i].type == '品牌单店') {
        var symbol = 'image://../image1080/10-pink.png'
      } else {
        var symbol = 'image://../image1080/9-yellow.png'
      }
      var obj = {
        name: 'pm2.5',
        type: 'scatter',
        coordinateSystem: 'geo',
        symbol: symbol,
        symbolSize: [16, 20],
        data: [{
          name: stores[i].storeName,
          value: [parseFloat(stores[i].jingdu), parseFloat(stores[i].weidu), 1]
        }]
      };
      series.push(obj);
    }

    setOption(name, areaData, series);
  })
}


setOption = function(name, areaData, series) {
    var myChart = echarts.init(document.getElementById('main'));
    $.get('../geojson/country/' + name + '.json', function(Json) {
      //地图加载成功
      $('.animate').css('background', 'none').fadeOut(600);
      Tips();

      //设置地图
      echarts.registerMap(name, Json);
      option = {
        // backgroundColor: bgColor, //bgColor变量在common.js定义
        title: {
          text: name + '地图',
          top: 50,
          left: 260,
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
          // position: [1480, 80],
          trigger: 'item',
          textStyle: {
            color: '#e5e5e5',
            fontSize: 28
          },
          extraCssText: 'border: 1px solid #e5e5e5;border-radius: 12px;background: rgba(178,178,178,0.5)',
          formatter: function(params) {
            return tooltipData(params);
          }
        },
        visualMap: {
          show: visualMapShow,
          type: 'piecewise',
          align: 'left',
          top: visualMapT,
          left: visualMapL,
          itemWidth: 40,
          itemHeight: 40,
          orient: visualMapOrient,
          inverse: true,
          textStyle: {
            color: '#dcdcdc',
            fontSize: 30
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
          }],
          color: [MapColorM, MapColorR, MapColorL]
        },
        toolbox: {
          show: true,
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
          map: name,
          top: geoTop,
          left: geoLeft,
          zoom: zoom,
          // roam: true,
          // scaleLimit: {
          //   min: 0.6,
          //   max: 20
          // },
          // label: {
          //   normal: {
          //     show: true,
          //     textStyle: {
          //       color: '#525252',
          //       fontSize: 18
          //     }
          //   }
          // },
          itemStyle: {
            normal: {
              borderColor: borderColor,
              areaColor: MapColorL
            }
          }
        },
        series: series
      };

      myChart.setOption(option);
      load();


      tooltipData = function(params) {
        return params.name;
      }
    })
  }
  //底部导航背景懒加载
function load() {
  $('.bottomNav').css({
    'background': 'url(../image1080/7-menuon.png) no-repeat',
    'background-size': '1144px 140px'
  });
}

setStoreSum = function(arr) {
    var temp0 = arr[0].QTY;
    if (arr[1] == undefined) {
      var temp1 = 0;
    }
    $('.symbol>.li1>span').text('(' + temp0 + ')');
    $('.symbol>.li2>span').text('(' + temp1 + ')');
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