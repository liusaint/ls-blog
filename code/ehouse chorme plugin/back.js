/* 
 * 功能说明：
 * 1.把关注的房子里已成交的隐藏。
 * 2.快速点击一键选房。以及弹出的确认框
 * 
 * author: liusaint@gmail.com
 * date: 20180314
 */

 var eHouse = {


	beginTime: '2018-03-21 10:00:00',
	//初始化。
	init: function() {
		var that = this;
	},
	//隐藏已成交的项。
	hideTrs: function() {
		// $('table tr :contains(已成交)').closest('tr').hide();
	},

	//提前1s钟刷新页面。
	refresh: function() {

		var interVal = 100;
		var notStarted = $('.add_price_start:visible');
		if(notStarted.length == 0 ){
			interVal = 1000;
		}else{
			

			var now = new Date().getTime();
			var beginTime = new Date(this.beginTime).getTime();
			var timeDiff = beginTime - now;
			if (timeDiff < 300 && timeDiff>0) {
				$("#pageslideRefresh")[0].click();
				//刷新
				interVal = 2000;
			}

		}

		this.rTimer && clearTimeout(this.rTimer);
		this.rTimer = setTimeout(this.refresh.bind(this), interVal);
		// console.log('refresh')

	},
	//设置按钮
	setClick: function() {
		var that = this;
		var interVal = 5;

		var thePage = $("li.selected a:contains(房源)").length > 0;

		btn_group = $("#btn_group").find("a:visible");

		var class_confirm = document.getElementsByClassName('btn btn-default btn-primary');

		var btnVisible = btn_group.length > 0

		//按钮存在，可见。  没有确定按钮选择。 点击。
		//如果点击的不是即将开始。延迟1500执行。
		if (btnVisible && thePage && class_confirm.length < 1) {
			btn_group[0].click();
			if(!$(btn_group[0]).hasClass('add_price_start')){
				interVal = 1500;
			}			
		}

		this.timer && clearTimeout(this.timer);
		this.timer = setTimeout(this.setClick.bind(this), interVal);
		// console.log('setClick')

	},
	//不断检测是否有确定按钮。如果就点击。
	//如果点到了就休息一s。这个是一进去就运行的。
	//反正只要检测到确定就点就是了。
	setConfirmClick: function() {
		var that = this;
		var interVal = 5;

		var class_confirm = document.getElementsByClassName('btn btn-default btn-primary');
		var page = $("li.selected a:contains(房源)").length > 0;
		if (page && class_confirm && class_confirm[0]) {
			//加一个保险。加价那种不自动选择。
			if($(":contains(您确定要加价吗)").length<1 && $(":contains(封顶价格)").length<1){
				class_confirm[0].click();
				interVal = 1000;
			}

			// console.log('666');

		} 

		this.cTimer && clearTimeout(this.cTimer);
		this.cTimer = setTimeout(this.setConfirmClick.bind(this), interVal);
		// console.log('confirm')



	}


}



chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		if (request.greeting == "hide") {
			eHouse.hideTrs();
		} else if (request.greeting == "click") {
			eHouse.setConfirmClick();
			eHouse.setClick();
			eHouse.refresh();
		}else if(request.greeting == 'all'){
			eHouse.hideTrs();
			eHouse.setConfirmClick();
			eHouse.setClick();
			eHouse.refresh();
			console.log('run')
		}


	}
	);