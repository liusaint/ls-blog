//在新窗口打开
var a = {
	aBlank:function(){		
		var aDoms = document.getElementsByTagName('a');
		var len = aDoms.length;
		for (var i = 0; i < len; i++) {
			aDoms[i].setAttribute("target","_blank")
		}
	}
}	

a.aBlank();
//有些网页是用ajax加载很多内容出来，里面包装a标签。所以设置一个定时器。定期执行。
var timer = setInterval(function(){
	a.aBlank();
}, 1500);

