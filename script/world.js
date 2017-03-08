//地图相对位置参数
var geoTop = 170;
var geoLeft = 20;
var selectedMode = true;
var mapName = 'world';
var wjson;

var provinces = ["广东", "安徽", "澳门", "北京", "重庆", "福建", "甘肃", "广西", "贵州", "海南", "河北", "黑龙江", "河南", "湖北", "湖南", "江苏", "江西", "吉林", "辽宁", "内蒙古", "宁夏", "青海", "山东", "上海", "山西", "四川", "天津", "香港", "新疆", "西藏", "云南", "浙江"];
var CNname = [];
var ENname = [];
var sum = [];
var brandsArr;
var labelShow = false;

var ajaxObj = {};
var brandList = [];
var brandState = true;
var canClick = true;

$(document).ready(function() {
	var height = document.documentElement.clientHeight;
	$(".deviceHeight").css("height", height - 40 - deviceTopHeight);
	$("#worldBody").height(height);
	$(".barGraphBox").height(height - 230);
	$(".barGraph").height(height - 280);
	$(".unDevelopBox").height(height - 200);

	//添加各国店铺情况
	addStoreMsg();

	/*------列表部分代码------*/
	//点击显示/隐藏列表按钮
	$("#slidBar>.list").click(function() {
		$(this).siblings().removeClass('on');
		$(this).addClass('on');
		// history.pushState('abc', null, 'http://10.11.0.234:3000/html/country.html' + '/');
		$(".listBox").show(500);
	})

	$("#slidBar>.map").click(function() {
		$(this).siblings().removeClass('on');
		$(this).addClass('on');
		$(".listBox").hide(500);
	})

	$('.countryListBox').scroll(function() {
		var t = $(this).scrollTop();
		if (t > 50) {
			$('.scroll1').addClass('scrollTop');
		} else {
			$('.scroll1').removeClass('scrollTop');
		}
		if (t > 1320) {
			$('.scroll2').removeClass('scrollBottom');
		} else {
			$('.scroll2').addClass('scrollBottom');
		}
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



	// $("#testBtn").click(function() {
	// 	selectedMode = 'single';
	// 	barOption(ajaxData);
	// 	linehight = function() {
	// 		BarChart.dispatchAction({
	// 			type: 'legendSelect',
	// 			name: '3D'
	// 		});
	// 	}
	// 	linehight();
	// })

	/*------列表部分代码结束------*/
	$.get('./geojson/world.json', function(Json) {
		//设置地图
		simpleMap(mapName, Json);
		/*	各个国家开店总数，直营点与加盟店个数。*/


		setData(Json);

	})

	lazyload();


});
simpleMap = function(mapName, Json) {
	echarts.registerMap(mapName, Json);
	option = {
		series: {
			type: 'map',
			top: geoTop,
			left: geoLeft,
			zoom: 0.9,
			map: mapName
		}
	};
	var myChart = echarts.init(document.getElementById('main'));
	myChart.setOption(option);
}

setData = function(Json) {
	getData1(dataPath + "sortinfo").then(function(arr) {
		tryFun = function() {
			/*载入世界地图*/
			var myChart = echarts.init(document.getElementById('main'));
			//地图加载成功
			// $('.animate').css('background', 'none').fadeOut(600);
			// Tips();

			echarts.registerMap(mapName, Json);
			var geoCoordMap = {
				"China": [113.5, 63.48],
				"Japan": [138.76, 48.67],
				"Australia": [135.13, -18.3],
				"USA": [-80.02, 48.54],
				"Canada": [-103.98, 70.33],
				"India": [76.5, 29.48],
				"Germany": [10.76, 63.67],
				"Italy": [12.5, 48],
				"Cambodia": [104, 18]
			};

			var convertData = function(data) {
				var res = [];
				for (var i = 0; i < data.length; i++) {
					var geoCoord = geoCoordMap[data[i].name];
					if (geoCoord) {
						res.push({
							name: data[i].name,
							value: geoCoord.concat(data[i].value)
						});
					}
				}
				return res;
			};

			//定义series数组
			var country = [];
			for (var i = 0; i < arr.length; i++) {
				country.push(arr[i].area);
			}
			var series = new Array();
			console.log(ENname);
			for (i in ENname) {
				if (ENname[i] == 'China') {
					var symbolSize = [200, 230];
					var fontSize = 32;
				} else if (ENname[i] == 'Cambodia' || ENname[i] == 'Italy') {
					var symbolSize = [50, 57];
					var fontSize = 14;
				} else {
					var symbolSize = [100, 115];
					var fontSize = 18;
				}
				var obj2 = {
					type: 'scatter',
					coordinateSystem: 'geo',
					data: convertData([{
						name: ENname[i],
						value: 2
					}]),
					symbol: 'image://./image1080/6-tap.png',
					symbolSize: symbolSize,
					label: {
						normal: {
							show: true,
							formatter: CNname[i] + '\n' + sum[i] + '家' + '\n',
							textStyle: {
								color: '#000',
								fontSize: fontSize
							}
						}
					}
				}
				series.push(obj2);
			}

			(function() {
				var data = new Array();
				for (var i = 0; i < country.length; i++) {
					if (ENname[i] == 'USA') {
						ENname[i] = 'United States of America';
					}
					var temp = ENname[i];
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
				title: {
					text: '慕思招商系统',
					top: 50,
					left: 260,
					textStyle: {
						color: '#dcdcdc',
						fontSize: 40,
						fontWeight: 300
					}
				},
				visualMap: {
					type: 'piecewise',
					left: 40,
					bottom: 50,
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
					}],
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
				if (str == 'USA') {
					str = 'United States of America';
				}
				var countryName = '';
				switch (str) {
					case 'China':
						location.href = 'html/country.html?name=China&index=1';
						break;
					case 'United States of America':
						location.href = 'html/othercountry.html?name=USA&CNname=' + encodeURIComponent('美国') + '&index=1';
						break;
					case 'Japan':
						location.href = 'html/othercountry.html?name=Japan&CNname=' + encodeURIComponent('日本') + '&index=1';
						break;
					case 'Australia':
						location.href = 'html/othercountry.html?name=Australia&CNname=' + encodeURIComponent('澳大利亚') + '&index=1';
						break;
					case 'Germany':
						location.href = 'html/othercountry.html?name=German&CNname=' + encodeURIComponent('德国') + '&index=1';
						break;
					case 'India':
						location.href = 'html/othercountry.html?name=India&CNname=' + encodeURIComponent('印度') + '&index=1';
						break;
					case 'Canada':
						location.href = 'html/othercountry.html?name=Canada&CNname=' + encodeURIComponent('加拿大') + '&index=1';
						break;
					case 'Italy':
						alert('该国家地图数据暂时缺失');
						break;
					case 'Cambodia':
						alert('该国家地图数据暂时缺失');
						break;
						// default:
						// location.href = 'html/country.html?name=' + countryName;
				}

			});
		}
		try {
			tryFun();
		} catch (err) {
			alert('你的网络有问题。');
		}


		// tooltipData = function(params) {
		// 	if (params.name == 'China') {
		// 		var tooltip = params.name + '<br/>店铺总数：';
		// 		return tooltip;
		// 	}
		// }
	})
}

function lazyload() {
	//点击柱状图列表框省份按钮
	countryBtn();
	provinceBtn();
	cityBtn();

	// /*---插入国家数据---*/
	// setCountryData();

	/*---柱状图代码---*/
	ajaxObj = {
		country: '中国'
			// city: '惠州市'
	}
	barOption(ajaxObj, '');
}

/*---柱状图代码---*/
function barOption(ajaxObj, text) {

	getData1(dataPath + "brandbyinfo", ajaxObj).then(function(data) {
			tryFun = function() {
				canClick = true;

				//获取行政区域数组1
				var temp = data.area;
				var yAxisData = [];
				for (var i = 0; i < temp.length; i++) {
					yAxisData.push(temp[i][0]);
				}
				// console.log(yAxisData);

				//获取各品牌
				var legendData = [];
				var brandMsg = data.brandMsg;
				for (var i = 0; i < brandMsg.length; i++) {
					legendData.push(brandMsg[i].brand);
				}
				// $('.barLengend')
				// console.log(legendData);
				legendData.unshift('全部');

				if (brandState) {
					brandsArr = legendData;
					brandState = false;
				}

				brandList = legendData;
				addBrandList(brandsArr, text);
				barList();
				// console.log(legendData);
				// console.log(legendData);

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

				/*柱状图lengend模块'全部'数组数据*/
				var setupData = [];
				// for (var i = 0; i < lengendNumArr[0].length; i++) {
				// 	setupData.push(temp[i][1]);
				// }
				lengendNumArr.unshift(setupData);

				var series = [];
				for (var i = 0; i < brandList.length; i++) {
					var obj = {
						name: brandList[i],
						type: 'bar',
						stack: '总量',
						label: {
							normal: {
								show: labelShow,
								position: 'right',

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
					// legend: {
					// 	itemWidth: 30,
					// 	itemHeight: 20,
					// 	selectedMode: selectedMode,
					// 	inactiveColor: '#555',
					// 	textStyle: {
					// 		color: textColor,
					// 		fontSize: 12
					// 	},
					// 	data: brandList //['0769', '3D', '凯奇', '歌蒂娅', 'V6'];
					// },
					grid: {
						left: '6%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: {
						type: 'value',
						axisLabel: {
							textStyle: {
								color: textColor,
								fontSize: 12
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
								fontSize: 12
							}
						},
						axisLine: {
							lineStyle: {
								color: textColor,
								fontSize: 12
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
			}

			try {
				tryFun();
			} catch (err) {
				alert('你的网络有问题。');
			}
			// BarChart.on('legendselectchanged', function(params) {
			// 	console.log(params.name);
			// 	selectedMode = 'single';
			// 	BarChart.dispatchAction({
			// 		type: 'legendSelect',
			// 		name: brandList[i]
			// 	});
			// 	var obj = {
			// 		country: '中国',
			// 		brand: params.name
			// 	}
			// 	barOption(obj);
			// 	return false;
			// });
			/*---点击柱状图lengend模块进行数据交互---*/
			// BarChart.on('legendselectchanged', function(params) {
			// 	linehight(params.name);
			// });

			// linehight = function(name) {
			// 	if (name == '全部') {
			// 		for (var i = 0; i < legendData.length; i++) {
			// 			BarChart.dispatchAction({
			// 				type: 'legendSelect',
			// 				name: legendData[i]
			// 			});
			// 		}
			// 	} else {
			// 		BarChart.dispatchAction({
			// 			type: 'legendSelect',
			// 			name: name
			// 		});
			// 		for (var i = 0; i < legendData.length; i++) {
			// 			if (legendData[i] != name) {
			// 				BarChart.dispatchAction({
			// 					type: 'legendUnSelect',
			// 					name: legendData[i]
			// 				});
			// 			}
			// 		}
			// 	}
			// }


		})
		/*---柱状图代码结束---*/
}

function addBrandList(arr, text) {
	$('.barLengend').empty();
	var lis = '';
	for (i in arr) {
		var li = '<li class="li' + i + '"><span></span>' + arr[i] + '</li>';
		lis += (li);
	}
	$('.barLengend').append(lis);
	if (text != '') {
		for (i in arr) {
			if (arr[i] == text) {
				console.log(i);
				$('.barLengend .li' + i).addClass('on');
			}
		}
	}
}

//增加省级跟市级选择列表
function addProvinceLi() {
	$(".provincesList").empty();
	var lis = '';
	for (var i = 0; i < provinces.length; i++) {
		var li = '<li><p>' + provinces[i] + '</p></li>';
		lis = lis + li;
	}
	$(".provincesList").append(lis);
	provinceBtn();

	ajaxObj = {
		country: '中国',
		province: '广东'
			// province: '广东',
			// city: '深圳市'
	};
	getData1(dataPath + "brandbyinfo", ajaxObj).then(function(arr2) {
		$('.citysList').empty();
		var area = arr2.area;
		var lis1 = '';
		for (var i = 0; i < area.length; i++) {
			var li = '<li><p>' + area[i][0] + '</p></li>';
			lis1 = lis1 + li;
		}
		$('.citysList').append(lis1);
	})
}

//点击国家列表
function countryBtn() {
	$(".countrysList li").click(function() {
		labelShow = false;
		$('.barLengend').addClass('on');
		delete ajaxObj.brand;

		var _thisName = $(this).text();
		if (_thisName == '中国') {
			$('.hideBox').show();
			addProvinceLi();
			$('.citysListBox').hide(); //市级列表隐藏
		} else {
			$('.hideBox').hide();
			addOtherCountry(_thisName);
		}
		$('.provinceBtn').text('省');
		$(this).parent().hide(500);
		var name = $(this).text();
		$(this).parent().siblings().text(name);
		$('.unDevelopBox').hide(); //未开发地区隐藏
		ajaxObj = {
			country: name
				// province: name
				// city: '深圳市'
		}
		barOption(ajaxObj, '');
	})
}

function provinceBtn() {
	$(".provincesList li").click(function() {
		labelShow = false;
		$('.barLengend').addClass('on');
		delete ajaxObj.brand;

		$('.citysListBox > h2').text('市');
		$(this).parent().hide(500);
		$('.citysListBox').show(500);
		var name = $(this).text();
		$(this).parent().siblings().text(name);
		var ajaxData = {
			country: '中国',
			province: name
				// province: '广东',
				// city: '深圳市'
		};
		/*根据省份获取该省下各市的品牌分布情况，各市的名称，品牌名称及店铺数。
		单品店以及综合店数量统计*/
		getData1(dataPath + "distributeinfo", ajaxData).then(function(arr) {
			arr = arr.detailCount;
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
		/*根据省份名称得出该省级行政区域未重点开发地区*/
		getData1(dataPath + "voidmarkets", ajaxData).then(function(arr3) {
			// console.log(arr3);
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

		ajaxObj = {
			country: '中国',
			province: name
				// city: '深圳市'
		}
		barOption(ajaxObj, '');
	})
}

function cityBtn() {
	$(".citysList li").click(function() {
		labelShow = false;
		$('.barLengend').addClass('on');
		delete ajaxObj.brand;

		$(this).parent().hide(500);
		var name = $(this).text();
		$(this).parent().siblings().text(name);
		var provinceBtnText = $('.provinceBtn').text();
		$('.unDevelopBox').hide(); //未开发地区隐藏
		ajaxObj = {
			country: '中国',
			province: provinceBtnText,
			city: name
		}
		barOption(ajaxObj, '');
	})
}

function barList() {
	$('.barLengend li').off('click').click(function() {
		if (canClick) {
			canClick = false;
			var text = $(this).text();
			if (text == '全部') {
				labelShow = false;
				$('.barLengend').addClass('on');
				delete ajaxObj.brand;
				barOption(ajaxObj, '');
			} else {
				labelShow = true;
				$('.barLengend').removeClass('on');
				$(this).addClass('on');
				$(this).siblings().removeClass('on');
				ajaxObj["brand"] = text;
				barOption(ajaxObj, text);
			}
		}
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

addStoreMsg = function() {
	var ajaxData = {
		// country: '中国'
	};
	/*	各个国家开店总数，直营点与加盟店个数。*/
	getData1(dataPath + "sortinfo", ajaxData).then(function(arr) {
		// console.log(arr);
		var count = [];
		for (i in arr) {
			var temp = arr[i].qtyflags;
			count.push(temp[0].QTY);
		}
		for (var i = 0; i < count.length; i++) {
			for (var j = i; j < count.length; j++) {
				var x = parseInt(count[i]);
				var y = parseInt(count[j]);
				if (x < y) {
					var temp = x;
					count[i] = y;
					count[j] = x;
					var temp1 = arr[i];
					arr[i] = arr[j];
					arr[j] = temp1;
				}
			}
		}

		var lis = [];
		var storeTotal = 0;
		var countryLis = [];
		var storeSum = [];
		for (var i = 0; i < arr.length; i++) {

			var temp = arr[i].qtyflags;
			var qty = [];
			var total = 0;
			for (j = 0; j < temp.length; j++) {
				if (temp[j].QTY != undefined) {
					qty.push(temp[j].QTY);
					total += parseInt(temp[j].QTY);
				} else {
					qty.push(0);
				}
			}

			storeSum.push(total);

			var str = arr[i].area;
			str = str.split('|');
			countryName = str[1];
			ENname.push(str[0]); //各国英文名称列表
			CNname.push(str[1]); //各国中文名称列表
			sum.push((parseInt(qty[0]) + parseInt(qty[1])));

			storeTotal += (parseInt(qty[0]) + parseInt(qty[1]));

			var li = '<li>' +
				'<h3><strong>' + countryName + '</strong>共有<span class="storeSum">' + storeSum[i] + '</span>家店，其中</h3>' +
				'<ul class="clearfix">' +
				'<li>' +
				'<h4><span>' + qty[0] + '</span>家</h4>' +
				'<p>加盟店</p>' +
				'</li>' +
				'<li>' +
				'<h4><span>' + qty[1] + '</span>家</h4>' +
				'<p>直营店</p>' +
				'</li>' +
				// '<li>' +
				// '<h4><span>' + qty[2] + '</span>家</h4>' +
				// '<p>分公司</p>' +
				// '</li>' +
				'</ul>' +
				'</li>';

			var countryLi = '<li>' + countryName + '</li>';

			countryLis += countryLi;
			lis += li;
		}
		$('.countryListBox').append(lis);
		$('.countrysList').append(countryLis);
		$(".mapTitle strong").html(storeTotal);
		countryBtn();
	})
}

addOtherCountry = function(name1) {
	var ajaxData = {
		country: name1
	};
	getData1(dataPath + "distributeinfo", ajaxData).then(function(arr) {
		// var countryNames = [];
		$(".provincesList").empty(); //清空省级列表
		$('.citysList').empty(); //清空市级列表
		var lis = '';
		for (i in arr) {
			var name = arr[i].cityName;
			name = name.split('|');
			name = name[0];
			// countryNames.push(name);
			var li = '<li>' + name + '</li>';
			lis += li;
		}
		// alert(lis);
		$('.provincesList').append(lis);
		provinceBtn();
	})
}
var obj;
var fn;
/*测试面向对象编程中promise的使用*/
// var two = 'two';
// getData1(dataPath + "brandbyinfo", ajaxObj).then(function(data) {
// 	obj = function() {
// 		var one = 'one';
// 		this.one = function() {
// 			console.log(data);
// 		}
// 		this.two = function() {
// 			console.log(two);
// 		}
// 	}
// 	fn = new obj;
// 	// fn.one();
// 	fn.two();
// })
// fn.one();



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