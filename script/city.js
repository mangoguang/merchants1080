var danpin = 0; //初始化单品店数
var zonghe = 0; //初始化综合店数
//地图配置参数
var geoTop = 130;
var geoLeft = 'center';
var zoom = 1.1;
var titleTop = 180;
var visualMapBottom = 140;

var height = document.documentElement.clientHeight;
var urlStr = decodeURIComponent(window.location.search.substr(11));
var paramArr = urlStr.split("=");
var provinceName = paramArr[2];
var cityName = paramArr[1].split('&', 1).toString();

$(document).ready(function() {
	//设置店铺列表高度
	$('.storeList').height(height - 220);
	//设置店铺内容高度
	$('.storeContent').height(height - 400);

	/*轮播图*/
	$(function() {
		$('.flexslider').flexslider({
			directionNav: true,
			pauseOnAction: false
		});
	})

	$(".deviceHeight").css("height", height);
	//获取链接参数
	var id = getQueryString("id");

	switch (id) {
		case '000001':
			id = 'tianjin';
			break;
		case '000002':
			id = 'beijing';
			break;
		case '000003':
			id = 'chongqing';
			break;
		case '000004':
			id = 'shanghai';
			break;
		case '000005':
			id = 'xianggang';
			break;
		case '000006':
			id = 'aomen';
			break;
	}

	$('h2.title .city').text(cityName + '地图');

	/*获取数据*/
	function setMap() {
		// getData("SELECT gongsi,dizhi,kaiyeriqi,diqumingchen,jingdu,weidu FROM t_jiamengshang WHERE chengshimingchen = '" + cityName + "'").then(function(ret) {
		insertData(id);
		// })
	}
	setMap();

	/*------店铺详情框代码------*/
	$(".slidBar").click(function() {
			var marginLeft = $(".storeDetailBox").css('margin-left');
			if (marginLeft == '0px') {
				$("#main").css({
					'width': '100%',
					'margin-left': '0px'
				});
				geoLeft = 'center';
				zoom = 1.1;
				geoTop = 130;

				titleTop = 180;

				visualMapBottom = 140;
				setMap();
				$(".storeDetailBox").css('margin-left', '-1200px');
				$(".symbol").css({
					'bottom': '140px',
					'right': '140px'
				});
			} else {
				$("#main").css({
					'width': '790px',
					'margin-left': '1200px'
				});
				geoLeft = 'center';
				zoom = 0.8;
				geoTop = 100;

				titleTop = 80;

				visualMapBottom = 80;
				setMap();
				$(".storeDetailBox").css('margin-left', '0px');
				$(".symbol").css({
					'bottom': '55px',
					'right': '100px'
				});
			}
		})
		/*------店铺详情框代码结束------*/
})

