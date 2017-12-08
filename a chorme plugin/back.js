function init(){
	var aFn = function(){
				var aDoms = document.getElementsByTagName('a');
		var len = aDoms.length;
		for (var i = 0; i < len; i++) {
			aDoms[i].setAttribute("target", "_blank")
		}
	}
	var timer = setTimeout(aFn, 5000);
	aFn();

	var cd = new CD;
	$("div.header").remove();
	cd.init();
	
}



function CD(){

}

CD.prototype = {
	init:function(){
		this.open();
		this.hideItems();
		this.bindEvent();
	},
	open:function(){
		//所有a标签新标签打开
		$("td a").attr('target','_blank');
		//给每一行加一个我们的按钮。
		$(".s-hide").remove();
		$("tr.text-center td:last-child").append('<span class="s-hide" style="margin:0 5px;cursor:pointer;">隐藏</span>');
		$("tr th:last").width(170);
		//给tr加上id。方便操作
		$("tr").each(function(index, el) {
			$(this).attr('data-id',$(this).find("input:checkbox").val());
		});


var host = location.host;

		//阮一峰　页面的广告屏蔽,留言屏蔽
		if(host ==  'www.ruanyifeng.com'){
	
			$("#sup-post-2").remove();
			$("#related_entries").remove();
			$("#gd1").remove();
			$("#comments").remove();
		}

		//知乎广告屏蔽,内容区扩大。
		if(host ==  'www.zhihu.com'){
			//删除右边栏。广告，推荐。
			$(".Question-sideColumn").remove();
			// 扩大内容区
			$(".Question-mainColumn").width('100%');
		}
		
	},
	bindEvent:function(){		
		//点击隐藏。
		$("body").on('click', '.s-hide', function(event) {
			
			var id = $(this).parents('tr').find("input:checkbox").val();
			var hideStr = localStorage.hideStr || '';
			var hideArr = hideStr.split("-");
			hideArr.push(id);
			localStorage.hideStr = hideArr.join("-");
			$(this).parents("tr").hide();
		});
	},
	//初始化的时候隐藏我们隐藏过的。
	hideItems:function(){
		var hideStr = localStorage.hideStr || '';
		var hideArr = hideStr.split("-");
		var len = hideArr.length;
		for (var i = 0; i < len; i++) {
			$("tr[data-id="+hideArr[i]+"]").hide();
		}
	},
	//显示隐藏的。
	show:function(){
		localStorage.hideStr = '';
		$("tr").show();
	}
}





chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		//console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
		if (request.greeting == "hello"){
			init();
			// sendResponse({farewell: "goodbye"});
		}else{
      		// sendResponse({});
      	}
      });
