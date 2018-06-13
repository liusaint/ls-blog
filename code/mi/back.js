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
		this.timer = setTimeout(this.setTimer.bind(this), 50);
	},
	//商品页面做的事情
	detailFn() {
		//选择版本 
		$(".J_step.pro-choose[data-index=0] ul>li").eq(1)[0] && $(".J_step.pro-choose[data-index=0] ul>li").eq(1)[0].click();
		//选择颜色
		$(".J_step.pro-choose[data-index=1] ul>li").eq(0)[0] && $(".J_step.pro-choose[data-index=1] ul>li").eq(0)[0].click();
		//选择保险 
		if (!$(".J_service.pro-choose[data-index=0] ul>li").eq(1).hasClass('active')) {
			$(".J_service.pro-choose[data-index=0] ul>li").eq(1)[0] && $(".J_service.pro-choose[data-index=0] ul>li").eq(1)[0].click();
		}

		//点击按钮
		$("#J_buyBtnBox a")[0] && $("#J_buyBtnBox a")[0].click();
		$("#J_miAlertConfirm")[0] && $("#J_miAlertConfirm")[0].click();
	},
	//跳转到购物车页面
	goCart(){
		$(".J_actBox a:contains('去购物车结算')")[0]&&$(".J_actBox a:contains('去购物车结算')")[0].click();
	},
	//购物车页面的事情 
	cartFn(){
		//购物车中有大于1件商品，删除
		$("#J_cartListBody .item-box:gt(0)").find(".J_delGoods").each(function(index, el) {
			el.click();
			//确认删除按钮
			$("#J_alertOk")[0]&&$("#J_alertOk")[0].click();

		});
		//确认删除按钮
		$("#J_alertOk")[0] && $("#J_alertOk")[0].click();
		//将每一条的数量减少到1。
		$(".J_minus").each(function(index, el) {
			el.click();
			el.click();
			el.click();
			el.click();
			el.click();
		});
		//去结算
		$("#J_goCheckout")[0] && $("#J_goCheckout")[0].click();
	},
	//选地址，下单页面
	orderFn(){
		if(document.querySelector('.J_addressItem')){
			document.querySelector('.J_addressItem').click();
			document.querySelector("#J_checkoutToPay") && document.querySelector("#J_checkoutToPay").click();
		}
	}
}

app.init();