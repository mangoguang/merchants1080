function lazyload(){countryBtn(),provinceBtn(),cityBtn(),ajaxObj={country:"中国"},barOption(ajaxObj,"")}function barOption(t,e){getData1(dataPath+"brandbyinfo",t).then(function(t){canClick=!0;for(var a=t.area,n=[],o=0;o<a.length;o++)n.push(a[o][0]);for(var i=[],r=t.brandMsg,o=0;o<r.length;o++)i.push(r[o].brand);i.unshift("全部"),brandState&&(brandsArr=i,brandState=!1),brandList=i,addBrandList(brandsArr,e),barList();var s=[],l=[];l.length=r.length;for(var o=0;o<r.length;o++)l[o]=[],s.push(r[o].brandInfo);for(var o=0;o<s.length;o++)for(var c=0;c<s[o].length;c++)l[o].push(s[o][c].QTY);for(var p=[],o=0;o<l[0].length;o++)p.push(a[o][1]);l.unshift(p);for(var h=[],o=0;o<brandList.length;o++){var d={name:brandList[o],type:"bar",stack:"总量",label:{normal:{position:"insideRight"}},data:l[o]};h.push(d)}var m=echarts.init(document.getElementById("barGraph"));Baroption={tooltip:{trigger:"axis",axisPointer:{type:"shadow"}},grid:{left:"6%",right:"4%",bottom:"3%",containLabel:!0},xAxis:{type:"value",axisLabel:{textStyle:{color:textColor,fontSize:12}},axisLine:{lineStyle:{color:textColor}},splitLine:{show:!1}},yAxis:{type:"category",axisLabel:{textStyle:{color:textColor,fontSize:12}},axisLine:{lineStyle:{color:textColor,fontSize:12}},axisTick:{show:!1},inverse:!0,data:n},series:h},m.setOption(Baroption)})}function addBrandList(t,e){$(".barLengend").empty();var a="";for(i in t){var n='<li class="li'+i+'"><span></span>'+t[i]+"</li>";a+=n}if($(".barLengend").append(a),""!=e)for(i in t)t[i]==e&&(console.log(i),$(".barLengend .li"+i).addClass("on"))}function addProvinceLi(){$(".provincesList").empty();for(var t="",e=0;e<provinces.length;e++){var a="<li><p>"+provinces[e]+"</p></li>";t+=a}$(".provincesList").append(t),provinceBtn(),ajaxObj={country:"中国",province:"广东"},getData1(dataPath+"brandbyinfo",ajaxObj).then(function(t){$(".citysList").empty();for(var e=t.area,a="",n=0;n<e.length;n++){var o="<li><p>"+e[n][0]+"</p></li>";a+=o}$(".citysList").append(a)})}function countryBtn(){$(".countrysList li").click(function(){var t=$(this).text();"中国"==t?($(".hideBox").show(),addProvinceLi(),$(".citysListBox").hide()):($(".hideBox").hide(),addOtherCountry(t)),$(".provinceBtn").text("省"),$(this).parent().hide(500);var e=$(this).text();$(this).parent().siblings().text(e),$(".unDevelopBox").hide(),ajaxObj={country:e},barOption(ajaxObj,"")})}function provinceBtn(){$(".provincesList li").click(function(){$(".citysListBox > h2").text("市"),$(this).parent().hide(500),$(".citysListBox").show(500);var t=$(this).text();$(this).parent().siblings().text(t);var e={country:"中国",province:t};getData1(dataPath+"distributeinfo",e).then(function(t){t=t.detailCount;for(var e="",a=0;a<t.length;a++)e=e+"<li>"+t[a].cityName+"</li>";$(".citysList").empty(),$(".citysList").append(e),cityBtn()});var e={province:t};getData1(dataPath+"voidmarkets",e).then(function(t){var e=t.unDevelop;e=e.split(",");for(var a="",n=0;n<e.length;n++){var o="<li>"+e[n]+"</li>";a+=o}$(".unDevelopBox ul").empty(),$(".unDevelopBox ul").append(a)}),$(".unDevelopBox").show(),ajaxObj={country:"中国",province:t},barOption(ajaxObj,"")})}function cityBtn(){$(".citysList li").click(function(){$(this).parent().hide(500);var t=$(this).text();$(this).parent().siblings().text(t);var e=$(".provinceBtn").text();$(".unDevelopBox").hide(),ajaxObj={country:"中国",province:e,city:t},barOption(ajaxObj,"")})}function barList(){$(".barLengend li").off("click").click(function(){if(canClick){canClick=!1;var t=$(this).text();"全部"==t?($(".barLengend").addClass("on"),delete ajaxObj.brand,barOption(ajaxObj,"")):($(".barLengend").removeClass("on"),$(this).addClass("on"),$(this).siblings().removeClass("on"),ajaxObj.brand=t,barOption(ajaxObj,t))}})}function load(){$(".barGraphBox").css({background:"url(image1080/1-background2.png) no-repeat","background-size":"100% 100%"}),$(".bottomNav").css({background:"url(image1080/7-menuon.png) no-repeat","background-size":"1144px 140px"})}var geoTop=170,geoLeft=20,selectedMode=!0,mapName="world",wjson,provinces=["广东","安徽","澳门","北京","重庆","福建","甘肃","广西","贵州","海南","河北","黑龙江","河南","湖北","湖南","江苏","江西","吉林","辽宁","内蒙古","宁夏","青海","山东","上海","山西","四川","天津","香港","新疆","西藏","云南","浙江"],CNname=[],ENname=[],sum=[],brandsArr,ajaxObj={},brandList=[],brandState=!0,canClick=!0,connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection||{tyep:"unknown"},type_text=["unknown","ethernet","wifi","2g","3g","4g","none"];$(document).ready(function(){var t=document.documentElement.clientHeight;$(".deviceHeight").css("height",t-40-deviceTopHeight),$("#worldBody").height(t),$(".barGraphBox").height(t-230),$(".barGraph").height(t-280),$(".unDevelopBox").height(t-200),addStoreMsg(),$("#slidBar>.list").click(function(){$(this).siblings().removeClass("on"),$(this).addClass("on"),$(".listBox").show(500)}),$("#slidBar>.map").click(function(){$(this).siblings().removeClass("on"),$(this).addClass("on"),$(".listBox").hide(500)}),$(".countryListBox").scroll(function(){var t=$(this).scrollTop();t>50?$(".scroll1").addClass("scrollTop"):$(".scroll1").removeClass("scrollTop"),t>1320?$(".scroll2").removeClass("scrollBottom"):$(".scroll2").addClass("scrollBottom")}),$(".selectBox h2").click(function(){var t=$(this).siblings().css("display");$(".selectBox ul").hide(),"none"==t?$(this).siblings().show(500):$(this).siblings().hide(500)}),addProvinceLi(),$.get("./geojson/world.json",function(t){simpleMap(mapName,t),setData(t)}),lazyload()}),simpleMap=function(t,e){echarts.registerMap(t,e),option={series:{type:"map",top:geoTop,left:geoLeft,zoom:.9,map:t}};var a=echarts.init(document.getElementById("main"));a.setOption(option)},setData=function(t){getData1(dataPath+"sortinfo").then(function(e){var a=echarts.init(document.getElementById("main"));echarts.registerMap(mapName,t);for(var n={China:[113.5,63.48],Japan:[138.76,48.67],Australia:[135.13,-18.3],USA:[-80.02,48.54],Canada:[-103.98,70.33],India:[76.5,29.48],Germany:[10.76,63.67]},o=function(t){for(var e=[],a=0;a<t.length;a++){var o=n[t[a].name];o&&e.push({name:t[a].name,value:o.concat(t[a].value)})}return e},i=[],r=0;r<e.length;r++)i.push(e[r].area);var s=new Array;for(r in ENname){if("China"==ENname[r])var l=[200,230],c=32;else var l=[100,115],c=18;var p={type:"scatter",coordinateSystem:"geo",data:o([{name:ENname[r],value:2}]),symbol:"image://./image1080/6-tap.png",symbolSize:l,label:{normal:{show:!0,formatter:CNname[r]+"\n"+sum[r]+"家\n",textStyle:{color:"#000",fontSize:c}}}};s.push(p)}!function(){for(var t=new Array,e=0;e<i.length;e++){"USA"==ENname[e]&&(ENname[e]="United States of America");var a=ENname[e],n=new Object;n.name=a,n.value=1,t.push(n)}var n={type:"map",map:"world",zoom:.9,top:geoTop,left:geoLeft,itemStyle:{normal:{borderColor:borderColor,areaColor:MapColorL}},data:t};s.push(n)}(),option={title:{text:"慕思招商系统",top:50,left:260,textStyle:{color:"#dcdcdc",fontSize:40,fontWeight:300}},visualMap:{type:"piecewise",left:40,bottom:50,itemWidth:40,itemHeight:40,orient:"vertical",textStyle:{color:"#e5e5e5",fontSize:26},outOfRange:{color:pointColor,fontSize:30},pieces:[{min:1,max:10,label:"已开发区域"},{min:0,max:0,label:"未开发区域"}],color:[MapColorR,MapColorL]},toolbox:{show:!1,left:"left",top:"top",feature:{dataView:{readOnly:!1},restore:{},saveAsImage:{}}},geo:{type:"map",map:mapName,zoom:.9,top:geoTop,left:geoLeft,itemStyle:{normal:{borderColor:borderColor,areaColor:MapColorL}}},series:s},a.setOption(option),load(),a.on("click",function(t){var e=t.name;"USA"==e&&(e="United States of America");switch(e){case"China":location.href="html/country.html?name=China&index=1";break;case"United States of America":location.href="html/othercountry.html?name=USA&CNname="+encodeURIComponent("美国")+"&index=1";break;case"Japan":location.href="html/othercountry.html?name=Japan&CNname="+encodeURIComponent("日本")+"&index=1";break;case"Australia":location.href="html/othercountry.html?name=Australia&CNname="+encodeURIComponent("澳大利亚")+"&index=1";break;case"Germany":location.href="html/othercountry.html?name=German&CNname="+encodeURIComponent("德国")+"&index=1";break;case"India":location.href="html/othercountry.html?name=India&CNname="+encodeURIComponent("印度")+"&index=1";break;case"Canada":location.href="html/othercountry.html?name=Canada&CNname="+encodeURIComponent("加拿大")+"&index=1";break;case"Italy":alert("该国家地图数据暂时缺失");break;case"Cambodia":alert("该国家地图数据暂时缺失")}})})},addStoreMsg=function(){var t={};getData1(dataPath+"sortinfo",t).then(function(t){var e=[];for(n in t){var a=t[n].qtyflags;e.push(a[0].QTY)}for(var n=0;n<e.length;n++)for(var o=n;o<e.length;o++){var i=parseInt(e[n]),r=parseInt(e[o]);if(i<r){var a=i;e[n]=r,e[o]=i;var s=t[n];t[n]=t[o],t[o]=s}}for(var l=[],c=0,p=[],h=[],n=0;n<t.length;n++){var a=t[n].qtyflags,d=[],m=0;for(o=0;o<a.length;o++)void 0!=a[o].QTY?(d.push(a[o].QTY),m+=parseInt(a[o].QTY)):d.push(0);h.push(m);var u=t[n].area;u=u.split("|"),countryName=u[1],ENname.push(u[0]),CNname.push(u[1]),sum.push(parseInt(d[0])+parseInt(d[1])),c+=parseInt(d[0])+parseInt(d[1]);var v="<li><h3><strong>"+countryName+'</strong>共有<span class="storeSum">'+h[n]+'</span>家店，其中</h3><ul class="clearfix"><li><h4><span>'+d[0]+"</span>家</h4><p>加盟店</p></li><li><h4><span>"+d[1]+"</span>家</h4><p>直营店</p></li></ul></li>",f="<li>"+countryName+"</li>";p+=f,l+=v}$(".countryListBox").append(l),$(".countrysList").append(p),$(".mapTitle strong").html(c),countryBtn()})},addOtherCountry=function(t){var e={country:t};getData1(dataPath+"distributeinfo",e).then(function(t){$(".provincesList").empty(),$(".citysList").empty();var e="";for(i in t){var a=t[i].cityName;a=a.split("|"),a=a[0];var n="<li>"+a+"</li>";e+=n}$(".provincesList").append(e),provinceBtn()})};var obj,fn;