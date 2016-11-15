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


