/* 
 * 功能说明：
 * 1.把所有关注的问题列出来。
 * 2.给所有的问题添加取消关注按钮并完成取消关注。
 * 
 * author: 841766635@qq.com
 * date: 20180120
 */

var ZhiHu = {
	htmlArr: [], //保存每一页的问题的html数据。
	pageItems: {}, //保存每一页的数量。
	INTEVAL: 2000, //翻页的时间间隔。
	timer: '', //定时器
	//初始化。
	init: function() {
		var that = this;
		//绑定滚动事件。当页面滚动了就可以开始请求下一页的数据了。
		$(window).on('scroll', this.scrollFn.bind(this));
		//初始调用。
		this.scrollFn();

		//给我们添加的按钮绑定事件。
		$("body").on("click", '.del-q', function(event) {
			that.delQ($(this));
		});
	},
	//取消关注。拼装url，发送delete请求。
	//需要拼装的url接口格式：https://www.zhihu.com/api/v4/questions/20008370/followers
	delQ: function(jqObj) {		

		var questionUrl, matchArr, delUrl, questionId;

		//问题页面链接
		questionUrl = jqObj.siblings('.QuestionItem-title').find('a').attr('href');
		if (!questionUrl) {
			return;
		}

		//正则匹配问题id
		matchArr = questionUrl.match(/\d+/);
		if (matchArr) {
			questionId = matchArr[0];
		}

		delUrl = 'https://www.zhihu.com/api/v4/questions/' + questionId + '/followers';

		$.ajax({
			url: delUrl,
			type: 'delete',
			success: function(data) {
				//成功的话删除该列。
				jqObj.closest('.List-item').remove();
			}
		})

	},
	//页面滚动时触发的事件。
	scrollFn: function(event) {
		var that = this;
		//滚动条滚动时会多次调用此方法，拦截掉。
		if (this.timer) {
			return;
		}
		this.timer = setTimeout(function() {
			//页面内容提取
			that.saveData();

			//如果有下一页，模拟点击。
			if ($(".PaginationButton-next").length > 0) {
				$(".PaginationButton-next")[0].click();
				//移动到底部。
				that.scrollBottom();
			} else {
				//到了最后一页了。最后的数据处理。
				that.mergeList();
				//解绑事件
				$(window).off('scroll');
			}

			clearTimeout(that.timer);
			that.timer = '';
		}, this.INTEVAL)

	},
	//从页面中提取问题html数据与每页的数量。
	saveData: function() {
		var html = $(".List-header+div").prop('outerHTML');
		this.htmlArr.push(html);
		//当前页面的问题数量
		this.pageItems[$('.PaginationButton--current').text()] = $('.List-item').length;
	},
	//数据收集完成后对列表的处理。
	mergeList: function() {
		var html = this.htmlArr.join('');
		//组装所有页的数据到一页。
		$(".List-header+div").html(html);
		//移除分页
		$(".Pagination").remove();
		//给每个问题添加取消关注按钮
		$(".ContentItem-title").append('<button class="del-q" style="float:right;color:#1388ff;">取消关注</button>');
		//把每页的数量打出来看一下，发现并不是每页都是20条数据。
		top.console.log(this.pageItems);
	},
	//滚动到底部
	scrollBottom: function() {
		var h = $(document).height() - $(window).height();
		$(document).scrollTop(h);
	},

}

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		if (request.greeting == "hello") {
			ZhiHu.init();
		}
	}
);