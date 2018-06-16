//1.核对时间
//2.将系统时间提前10s。


var app = {
	timer: '',
	init: function() {
		this.setTimer();
	},
	setTimer: function() {
		this.timer && clearTimeout(this.timer);
		try {
			this.detailFn();
			this.goCart();
			this.cartFn();
			this.orderFn();
		} catch (e) {
			// 还没加载出来
		}
		this.timer = setTimeout(this.setTimer.bind(this), 30);
	},
	//商品页面做的事情
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
		//保险 
		var safeDom = $(".J_service.pro-choose[data-index=0] ul>li").eq(1)[0];
		//当这几个都加载出来的时候才执行点击加入。避免购物车页面出现多项商品。
		if (levelDom && colorDom && safeDom) {
			levelDom.click();
			colorDom.click();
			if (!$(safeDom).hasClass('active')) {
				safeDom.click();
			}
			//点击加入购物车
			$("#J_buyBtnBox a")[0] && $("#J_buyBtnBox a")[0].click();
		}


	},
	//跳转到购物车页面
	goCart() {

		if ($(".J_actBox a:contains('去购物车结算')")[0]) {
			$(".J_actBox a:contains('去购物车结算')")[0].click();
			//观察到卡了一s在这里，所以加上这一句
			location.href = 'https://static.mi.com/cart/';
			//跑一个错误，避免再次执行上面那一句。 
			throw new Error('abc');
		}
	},
	//购物车页面的事情 
	cartFn() {
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
		//去结算
		setTimeout(function() {
			$("#J_goCheckout")[0] && $("#J_goCheckout")[0].click();
		}, interval);
		//如果检测到这句话就刷新购物车页面。
		//因为系统问题或者
		if ($('h3:contains(抱歉，以下商品已经失效或者暂时售罄):visible').length > 0) {
			setTimeout(function() {
				location.reload();
			}, 500)

		}

	},
	//选地址，下单页面
	orderFn() {
		if (document.querySelector('.J_addressItem')) {
			document.querySelector('.J_addressItem').click();
			document.querySelector("#J_checkoutToPay") && document.querySelector("#J_checkoutToPay").click();
		}
	}
}

app.init();