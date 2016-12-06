//地图相对位置参数
var geoTop = 'center';
var geoLeft = 'center';
var zoom = 1.1;
var visualMapBottom = 80;
var visualMapLeft = 160;
var visualMapOrient = 'vertical';
var visualMapShow = true;
var titleTop = 170;
var titleLeft = 360;

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

  //获取URL参数
  var countryName = decodeURIComponent(window.location.search.substr(6));
  // if (countryName == 'China') {
  getChina();
  // }

})

//美国的名称与geojson名称不同
var name = getQueryString("name");

getChina = function() {
  var ajaxData = {
    country: CNname
  };
  getData1(dataPath + "managerbyinfo", ajaxData).then(function(data) {
    /*载入国家或地区地图*/
    console.log(data);
    var data1 = [];
    for (var i = 0; i < data.length; i++) {
      var arr = data[i].city.split(",");
      data1.push(arr);
    }

    //定义Data数组
    var Data = new Array();
    Data.length = data1.length;
    //定义Data[i]为数组
    for (var i = 0; i < data1.length; i++) {
      Data[i] = new Array();
    }
    //向Data[i]添加元素
    for (var i = 0; i < data1.length; i++) {
      for (var j = 0; j < data1[i].length; j++) {
        var obj = {
          name: data1[i][j],
          value: i
        };
        Data[i].push(obj);
      }
    }


    var area = [];
    for (var i = 0; i < data.length; i++) {
      area.push(data[i].area);
    }

    //定义series数据
    function series() {
      var series = new Array();
      for (var i = 0; i < data.length; i++) {
        var obj = {
            name: area[i],
            top: geoTop,
            left: geoLeft,
            type: 'map',
            zoom: zoom,
            // roam: true,
            map: name,
            scaleLimit: {
              min: 0.6,
              max: 20
            },
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: '#e5e5e5',
                  fontSize: 12
                }
              },
              emphasis: {
                show: true,
                textStyle: {
                  color: '#525252',
                  fontSize: 12
                }
              }
            },
            itemStyle: {
              normal: {
                borderColor: borderColor,
                areaColor: MapColorL
              }
            },
            // data: Data[i]
            data: Data[i]
          }
          // series.push(obj);
      }
      return (series);
    }
    series();

    var pieces = [];
    for (var i = 0; i < area.length; i++) {
      var obj = {
        min: i,
        max: i,
        label: area[i]
      };
      // pieces.push(obj);
    }

    setOption(pieces, series, data, area);
    // })
  });
};


setOption = function(pieces, series, data, area) {
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
        top: titleTop,
        left: titleLeft,
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
      // legend: {
      //  orient: 'horizontal',
      //  bottom: 25,
      //  left: 12,
      //  right: 12,
      //  itemWidth: 10,
      //  itemHeight: 10,
      //  itemGap: 16, //data:[managerName[0],managerName[1],managerName[2]]
      //  data: area
      // },
      // visualMap: {
      //   show: visualMapShow,
      //   type: 'piecewise',
      //   align: 'left',
      //   // left: 'center',
      //   // bottom: visualMapBottom,
      //   top: 'center',
      //   right: visualMapLeft,
      //   itemWidth: 40,
      //   itemHeight: 40,
      //   orient: visualMapOrient,
      //   inverse: true,
      //   textStyle: {
      //     color: '#dcdcdc',
      //     fontSize: 30
      //   },
      //   pieces: pieces,
      //   color: ['#673ab7', '#1976d2', '#0d47a1', '#d32f2f', '#8e24aa', '#d81b60', '#f5410a', '#ec407a', '#ff5722', '#ff5722', '#f4ce37', '#ffc107']
      //     // color: ['#1976d2', '#f5410a', '#ffc107', '#f4ce37', '#d81b60', '#0d47a1', '#ff5722', '#8e24aa', '#673ab7', '#ff5722', '#ec407a', '#d32f2f']
      //     //        西三区     东一区     北二区    北三区      南二区     西二区     东二区     南三区     西一区     北一区     东三区     南一区  
      // },
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
        roam: true,
        scaleLimit: {
          min: 0.6,
          max: 20
        },
        label: {
          emphasis: {
            show: true
          }
        },
        itemStyle: {
          normal: {
            borderColor: borderColor,
            areaColor: MapColorL
          }
        }
      },
      series: series()
        // {
        //         name: '华中招商经理',
        //         type: 'map',
        //         roam: true,
        //         map: name,
        //         data:[
        //               {name: '四川',value: 1 },
        //               {name: '浙江',value: 1 },
        //               {name: '江苏',value: 1 },
        //               {name: '湖北',value: 1 }
        //         ]
        //     }
    };

    myChart.setOption(option);
    load();

    myChart.on('click', function(params) {
      console.log(params.componentType);
      var str = params.name;
      var provinceName = province[str];
      if (provinceName == undefined) {
        provinceName = 'shanxi1';
      }
      if (name == 'China') {
        switch (provinceName) {
          case 'tianjin':
            location.href = 'city.html?id=000001&name=' + encodeURIComponent('天津市') + '&provinceName=天津';
            break;
          case 'beijing':
            location.href = 'city.html?id=000002&name=' + encodeURIComponent('北京市') + '&provinceName=北京';
            break;
          case 'chongqing':
            location.href = 'city.html?id=000003&name=' + encodeURIComponent('重庆市') + '&provinceName=重庆';
            break;
          case 'shanghai':
            location.href = 'city.html?id=000004&name=' + encodeURIComponent('上海市') + '&provinceName=上海';
            break;
          case 'xianggang':
            location.href = 'city.html?id=000005&name=' + encodeURIComponent('香港') + '&provinceName=香港';
            break;
          case 'aomen':
            location.href = 'city.html?id=000006&name=' + encodeURIComponent('澳门') + '&provinceName=澳门';
            break;
          default:
            location.href = 'province.html?name=' + encodeURIComponent(str) + '&id=' + provinceName;
        }
      }
    });

    tooltipData = function(params) {
      // console.log(data);
      var DATA = {};
      var name = params.name;
      for (var i = 0; i < data.length; i++) {
        if (data[i].city.indexOf(name) != -1) {
          DATA = data[i];
        }
      }
      // console.log(DATA);
      for (var i = 0; i < area.length; i++) {
        // if (area[i].indexOf(name) != -1) {
        return ('所属大区：' + DATA.area + '<br/>招商经理：' + DATA.name + '<br/>省级行政区：' + DATA.city + '<br/>加盟店数量：' + DATA.qty + '<br/>加盟品牌：' + DATA.brands.slice(0, 26));
        // return (params.name + area[0] + '<br/>招商经理：***<br/>拥有品牌：3D，0769，凯奇，歌蒂娅<br/>品牌总点数： 180家，覆盖率：53%<br/>***品牌店：30家');
        // }
      }
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