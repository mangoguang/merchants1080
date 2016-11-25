/*元根代码测试*/
// $.ajax({
// 	type: 'post',
// 	url: 'http://10.11.0.46:8088/DeRuCCIApp/backAppJson.do',
// 	dataType: 'jsonp',
// 	jsonp: "jsoncallback",
// 	// data: {
// 	//     userName: 'admin',
// 	//     userPwd: 'admin123'
// 	// },
// 	async: false,
// 	success: function(data) {
// 		console.log(data[0].danh);
// 	},
// 	error: function(data) {
// 		console.log(data);
// 	}
// });

/*廖勇接口测试*/
// $.ajax({
// 	type: 'post',
// 	url: 'http://10.11.0.229:8080/deruccimid/cst/countrycstinfo',
// 	dataType: 'jsonp',
// 	jsonp: "jsoncallback",
// 	// data: {
// 	// 	province: '广东',
// 	// 	city: '深圳市',
// 	// 	county: '龙岗区'
// 	// },
// 	success: function(data) {
// 		alert('success');
// 		console.log('测试');
// 		console.log(data);
// 		console.log('测试');
// 	},
// 	error: function(data) {
// 		alert('error');
// 		console.log('测试');
// 		console.log(data);
// 		console.log('测试');
// 	}
// });

//地图相对位置参数
var geoTop = 170;
var geoLeft = 20;

var provinces = ["广东", "安徽", "澳门", "北京", "重庆", "福建", "甘肃", "广西", "贵州", "海南", "河北", "黑龙江", "河南", "湖北", "湖南", "江苏", "江西", "吉林", "辽宁", "内蒙古", "宁夏", "青海", "山东", "上海", "山西", "四川", "天津", "香港", "新疆", "西藏", "云南", "浙江"];


$(document).ready(function() {
	var height = document.documentElement.clientHeight;
	$(".deviceHeight").css("height", height - 40 - deviceTopHeight);
	$("#worldBody").height(height);
	$(".barGraphBox").height(height - 200);
	$(".barGraph").height(height - 260);
	$(".unDevelopBox").height(height - 200);

	/*------列表部分代码------*/
	//点击显示/隐藏列表按钮
	$("#slidBar").click(function() {
		$(".listBox").show(500);
	})

	$(".hideBtn").click(function() {
		$(".listBox").hide(500);
	})

	//点击选择按钮
	$(".selectBox h2").click(function() {
		var display = $(this).siblings().css('display');
		$(".selectBox ul").hide();
		if (display == 'none') {
			$(this).siblings().show(500);
		} else {
			$(this).siblings().hide(500);
		}
	})

	//添加省份筛选列
	addProvinceLi();

	//点击柱状图列表框省份按钮
	countryBtn();
	provinceBtn();
	cityBtn();

	/*---插入国家数据---*/
	setCountryData();

	/*---柱状图代码---*/
	var ajaxData = {
		country: '中国'
			// city: '惠州市'
	}
	barOption(ajaxData);

	/*------列表部分代码结束------*/

	//设置地图
	setData();
});


