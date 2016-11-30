requirejs.config({
    baseUrl: 'script/lib',
    paths: {
        app: '../app',
        jquery: 'jquery-2.2.1.min'
    }
});

// Start the main app logic.
requirejs(['jquery', 'properScreen', 'properScreen_css', 'api'],
function   ($, flexble, flexble_css, api) {
    //loaded and can be used here now.
    //全局变量 
    $(function(){
    	//页面跳转
    	target();
    })
    
    //首页
    var height = document. documentElement. clientHeight;
	$(document).ready(function(){
		$("body.index").css("height",height);
        
	});
    
  function target(){
      $(".showList .btn1").click(function(){
	    location.href = "html/Y_musi_about.html";
	  });
	  $(".showList .btn2").click(function(){
	    setTimeout("location.href = 'html/world.html'",300);
	  });
	  $(".showList .btn3").click(function(){
	    location.href = "html/Y_playGame.html";
	  });
	  $(".showList .btn4").click(function(){
		  location.href = "html/Y3_LogIn.html";
	  });
	  $(".showList .btn5").click(function(){
		  location.href = "html/Y5_firstPage.html";
	  });
	  $(".showList .btn6").click(function(){
		  location.href = "html/Y6_index.html";
	  })
  }
  
//	(function(){	
//		var vsql = 'SELECT   id, guojia,jingdu,weidu  FROM t_guojiaziliao';
//		api.ajax({
//		    url: 'http://10.11.0.116/Service.asmx/ZipSelectJson',
//		    method: 'post',
//		    async: false,
//		    timeout: 30,
//		    dataType: 'text',
//		    returnAll:false,
//		    data:{
//		        values: {sql: vsql, crypt: str, userName: 'admin', userPwd: 'admin123'}
//		    } 	
//		},function(ret,err){ 
//			
//		});
//	})()
	
	
  
  
//apiready = function(){
// function fun1() {
// 	var vsql = ' SELECT  * FROM View_table_scjd_new JOIN  kb_shebeiguanli  ON   SheBeiNO =  no  AND  xiliema=';
//	vsql = vsql + 'sofa2014!';
//	  
//	api.ajax({
//	    url: 'http://10.11.0.116/Service.asmx/GetPublicKey',
//	    method: 'post',
//	    timeout: 30,
//	    dataType: 'text',
//	    returnAll:false,
//	    data:{
//	        values: {userName: 'admin', userPwd: 'admin123'}    // 
//	    } 	
//	},function(ret,err){ 
//	    if (ret) {	  
//	    	var data = ret.substr(76); 
//	    	data = data.split("<",1);  
//			alert(data);
//		}
//	
//	   });
//	}
//
//
//	
//	$(".server").click(function(){
//		fun1();
//	})
//	//接口测试结束
//
//      
//};
	
});