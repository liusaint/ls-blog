/* 
 * 功能说明：
 * 1.把关注的房子里已成交的隐藏。
 * 2.快速点击一键选房。以及弹出的确认框
 * 
 * author: liusaint@gmail.com
 * date: 20180314
 */

var eHouse = {

	timer: '', //定时器
	//初始化。
	init: function() {
		var that = this;		
	},
	//隐藏已成交的项。
	hideTrs:function(){
		$('table tr :contains(已成交)').closest('tr').hide();
	},
	//设置按钮
	setClick:function(){
		var that = this;
		this.timer = setTimeout(function(){
			console.log(1);
			clear(this.timer);
			that.setClick();
		})
	}


}

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		if (request.greeting == "hide") {
			eHouse.hideTrs();
		}else if(request.greeting == "click"){
			eHouse.setClick();
		}
	}
);