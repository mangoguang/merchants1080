function load(){$(".slides li").css("background","url(../image1080/storePictures.png) 50% 0 no-repeat"),$(".bottomNav").css({background:"url(../image1080/7-menuon.png) no-repeat","background-size":"1144px 140px"})}areaColor=MapColorL;var geoTop=130,geoLeft="center",zoom=1.1,visualMapBottom=180,visulMapR=80,center,tude={},indexName,height=document.documentElement.clientHeight,urlStr=decodeURIComponent(window.location.search.substr(11)),paramArr=urlStr.split("="),paramArr1=paramArr[2].split("&"),provinceName=paramArr1[0],cityName=paramArr[1].split("&",1).toString();$(document).ready(function(){function e(){insertData(t)}$(".storeList").height(height-220),$(".storeContent").height(height-400),$(function(){$(".flexslider").flexslider({directionNav:!0,pauseOnAction:!1})}),managerMsg(provinceName),$(".deviceHeight").css("height",height);var t=getQueryString("id");switch(t){case"000001":t="tianjin";break;case"000002":t="beijing";break;case"000003":t="chongqing";break;case"000004":t="shanghai";break;case"000005":t="xianggang";break;case"000006":t="aomen"}$("h2.title .city").text(cityName+"地图"),e(),$(".slidBar").click(function(){var t=$(".storeDetailBox").css("margin-left");"0px"==t?($(".manageMsgBox").show(),$("#main").css({width:"100%","margin-left":"0px"}),geoLeft="center",zoom=1.1,geoTop=130,$(this).removeClass("Right2"),visualMapBottom=180,visulMapR=80,e(),$(".storeDetailBox").css("margin-left","-1200px"),$(".symbol").css({bottom:"140px",right:"105px"})):($(".manageMsgBox").hide(),$("#main").css({width:"790px","margin-left":"1200px"}),geoLeft="center",zoom=.8,geoTop=100,$(this).addClass("Right2"),visualMapBottom="bottom",visulMapR=-280,e(),$(".storeDetailBox").css("margin-left","0px"),$(".symbol").css({bottom:"30px",right:"100px"}))});var o={country:"中国",province:provinceName,city:cityName};getData1(dataPath+"gettude",o).then(function(e){tude=e})}),insertData=function(e){function t(e){var t={storeName:e};getData1(dataPath+"storeinfo",t).then(function(e){$(".storeTit").html(e.storeName),$(".storePhone").html(e.phone),$(".storeAddress").html(e.address),$(".storeArea").html(e.storeArea),$(".startTime").html(e.startTime);var t=e.brands.split(",");$(".brandList").empty();for(var o=0;o<t.length;o++){var a="<li>"+t[o]+"</li>";$(".brandList").append(a)}})}var o=0,a=0,r={country:"中国",province:provinceName,city:cityName};getData1(dataPath+"areadistribute",r).then(function(r){r=r.info;for(var i=[],n=0;n<r.length;n++)for(var s=r[n].stores,l=0;l<s.length;l++)i.push(s[l]);$("ul.storeList li").remove();for(var n=0;n<i.length;n++){if(0==n)var m='<li class="li1 on">';else var m="<li>";var c=m+"<h3>"+i[n].STORE+"</h3><p>电话：1888888880</p><p>地址："+i[n].ADDRESS+"</p></li>";$("ul.storeList").append(c)}$(function(){var e=$(".storeList .on").find("h3").html();t(e)}),$(".storeList li").click(function(){$(this).addClass("on"),$(this).siblings().removeClass("on");var e=$(".storeList .on").find("h3").html();t(e)});for(var p=[],g=[],n=0;n<i.length;n++){if("综合店"==i[n].PROPERTY){a++;var h="image://../image1080/9-yellow.png"}else{o++;var h="image://../image1080/10-pink.png"}var u={name:n+"nameMap",type:"scatter",coordinateSystem:"geo",zlevel:12,data:[{name:i[n].STORE,value:[i[n].JINGDU,i[n].WEIDU]}],symbol:h,symbolSize:[32,40]};p.push(u)}for(var n=0;n<r.length;n++){var f={name:r[n].countyName,value:1};g.push(f)}!function(){var t={name:"113.75824,23.284367",top:geoTop,left:geoLeft,zoom:zoom,center:center,type:"map",map:e,label:{normal:{show:!0},emphasis:{show:!0}},itemStyle:{normal:{borderColor:borderColor,areaColor:areaColor}},data:g};p.push(t)}(),setOption(e,p,r),$(".symbol .li1 span").text("("+o+")"),$(".symbol .li2 span").text("("+a+")"),tooltipData=function(e){for(var t=e.name,o="所属区县："+t+"<br/>进驻品牌：",a=[],i="",n=[],s=[],l=0;l<r.length;l++)n.push(r[l].countyName),s.push(r[l].brands);if(n.indexOf(t)!=-1){for(var l=0;l<n.length;l++)if(t==n[l])for(var m=0;m<s[l].length;m++)i=i+"<br/>"+s[l][m].BRAND+"店铺："+s[l][m].QTY+"家",a.push(s[l][m].BRAND);a=a.join("、"),o=o+a+i}else for(var o=t,l=0;l<r.length;l++)t==r[l].STORE&&(o+="<br/>"+r[l].ADDRESS);return o}})},setOption=function(e,t,o){var a=echarts.init(document.getElementById("main"));$.get("../geojson/city/"+e+".json",function(o){Tips(),echarts.registerMap(e,o),option={title:{text:cityName+"加盟商分布",top:50,left:260,sublink:"http://www.musi.com",textStyle:{color:"#e5e5e5",fontSize:40,fontWeight:300}},tooltip:{trigger:"item",showDelay:0,hideDelay:1e3,transitionDuration:.2,textStyle:{color:"#e5e5e5",fontSize:28},trigger:"item",extraCssText:"border: 1px solid #e5e5e5;border-radius: 12px;background: rgba(110,110,110,0.2)",formatter:function(e){return tooltipData(e)}},visualMap:{type:"piecewise",left:visulMapR,top:visualMapBottom,align:"left",itemWidth:40,itemHeight:40,orient:"vertical",textStyle:{color:"#e5e5e5",fontSize:26},pieces:[{min:0,max:0,label:"未开发区域"},{min:1,max:1,label:"已开发区域"}],outOfRange:{color:pointColor},color:[MapColorR,MapColorL]},toolbox:{show:!0,left:"left",top:"top",feature:{dataView:{readOnly:!1},restore:{},saveAsImage:{}}},geo:{map:e,top:geoTop,left:geoLeft,zoom:zoom,center:center,label:{emphasis:{show:!1}},itemStyle:{normal:{color:MapColorL},emphasis:{color:MapColorL}}},series:t},a.setOption(option),a.on("click",function(t){if("map"==t.componentSubType&&indexName!=t.name){insertData(e);var o=tude[t.name];center=[o[1],o[0]],indexName=t.name}}),$(".bigger").off("click").click(function(){zoom+=1,insertData(e),$(".smaller").show()}),$(".smaller").off("click").click(function(){zoom-=1,insertData(e),zoom<=1.1&&$(".smaller").hide()})})},managerMsg=function(e){var t={province:e};getData1(dataPath+"managerbyprovince",t).then(function(e){for(var t=0;t<e.length;t++)if(e[t].city.indexOf(cityName)>=0){var o=e[t];$(".name").text(o.manger),$(".area").text(o.area),$(".provinces").text(o.city),$(".phone").text(o.phone)}})};