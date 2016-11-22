	//apicloud接口调用
	apiready = function(){
	   
	};
	
	//接口调用
	function getPublicKey() {	
	    var PublicKey = 'test';	
		api.ajax({
			
		    url: 'http://10.11.0.116/Service.asmx/GetPublicKey',
		    method: 'post',
		    async: false,
		    timeout: 30,
		    dataType: 'text',
		    returnAll:false,
		    data:{
		        values: {userName: 'admin', userPwd: 'admin123'}
		    } 	
		},function(ret,err){ 
			//截取字符串
		    if (ret) {	 
		    	var data = ret.substr(76);
		    	PublicKey = String(data.split("<",1));
		    	getCountry(PublicKey);
			}
		});
	}
	
	
	getCountry = function(str){
		var vsql = 'SELECT   id, guojia  FROM t_guojiaziliao';  
		var country;
		api.ajax({
		    url: 'http://10.11.0.116/Service.asmx/ZipSelectJson',
			//url: 'http://jdxz.kukasofa.com:8000/Service.asmx/ZipSelectJson',		    		    
		    method: 'post',
		    async: false,
		    timeout: 30,
		    dataType: 'json',
		    returnAll:false,
		    data:{
		        values: {sql: vsql, crypt: str, userName: 'admin', userPwd: 'admin123'}    // 
		    } 	
		},function(ret,err){ 
			//截取字符串 
			if(ret){
				
			}
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