//地图配置参数
areaColor = MapColorL;
var geoTop = 130;
var geoLeft = 'center';
var zoom = 1.1;
var visualMapBottom = 180;
var visulMapR = 80;
var center;
var tude = {};
var indexName;

var height = document.documentElement.clientHeight;
var urlStr = decodeURIComponent(window.location.search.substr(11));
var paramArr = urlStr.split("=");
var paramArr1 = paramArr[2].split('&');
var provinceName = paramArr1[0];
var cityName = paramArr[1].split('&', 1).toString();
indexName = cityName;

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

	managerMsg(provinceName);

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

	var ajaxData = {
		country: '中国',
		province: provinceName,
		city: cityName
	};
	getData1(dataPath + "gettude", ajaxData).then(function(arr) {
		console.log(123123123);
		console.log(arr);
		console.log(123123123);
		tude = arr;
	})
})

insertData = function(id) {
	var danpin = 0; //初始化单品店数
	var zonghe = 0; //初始化综合店数

	var ajaxData = {
		country: '中国',
		province: provinceName,
		city: cityName
	};
	getData1(dataPath + "areadistribute", ajaxData).then(function(arr) {
		console.log(arr);
		if (arr.haveSubArea == false) {
			var areaColor = MapColorR;
		} else {
			var areaColor = MapColorL;
		}

		function resetOption(id, arr) {
			// areaColor = MapColorR;
			// console.log(arr);
			arr = arr.info;
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
					"<p>电话：" + stores[i].PHONE + "</p>" +
					"<p>地址：" + stores[i].ADDRESS + "</p>" +
					"</li>";
				$("ul.storeList").append(li);
			}

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
			for (var i = 0; i < stores.length; i++) {
				if (stores[i].PROPERTY == '综合店') {
					zonghe++;
					var symbol = 'image://../image1080/9-yellow.png';
				} else {
					danpin++;
					var symbol = 'image://../image1080/10-pink.png';
				}

				var obj = {
					name: i + 'nameMap',
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

				series.push(obj);
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
					name: '113.75824,23.284367',
					top: geoTop,
					left: geoLeft,
					zoom: zoom,
					center: center,
					type: 'map',
					roam: true,
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
							areaColor: areaColor
						}
					},
					data: data
				}
				series.push(obj);
			})()

			/*载入地图*/
			setOption(id, series, arr);

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
		}
		resetOption(id, arr);
		$('.bigger').off('click').click(function() {
			zoom += 1;
			resetOption(id, arr);
			$('.smaller').show();
		})
		$('.smaller').off('click').click(function() {
			zoom -= 1;
			resetOption(id, arr);
			if (zoom <= 1.1) {
				$('.smaller').hide();
			}
		})

		/*------店铺详情框代码------*/
		$(".slidBar").off('click').click(function() {
				var marginLeft = $(".storeDetailBox").css('margin-left');
				if (marginLeft == '0px') {
					$('.manageMsgBox').show();
					$("#main").css({
						'width': '100%',
						'margin-left': '0px'
					});
					geoLeft = 'center';
					zoom = 1.1;
					geoTop = 130;

					$(this).removeClass('Right2');

					visualMapBottom = 180;
					visulMapR = 80;
					resetOption(id, arr);
					$(".storeDetailBox").css('margin-left', '-1200px');
					$(".symbol").css({
						'bottom': '140px',
						'right': '105px'
					});
				} else {
					$('.manageMsgBox').hide();
					$("#main").css({
						'width': '790px',
						'margin-left': '1200px'
					});
					geoLeft = 'center';
					zoom = 0.8;
					geoTop = 100;

					$(this).addClass('Right2');

					visualMapBottom = 'bottom';
					visulMapR = -280;
					resetOption(id, arr);
					$(".storeDetailBox").css('margin-left', '0px');
					$(".symbol").css({
						'bottom': '30px',
						'right': '100px'
					});
				}
			})
			/*------店铺详情框代码结束------*/

		//计算出单品点以及综合店的数量123123
		$('.symbol .li1 span').text('(' + danpin + ')');
		$('.symbol .li2 span').text('(' + zonghe + ')');

		//插入店铺详情
		$(function() {
			var storeName = $('.storeList .on').find('h3').html();
			setStoreMsg(storeName);
		})

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
		// $('.animate').css('background', 'none').fadeOut(600);
		Tips();

		echarts.registerMap(id, Json);
		option = {
			// backgroundColor: bgColor, //bgColor变量在common.js定义
			title: {
				text: cityName + '加盟商分布',
				top: 50,
				left: 260,
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
				left: visulMapR,
				top: visualMapBottom,
				align: 'left',
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
				center: center,
				roam: true,
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

		myChart.on('click', function(params) {
			if (params.componentSubType == 'map' && indexName != params.name) {
				insertData(id);
				console.log(tude);
				if (tude != null) {
					var arr5 = tude[params.name];
					center = [arr5[1], arr5[0]];
					indexName = params.name;
				}
			}
		});
	})
}

function load() {
	$(".slides li").css('background', 'url(../image1080/storePictures.png) 50% 0 no-repeat');
	$('.bottomNav').css({
		'background': 'url(../image1080/7-menuon.png) no-repeat',
		'background-size': '1144px 140px'
	});
}


//招商经理名片数据初始化
managerMsg = function(provinceName) {
	var ajaxData = {
		province: provinceName
	};

	getData1(dataPath + "managerbyprovince", ajaxData).then(function(arr) {
		var index;
		for (var i = 0; i < arr.length; i++) {
			if ((arr[i].city).indexOf(cityName) >= 0) {
				var msg = arr[i];
				$('.img1').attr('src', picPath + msg.mulu + '/' + msg.pics);
				$('.img2').attr('src', picPath + msg.mulu + '/' + msg.qr);
				$('.name').text(msg.manger);
				$('.area').text(msg.area);
				$('.provinces').text(msg.city);
				$('.phone').text(msg.phone);
			}
		}
		// for (var i = 0; i < arr.length; i++) {
		// 	var citys = arr[i].city;
		// 	var cityList = citys.split(',');
		// 	if (cityList.indexOf(provinceName) >= 0) {
		// 		var msg = arr[i];
		// 		$('.name').text(msg.name);
		// 		$('.area').text(msg.area);
		// 		$('.provinces').text(msg.city);
		// 		$('.phone').text(msg.phone);
		// 	}
		// }
	})
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