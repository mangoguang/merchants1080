function load(){$(".bottomNav").css({background:"url(../image1080/7-menuon.png) no-repeat","background-size":"1144px 140px"})}var geoTop=200,geoLeft="center",zoom=1.1,visualMapT=180,visualMapL=40,visualMapOrient="vertical",visualMapShow=!0,urlStr=decodeURIComponent(window.location.search.substr(8)),urlArr=urlStr.split("=");urlArr=urlArr[1].split("&");var CNname=urlArr[0];$(document).ready(function(){document.addEventListener("plusready",function(){plus.key.addEventListener("backbutton",function(){alert("back")})}),$(".deviceHeight").css("height",height-40-deviceTopHeight);var e=getQueryString("name");"Japan"==e?(zoom=1.5,geoTop=300):"German"==e?(zoom=1,geoTop=100):"India"==e&&(geoTop=120);var t=decodeURIComponent(window.location.search.substr(6));t=t.split("=");var o=t[1];subArr=o.split("&"),o=subArr[0],getData(o,e)}),getData=function(e,t){var o={country:e};getData1(dataPath+"distributeinfo",o).then(function(e){console.log(e),setStoreSum(e.totalCount),e=e.detailCount;var o=[],a=[];for(i in e){var r=e[i].cityName.split("|");a.push(r[0]);var n=e[i].stores;for(j in n)o.push(n[j])}var l=[];for(i in a){var s={name:a[i],value:1};l.push(s)}var p=[{name:t,top:geoTop,left:geoLeft,zoom:zoom,type:"map",map:t,label:{normal:{show:!0},emphasis:{show:!0}},itemStyle:{emphasis:{label:{show:!0}}},data:l}];for(i in o){if("品牌单店"==o[i].type)var u="image://../image1080/10-pink.png";else var u="image://../image1080/9-yellow.png";var s={name:"pm2.5",type:"scatter",coordinateSystem:"geo",symbol:u,symbolSize:[16,20],data:[{name:o[i].storeName,value:[parseFloat(o[i].jingdu),parseFloat(o[i].weidu),1]}]};p.push(s)}setOption(t,l,p)})},setOption=function(e,t,o){var a=echarts.init(document.getElementById("main"));$.get("../geojson/country/"+e+".json",function(t){Tips(),echarts.registerMap(e,t),option={title:{text:e+"地图",top:50,left:260,sublink:"http://www.musi.com",textStyle:{color:"#dcdcdc",fontSize:40,fontWeight:300}},tooltip:{trigger:"item",showDelay:0,transitionDuration:.2,trigger:"item",textStyle:{color:"#e5e5e5",fontSize:28},extraCssText:"border: 1px solid #e5e5e5;border-radius: 12px;background: rgba(178,178,178,0.5)",formatter:function(e){return tooltipData(e)}},visualMap:{show:visualMapShow,type:"piecewise",align:"left",top:visualMapT,left:visualMapL,itemWidth:40,itemHeight:40,orient:visualMapOrient,inverse:!0,textStyle:{color:"#dcdcdc",fontSize:30},pieces:[{min:3,max:4,label:"完全开发区域"},{min:1,max:2,label:"未完全开发区域"},{min:0,max:0,label:"未开发区域"}],color:[MapColorM,MapColorR,MapColorL]},toolbox:{show:!0,left:"left",top:"top",feature:{dataView:{readOnly:!1},restore:{},saveAsImage:{}}},geo:{map:e,top:geoTop,left:geoLeft,zoom:zoom,itemStyle:{normal:{borderColor:borderColor,areaColor:MapColorL}}},series:o},a.setOption(option),load(),tooltipData=function(e){return e.name}})},setStoreSum=function(e){var t=e[0].QTY;if(void 0==e[1])var o=0;$(".symbol>.li1>span").text("("+t+")"),$(".symbol>.li2>span").text("("+o+")")};