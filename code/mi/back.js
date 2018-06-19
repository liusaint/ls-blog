//1.核对时间。与互联网时间同步。
//2.处于登录状态。




var app = {
	timer: '',
	init: function() {
		this.setTimer();
	},
	setTimer: function() {
		this.timer && clearTimeout(this.timer);
		try {
			//这里就没有做具体哪个页面的判断了。暂时不会相互影响。
			
			//详情页面做的事
			this.detailFn();
			//中间页，进入购物车
			this.goCart();
			//购物车页面
			this.cartFn();
			//提交订单页面。
			this.orderFn();
		} catch (e) {
			// 还没加载出来
		}
		this.timer = setTimeout(this.setTimer.bind(this), 30);
	},
	//商品页面做的事情
	//在选项加载出来之后选择然后不断点击加入购物车。
	detailFn() {

		//关闭可能的弹窗
		$(".modal-body .btn.btn-primary:visible").each(function(index, el) {
			el.click();
		});
		$("#J_miAlertConfirm")[0] && $("#J_miAlertConfirm")[0].click();


		//版本 128g
		var levelDom = $(".J_step.pro-choose[data-index=0] ul>li").eq(1)[0];
		//颜色 白色
		var colorDom = $(".J_step.pro-choose[data-index=1] ul>li").eq(1)[0];
		//保险。不选保险了。非必要项。碎屏险可以补买的。
		// var safeDom = $(".J_service.pro-choose[data-index=0] ul>li").eq(1)[0];
		//当这几个都加载出来的时候才执行点击加入。避免购物车页面出现多项商品。
		if (levelDom && colorDom ) {
			levelDom.click();
			colorDom.click();
			// if (!$(safeDom).hasClass('active')) {
			// 	safeDom.click();
			// }
			//点击加入购物车
			$("#J_buyBtnBox a")[0] && $("#J_buyBtnBox a")[0].click();
		}


	},
	//跳转到购物车页面
	goCart() {

		if ($(".J_actBox a:contains('去购物车结算')")[0]) {
			$(".J_actBox a:contains('去购物车结算')")[0].click();
			//观察到卡了一s在这里，所以加上这一句，上面那句其实就没有用了。
			location.href = 'https://static.mi.com/cart/';
			//跑一个错误，中断线程。不再生成定时器。
			throw new Error('abc');
		}
	},
	//购物车页
	//第一个页面可能发了多次加入购物车的请求。 所以在这个页面要把多余的项以及数量删除。
	cartFn() {
		//阻止弹窗,避免阻断流程
		window.alert = function(){}
		//购物车中有大于1件商品，删除
		$("#J_cartListBody .item-box:gt(0)").find(".J_delGoods").each(function(index, el) {
			el.click();
			//确认删除按钮
			$("#J_alertOk")[0] && $("#J_alertOk")[0].click();

		});
		//确认删除按钮
		$("#J_alertOk")[0] && $("#J_alertOk")[0].click();
		var interval = 0;
		//将每一条的数量减少到1。
		$(".J_minus").each(function(index, el) {
			//数量不为1就减少。
			//不能用这个while。因为input中的值是异步减少的。
			if ($(el).next('input').val() != 1) {
				interval = 200;
				el.click();
				el.click();
				el.click();
				el.click();
			}
		});
		//去结算。因为上面的数量减少操作是异步的。所以这里设置一个延时，让上面的操作生效之后再进行这个操作。
		setTimeout(function() {
			$("#J_goCheckout")[0] && $("#J_goCheckout")[0].click();
		}, interval);
		//到了购物车页面甚至下订单的页面依然可能会出现售罄的情况。这个时候不要放弃，重新刷新购物车页面继续进行操作。还是有可能刷到的。
		if ($('h3:contains(抱歉，以下商品已经失效或者暂时售罄):visible').length > 0||$('a:contains(到货提醒):visible').length > 0||$("dt:contains(选中的商品已经全部失效或者暂时售罄):visible").length>0||$("#J_goCheckout").hasClass('btn-disabled')) {
			//避免请求太过频繁。
			setTimeout(function() {
				location.href = 'https://static.mi.com/cart/';
			}, 500)

		}

	},
	//选地址，下单页面
	orderFn() {
		if (document.querySelector('.J_addressItem')) {
			document.querySelector('.J_addressItem').click();
			document.querySelector("#J_checkoutToPay") && document.querySelector("#J_checkoutToPay").click();
		}
		$("button:contains(确定):visible").click();
		$(".modal-backdrop:visible").remove();
	}
}

app.init();