insertData = function(id) {

	var ajaxData = {
		country: '中国',
		province: provinceName,
		city: cityName
	};
	getData1(dataPath + "areadistribute", ajaxData).then(function(arr) {
		var stores = [];
		for (var i = 0; i < arr.length; i++) {
			var array = arr[i].stores;
			for (var j = 0; j < array.length; j++) {
				stores.push(array[j]);
			}
		}

		//添加店铺列表
		$("ul.storeList li").remove();
		for (var i = 0; i < stores.length; i++) {
			if (i == 0) {
				var liNode = '<li class="li1 on">';
			} else {
				var liNode = '<li>';
			}
			var li = liNode +
				"<h3>" + stores[i].STORE + "</h3>" +
				"<p>电话：1888888880</p>" +
				"<p>地址：" + stores[i].ADDRESS + "</p>" +
				"</li>";
			$("ul.storeList").append(li);
		}

		//插入店铺详情
		$(function() {
			var storeName = $('.storeList .on').find('h3').html();
			setStoreMsg(storeName);
		})

		//点击店铺列表
		$(".storeList li").click(function() {
			$(this).addClass('on');
			$(this).siblings().removeClass('on');

			// setStoreMsg();
			var storeName = $('.storeList .on').find('h3').html();
			setStoreMsg(storeName);
		})

		var series = [];
		var data = [];
		var UniqueQuxian = [];
		var countys = ['惠东县', '惠阳区', '惠城区']
		for (var i = 0; i < stores.length; i++) {
			if (stores[i].PROPERTY == '综合店') {
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
						name: stores[i].STORE,
						value: [stores[i].JINGDU, stores[i].WEIDU]
					}],
					symbol: symbol,
					symbolSize: [32, 40]
				}
				//如果第一次出现，则value=1，否则value=0
				// console.log(ret[i].diqumingchen);
				// if (UniqueQuxian.indexOf(ret[i].diqumingchen) == -1) {
				// 	UniqueQuxian.push(ret[i].diqumingchen);
				// 	var obj1 = {
				// 		name: ret[i].diqumingchen,
				// 		value: 1
				// 	};
				// } else {
				// 	var obj1 = {
				// 		name: ret[i].diqumingchen,
				// 		value: 0,
				// 		date: ret[i].kaiyeriqi
				// 	};
				// };

			series.push(obj);
			// data.push(obj1);
		}

		for (var i = 0; i < arr.length; i++) {
			var obj1 = {
				name: arr[i].countyName,
				value: 1
			};
			data.push(obj1);
		}

		(function() {
			var obj = {
				name: cityName + '地图',
				top: geoTop,
				left: geoLeft,
				zoom: zoom,
				type: 'map',
				// roam: true,
				map: id,
				label: {
					normal: {
						show: true
					},
					emphasis: {
						show: true
					}
				},
				itemStyle: {
					normal: {
						borderColor: borderColor,
						areaColor: MapColorL
					}
				},
				data: data
			}
			series.push(obj);
		})()

		/*载入地图*/
		setOption(id, series, arr);
		//计算出单品点以及综合店的数量
		$('.symbol .li1 span').text('(' + danpin + ')');
		$('.symbol .li2 span').text('(' + zonghe + ')');

		//tooltip回调函数
		tooltipData = function(params) {
			var name = params.name;
			var tooltip = '所属区县：' + name + '<br/>' + '进驻品牌：';
			var brandStr = [];
			var brandMsgStr = '';

			//该市已开发区县
			var countys = [];
			var Brands = []; //该地级市各个区县入驻品牌列表
			for (var i = 0; i < arr.length; i++) {
				countys.push(arr[i].countyName);
				Brands.push(arr[i].brands);
			}

			//如果点击的是区县地图
			if (countys.indexOf(name) != -1) {
				for (var i = 0; i < countys.length; i++) {
					if (name == countys[i]) { //循环判断当前是哪个区县
						for (var j = 0; j < Brands[i].length; j++) {
							brandMsgStr = brandMsgStr + '<br/>' + Brands[i][j].BRAND + '店铺：' + Brands[i][j].QTY + '家';
							brandStr.push(Brands[i][j].BRAND);
						}
					}
				}
				brandStr = brandStr.join('、');
				tooltip = tooltip + brandStr + brandMsgStr;
			} else {
				var tooltip = name;
				for (var i = 0; i < arr.length; i++) {
					if (name == arr[i].STORE) {
						tooltip += '<br/>' + arr[i].ADDRESS;
					}
				}
			}
			return tooltip;
		}
	})

	function setStoreMsg(storeName) {
		var ajaxData = {
			storeName: storeName
		};
		getData1(dataPath + "storeinfo", ajaxData).then(function(msg) {
			$(".storeTit").html(msg.storeName);
			$(".storePhone").html(msg.phone);
			$(".storeAddress").html(msg.address);
			$(".storeArea").html(msg.storeArea);
			$(".startTime").html(msg.startTime);
			var brands = msg.brands.split(',');
			$(".brandList").empty();
			for (var i = 0; i < brands.length; i++) {
				var li = '<li>' + brands[i] + '</li>';
				$(".brandList").append(li);
			}
		})
	}

	// //点击店铺跳转相应店铺的详情页
	// $(".storeList>li").click(function() {
	// 	var storeName = $(this).find('h3').html();
	// 	location.href = 'store.html?storeName=' + encodeURIComponent(storeName);
	// })
	//定义series数据

}

setOption = function(id, series, arr) {
	var myChart = echarts.init(document.getElementById('main'));
	$.get('../geojson/city/' + id + '.json', function(Json) {
		//地图加载成功
		$('.animate').css('background', 'none').fadeOut(600);
		Tips();

		echarts.registerMap(id, Json);
		option = {
			// backgroundColor: bgColor, //bgColor变量在common.js定义
			title: {
				text: cityName + '加盟商分布',
				top: titleTop,
				left: 200,
				// subtext: 'Data from www.musi.com',
				sublink: 'http://www.musi.com',
				textStyle: {
					color: '#e5e5e5',
					fontSize: 40,
					fontWeight: 300
				}
			},
			tooltip: {
				trigger: 'item',
				showDelay: 0,
				hideDelay: 1000,
				transitionDuration: 0.2,
				// extraCssText: 'background: rgba(255,255,255,0.5);border: 2px solid #525252;color:#525252;',
				// position: [10, 80],
				textStyle: {
					color: '#e5e5e5',
					fontSize: 28
				},
				trigger: 'item',
				extraCssText: 'border: 1px solid #e5e5e5;border-radius: 12px;background: rgba(110,110,110,0.2)',
				formatter: function(params) {
					return tooltipData(params);
				}
			},
			visualMap: {
				type: 'piecewise',
				left: 140,
				bottom: visualMapBottom,
				itemWidth: 40,
				itemHeight: 40,
				orient: 'vertical',
				// itemSymbol: 'rect',
				textStyle: {
					color: '#e5e5e5',
					fontSize: 26
				},
				pieces: [{
					min: 0,
					max: 0,
					label: '未开发区域'
				}, {
					min: 1,
					max: 1,
					label: '已开发区域'
				}],
				outOfRange: {
					color: pointColor
				},
				color: [MapColorR, MapColorL]
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
				map: id,
				top: geoTop,
				left: geoLeft,
				zoom: zoom,
				// roam: true,
				label: {
					emphasis: {
						show: false
					}
				},
				itemStyle: {
					normal: {
						color: MapColorL
					},
					emphasis: {
						color: MapColorL
					}
				}
			},
			series: series
		};

		myChart.setOption(option);

	})
}

function load() {
	$(".slides li").css('background', 'url(../image1080/storePictures.png) 50% 0 no-repeat');
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