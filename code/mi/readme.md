### 使用chrome浏览器插件抢小米8

#### 起因
最近准备换手机，作为路痴喜欢小米8的双频gps功能，就决定抢一部。结果抢是抢不到的，从黄牛那里买也是不可能的。那就发挥一下程序员的优势，写个浏览器插件来抢吧。

浏览器插件，通常用于在别人的网站上运行我们自己的代码，做一些固定的操作，写浏览器插件，先要明确2点：\
1.我们的目的是什么。要达成什么。\
2.网站的操作流程是什么。

#### 分析与准备
我们要快人一步。从选择我们想要的型号，配置，到下单都要比别人快。代码的反应速度是比人快的，这是程序的优势，我们可以第一时间去点相关的按钮。不用移动鼠标，让代码帮我们点，不断地点。然后后续操作，一直到订单生成。完全不用自己动手操作。


分析了天猫，京东和小米商城。决定在小米商城上面抢。一来是因为它是小米自己的平台，二来也是因为它没有验证码，代码写起来比较简单。


熟悉抢购流程。首先找了一些抢购小米的视频来看。然后对比了一下米8的购买页面和小米商城其它一些现货出售的购买页面。
发现流程与dom结构基本上是一样的。购买流程也差不多的。

小米商城抢购的基本流程如下：
* 商品详情页。倒计时，时间到了出现加入购物车按钮。
* 加入购物车成功页。一个成功提示的页面。可以点击跳转到购物车页面。
* 购物车页。核对产品，有确定按钮可进入下一个页面。
* 订单确认页。选择地址，收货时间等信息，然后确定生成订单。

第4个页面点确定，订单生成成功，我们的小米就算是抢到了！

经过观察发现从第一个页面到第四个页面，都是可以让代码全自动完成的。也就是说如果顺利的话，在1s内跳转过4个页面到生成订单是完全可能的。


#### 代码逻辑：
* 商品详情页。\
等待手机颜色，手机配置异步加载出来。然后代码click想要购买的颜色，配置。\
配置信息选择好之后，不断点击 加入购物车 处的按钮。抢购时间一到，就能成功发请求到后台。正式抢购的时候可能会有排队弹窗。\
但是我们还在不停地点击。所以可能会发多次请求到后台。
在代码的帮助下，我们很大概率能顺利加入购物车。并且加入购物车的可能不只一台。
* 加入购物车成功页。\
检测到包含“去购物车结算”几个字的链接的话就点击它。或直接跳转到购物车页面。
* 购物车页面。\
由于商城的限制，小米8其实只能抢一台。但是我们加入购物车的可能不只一台。这个时候直接点确认就不会成功，会弹出错误提示。所以在我们点击进入下一个页面的按钮之前，要先把本页多余的商品，和多的数量去掉。\
多的商品，点删除按钮，会二次确认。点减少数量的按钮，也是异步操作。所以如果进行了上面两个减少操作，我们需要一个大概200ms的延迟之后再去点击这个页面的确认按钮。\
另外，实际的抢购流程，即使走到购物车这一步，也很大概率是抢不到的。提交的时候会发请求检测后台库存，如果买完了，页面上也会有反应，比如确认按钮点不了了。\
这个时候，我们不能放弃。一是因为系统这么繁忙的情况下给的数据不一定是对的。二是，有些人可能抢到没有及时付款，后台就又有货了。
所以一旦检测到“商品已经失效或者暂时售罄”的提示。立马刷新购物车页面。这样很大概率能进入到第4个页面去。
事实上我写这个插件，也是遇到进入购物车但是没有货的情况下临时加上去检测和刷新操作。最终能一次成功，这个临时修改是关键。
* 订单确认页\
到了订单确认页。用代码点击收货地址。然后点击这个页面的确认按钮。 也可能遇到提示“商品已经失效或者暂时售罄”。这个时间立马跳转到购物车页面，重复上一步。
不过这个页面有时候 会弹出一个alert提示，阻断脚本运行。点确定，就可能显示订单成功。这个时候就可以付款了。


找一个现货商品测试，脚本。一进页面就开始，瞬间跑完流程下好单。大体流程无误。


#### 其它准备工作：
* windows系统时间同步。
* 小米商城账号处于登录状态。
* 提前把收货地址填上。到时候才可以直接选。


#### 核心代码：
```
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
            //  safeDom.click();
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
```

成功用浏览器插件抢到小米8白色128g版。上午10点抢到，下午2点多就收到了。手机非常满意。 

另外，这种抢购网站前端是不是应该做一些防重复点击的验证。抢购的时候 服务器的压力也小一些。

插件地址：https://github.com/liusaint/ls-blog/tree/master/code/mi