setData = function() {
	/*载入世界地图*/
	var myChart = echarts.init(document.getElementById('main'));
	$.get('geojson/world.json', function(worldJson) {
		//地图加载成功
		$('.animate').css('background', 'none').fadeOut(600);
		Tips();

		var mapName = 'world';
		echarts.registerMap(mapName, worldJson);

		var geoCoordMap = {
			"美国": [-90.02, 38.54],
			"中国": [117.5, 39.48],
			"日本": [139.76, 35.67],
			"澳大利亚": [145.13, -30.3],
			"加拿大": [-83.98, 55.33]
		};

		//定义series数组
		var country = ['美国', '中国', '日本', '澳大利亚', '加拿大'];
		var PictureName = ['United States of America', 'China', 'Japan', 'Australia', 'Canada'];
		var series = new Array();
		(function() {
			var data = new Array();
			for (var i = 0; i < country.length; i++) {
				var temp = PictureName[i];
				var obj = new Object();
				obj.name = temp;
				obj.value = 1;
				data.push(obj);
			}

			var obj = {
				type: 'map',
				map: 'world',
				zoom: 0.9,
				// roam: true,
				top: geoTop,
				left: geoLeft,
				itemStyle: {
					normal: {
						borderColor: borderColor,
						areaColor: MapColorL
					}
				},
				data: data
			};
			series.push(obj);
		})()

		//设置地图
		option = {
			// tooltip: {
			// 	trigger: 'item',
			// 	showDelay: 0,
			// 	transitionDuration: 0.2,
			// 	trigger: 'item',
			// 	formatter: function(params) {
			// 		return tooltipData(params);
			// 	}
			// },
			visualMap: {
				type: 'piecewise',
				left: 140,
				bottom: 136,
				itemWidth: 40,
				itemHeight: 40,
				orient: 'vertical',
				textStyle: {
					color: '#e5e5e5',
					fontSize: 26
				},
				outOfRange: {
					color: pointColor,
					fontSize: 30
				},
				pieces: [{
					min: 1,
					max: 10,
					label: '已开发区域'
				}, {
					min: 0,
					max: 0,
					label: '未开发区域'
				}, ],
				color: [MapColorR, MapColorL]
			},
			toolbox: {
				show: false,
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
				type: 'map',
				map: mapName,
				zoom: 0.9,
				// roam: true,
				top: geoTop,
				left: geoLeft,
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
		//点击相应国家实现下钻
		myChart.on('click', function(params) {
			var str = params.name;
			var countryName = '';
			switch (str) {
				case 'China':
					countryName = 'China';
					location.href = 'html/country.html?name=' + countryName;
					break;
				case 'United States of America':
					countryName = 'United States of America';
					location.href = 'html/country.html?name=' + countryName;
					break;
				case 'Japan':
					countryName = 'Japan';
					location.href = 'html/country.html?name=' + countryName;
					break;
				case 'Australia':
					countryName = 'Australia';
					location.href = 'html/country.html?name=' + countryName;
					break;
				default:
					location.href = 'html/country.html?name=' + countryName;
			}

		});

		// tooltipData = function(params) {
		// 	if (params.name == 'China') {
		// 		var tooltip = params.name + '<br/>店铺总数：';
		// 		return tooltip;
		// 	}
		// }
	})
}

/*---插入国家数据---*/
function setCountryData() {
	getData1(dataPath + "countrycstinfo").then(function(data) {
		var data = data.countryMsg;
		var storesTotal = 0;
		// var countryName = ['中国', '美国', '澳大利亚'];

		for (i = 0; i < 3; i++) {
			storesTotal += parseInt(data[i].QTY);
			var className = '.tooltip' + (i + 1);
			$(className + ' span').html(data[i].QTY);
			$(className + ' h2').html(data[i].COUNTRYNAME);
		}
		$(".mapTitle strong").html(storesTotal);
	})
}

/*---柱状图代码---*/
function barOption(ajaxData) {

	getData1(dataPath + "brandbyinfo", ajaxData).then(function(data) {

			//获取行政区域数组
			var temp = data.area;
			var yAxisData = [];
			for (var i = 0; i < temp.length; i++) {
				yAxisData.push(temp[i][0]);
			}
			console.log(yAxisData);

			//获取各品牌
			var legendData = [];
			var brandMsg = data.brandMsg;
			for (var i = 0; i < 8 /*brandMsg.length*/ ; i++) {
				legendData.push(brandMsg[i].brand);
			}

			//获取各品牌在各行政区域的店铺数量
			var lengendBrandArr = [];
			var lengendNumArr = [];
			lengendNumArr.length = brandMsg.length;
			for (var i = 0; i < brandMsg.length; i++) {
				lengendNumArr[i] = [];
				lengendBrandArr.push(brandMsg[i].brandInfo);
			}

			for (var i = 0; i < lengendBrandArr.length; i++) {
				for (var j = 0; j < lengendBrandArr[i].length; j++) {
					lengendNumArr[i].push(lengendBrandArr[i][j].QTY);
				}
			}

			var series = [];
			for (var i = 0; i < legendData.length; i++) {
				var obj = {
					name: legendData[i],
					type: 'bar',
					stack: '总量',
					label: {
						normal: {
							// show: true,
							position: 'insideRight'
						}
					},
					data: lengendNumArr[i] //[169, 60, 80, 130, 135, 65, 30, 50, 90, 85, 80]
				}

				series.push(obj);
			}

			var BarChart = echarts.init(document.getElementById('barGraph'));

			Baroption = {
				tooltip: {
					trigger: 'axis',
					// triggerOn: 'click',
					axisPointer: { // 坐标轴指示器，坐标轴触发有效
						type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				legend: {
					itemWidth: 30,
					itemHeight: 20,
					textStyle: {
						color: textColor,
						fontSize: 18
					},
					data: legendData //['0769', '3D', '凯奇', '歌蒂娅', 'V6'];
				},
				grid: {
					left: '6%',
					right: '4%',
					bottom: '6%',
					containLabel: true
				},
				xAxis: {
					type: 'value',
					axisLabel: {
						textStyle: {
							color: textColor,
							fontSize: 18
						}
					},
					axisLine: {
						lineStyle: {
							color: textColor
						}
					},
					splitLine: {
						show: false
					}
				},
				yAxis: {
					type: 'category',
					axisLabel: {
						textStyle: {
							color: textColor,
							fontSize: 18
						}
					},
					axisLine: {
						lineStyle: {
							color: textColor,
							fontSize: 18
						}
					},
					axisTick: {
						show: false
					},
					inverse: true,
					data: yAxisData // var yAxisData = ['广东', '广西', '福建', '浙江', '江苏', '湖南', '江西', '贵州', '云南', '四川', '湖北'];
				},
				series: series
					// [{
					// 	name: '0769',
					// 	type: 'bar',
					// 	stack: '总量',
					// 	label: {
					// 		normal: {
					// 			show: true,
					// 			position: 'insideRight'
					// 		}
					// 	},
					// 	data: [169, 60, 80, 130, 135, 65, 30, 50, 90, 85, 80]
					// }]
			};

			BarChart.setOption(Baroption);

		})
		/*---柱状图代码结束---*/
}

//增加省级跟市级选择列表
function addProvinceLi() {
	var lis = '';
	for (var i = 0; i < provinces.length; i++) {
		var li = '<li><p>' + provinces[i] + '</p></li>';
		lis = lis + li;
	}
	$(".provincesList").append(lis);

	var ajaxData = {
		country: '中国',
		province: '广东'
			// province: '广东',
			// city: '深圳市'
	};
	getData1(dataPath + "brandbyinfo", ajaxData).then(function(arr2) {
		var area = arr2.area;
		var lis1 = '';
		for (var i = 0; i < area.length; i++) {
			var li = '<li><p>' + area[i] + '</p></li>';
			lis1 = lis1 + li;
		}
		$('.citysList').append(lis1);
	})
}

function countryBtn() {
	$(".countrysList li").click(function() {
		$(this).parent().hide(500);
		var name = $(this).text();
		$(this).parent().siblings().text(name);
		$('.unDevelopBox').hide(); //未开发地区隐藏
		var obj = {
			country: name
				// province: name
				// city: '深圳市'
		}
		barOption(obj);
	})
}

function provinceBtn() {
	$(".provincesList li").click(function() {
		$(this).parent().hide(500);
		var name = $(this).text();
		$(this).parent().siblings().text(name);
		var ajaxData = {
			country: '中国',
			province: name
				// province: '广东',
				// city: '深圳市'
		};
		getData1(dataPath + "distributeinfo", ajaxData).then(function(arr) {
			var li = '';
			for (var i = 0; i < arr.length; i++) {
				li = li + '<li>' + arr[i].cityName + '</li>'
			}
			$('.citysList').empty();
			$('.citysList').append(li);

			cityBtn();
		});

		//未开发数据
		var ajaxData = {
			province: name
		};
		getData1(dataPath + "voidmarkets", ajaxData).then(function(arr3) {
			var lis = arr3.unDevelop;
			lis = lis.split(',');
			var liStr = '';
			for (var i = 0; i < lis.length; i++) {
				var li = '<li>' + lis[i] + '</li>';
				liStr += li;
			}
			$('.unDevelopBox ul').empty();
			$('.unDevelopBox ul').append(liStr);
		})
		$('.unDevelopBox').show(); //未开发地区显示

		var obj = {
			country: '中国',
			province: name
				// city: '深圳市'
		}
		barOption(obj);
	})
}

function cityBtn() {
	$(".citysList li").click(function() {
		$(this).parent().hide(500);
		var name = $(this).text();
		$(this).parent().siblings().text(name);
		var provinceBtnText = $('.provinceBtn').text();
		$('.unDevelopBox').hide(); //未开发地区隐藏
		var obj = {
			country: '中国',
			province: provinceBtnText,
			city: name
		}
		barOption(obj);
	})
}

//柱状图及底部导航背景懒加载
function load() {
	$('.barGraphBox').css({
		'background': 'url(image1080/1-background2.png) no-repeat',
		'background-size': '100% 100%'
	});
	$('.bottomNav').css({
		'background': 'url(image1080/7-menuon.png) no-repeat',
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