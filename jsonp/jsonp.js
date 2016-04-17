
/*
*author:ls
*email:liusaint@gmail.com
* data:2016/03/20
*/

function JSONP(url,config){
	var data = config.data || [];
	var paraArr=[],paraString='';//get请求的参数。
	var urlArr;
	var callbackName;//每个回调函数一个名字。按时间戳。
	var script,head;//要生成script标签。head标签。
	var supportLoad;//是否支持 onload。是针对IE的兼容处理。
	var onEvent;//onload或onreadystatechange事件。
	var timeout = config.timeout || 0;//超时功能。

	for(var i in data){
		if(data.hasOwnProperty(i)){
			paraArr.push(encodeURIComponent(i) + "=" +encodeURIComponent(data[i]));
		}
	}

	urlArr = url.split("?");//链接中原有的参数。
	if(urlArr.length>1){
		paraArr.push(urlArr[1]);
	}

	callbackName = 'callback'+new Date().getTime();
	paraArr.push('callback='+callbackName);
	paraString = paraArr.join("&");
	url = urlArr[0] + "?"+ paraString;

	script = document.createElement("script");
	script.loaded = false;//为了实现IE下的onerror做的处理。JSONP的回调函数总是在script的onload事件（IE为onreadystatechange）之前就被调用了。因此我们在正向回调执行之时，为script标签添加一个属性，然后待到onload发生时，再检测有没有这个属性就可以判定是否请求成功，没有成功当然就调用我们的error。

	//将回调函数添加到全局。
	window[callbackName] = function(arg){
		var callback = config.callback;
		callback(arg);
		script.loaded = true;
	}

	head = document.getElementsByTagName("head")[0];
	head.insertBefore(script, head.firstChild) //chrome下第二个参数不能为null
	script.src = url;

	supportLoad = "onload" in script;
	onEvent = supportLoad ? "onload" : "onreadystatechange";

	script[onEvent] = function(){

		if(script.readyState && script.readyState !="loaded"){
			return;
		}
		if(script.readyState == 'loaded' && script.loaded == false){
			script.onerror();
			return;
		}
		//删除节点。
		(script.parentNode && script.parentNode.removeChild(script))&& (head.removeNode && head.removeNode(this));	
		script = script[onEvent] = script.onerror = window[callbackName] = null;

	}

	script.onerror = function(){
		if(window[callbackName] == null){
			console.log("请求超时，请重试！");
		}
		config.error && config.error();//如果有专门的error方法的话，就调用。
		(script.parentNode && script.parentNode.removeChild(script))&& (head.removeNode && head.removeNode(this));	
		script = script[onEvent] = script.onerror = window[callbackName] = null;
	}

	if(timeout!= 0){
		setTimeout(function() {
			if(script && script.loaded == false){
				window[callbackName] = null;//超时，且未加载结束，注销函数
				script.onerror();				
			}
		}, timeout);
	}

}