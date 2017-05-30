/**
 * 全局配置文件
 * */
var IMGURL = '/images/', RESOURCEURL = '';
window.config = {
    changeExp: true,
    uid: 0,
    opacity : .6,
    showTipClose : true,
    artDialog : {
        width : '264px',
        height : 'auto'
    },
    ajaxTimeout : 60000,
    canSendAjax : true,
    zindex : 2000,
    closeTime: 2500,
    groupPageNum: 12, //鹰群翻页 每页条数
    uploadArr:[]
};




;$.extend({
    
    jQInArray: function(obj, arr){
        var result = -1;
        if($.isArray(arr)){
            for(var i = 0, len = arr.length; i<len; i++){
                if(obj.is(arr[i])){
                    result = i;
                    return result;
                }
            }
        }
        return result;
    },
    
    /**
     * 获取url 参数
     * @param name 参数名
     * @return 返回参数值
     * @author heqh
     */
    getUrlParam: function(name) {
        var qs = (location.search.length > 0 ? location.search.substring(1) : '');
        var items = qs.length ? qs.split('&') : [];
        var args = {};
        var item = null;
        var name_ = null;
        var value = null;
        len = items.length;
        for ( var i = 0; i < len; i++) {
            item = items[i].split('=');
            name_ = decodeURIComponent(item[0]);
            value = decodeURIComponent(item[1]);
            args[name_] = value;
        }
        return args[name];
    },
    
    /**
    * 设置url参数
    * @param param 需要修改或者添加的参数名
    * @param value 需要修改或者添加的参数值
    * @return 返回新的url
    * @author heqh
    */
    setUrlParam: function(param, value) {  
        var strNewUrl = '';
        var defHref = window.location.href;  //原始URL
        var hostname;
        if(location.origin){
            hostname = location.origin + location.pathname;
        }else{
            hostname = location.protocol + "//" + location.hostname + (location.port ? ':' + location.port: '') + location.pathname;
        }
        if (defHref.indexOf("?") != -1) {
            defHref = defHref.substr(defHref.indexOf("?") + 1);
            if (defHref.toLowerCase().indexOf(param.toLowerCase()) == -1) {
                strNewUrl = hostname + '?' + defHref + "&" + param + "=" + value;
            } else {
                var aParam = defHref.split("&");
                for (var i = 0; i < aParam.length; i++) {
                    if (aParam[i].substr(0, aParam[i].indexOf("=")).toLowerCase() == param.toLowerCase()) {
                        aParam[i] = aParam[i].substr(0, aParam[i].indexOf("=")) + "=" + value;
                    }
                }
                strNewUrl = hostname + '?' + defHref.substr(0, defHref.indexOf("?") + 1) + aParam.join("&");
            }
        } else {
            strNewUrl = hostname + "?" + param + "=" + value;
        }
        return strNewUrl;
    },
    
    /*切图  
     * <li class="imgbox"><img /></li>
     * 调用  $.imgCut('.imgbox');
     * */
    imgCut: function(selecter){
        $(selecter).each(function(i, item){
            var box = $(item);
            var img = box.find('img');
            if(img.length == 0){
                return;
            };
            img[0].onload = function(){
                var boxW = box.width(),
                boxH = box.height(),
                imgH = img.height(),
                imgW = img.width();
                if(imgH >= imgW){  //长图
                    img.css({
                        'width': boxW
                    })
                }else{
                    img.css({
                        'height': boxH
                    })
                };
            }
        })
    },

     /**
     * 表单序列化
     * formJq form(不是form可以转成form取值)的jquery对象 返回 一个json
     * */
     formSerializeFn: function(formJq) {
        if(!formJq ||formJq.length == 0){
            return {};
        }
        var formJq_;
        if(formJq[0].tagName != 'FORM'){
            formJq_ = $('<form></form>');
            formJq_.html(formJq.clone());
        }else{
            formJq_ = formJq;
        };
        var result = {};
        formJq.find('input[name]:not([type="radio"]):not([type="checkbox"]), select[name], textarea[name]').each(function(index, dom){
            var name = $(this).attr('name');
            if(name.match(']') && $(this).val().trim() != ''){
                result[name] ? result[name].push($(this).val()) : result[name] = [$(this).val()];
            }else{
                if(!name.match(']')){
                    result[name] = $(this).val();
                }
            }

        });
        formJq.find('input[type="radio"]:checked').each(function(index, dom){
            var name = $(this).attr('name');
            result[name] = $(this).val();
        });
        formJq.find('input[type="checkbox"]:checked').each(function(index, dom){
            var name = $(this).attr('name');
            result[name] = '1';
        });
        return result;
     },
     
          checkVal: function(val, type) {
        var reg = {
            email : /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            email_ : /(^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)+|(^$)/, 
            password : /^[\w]{6,20}$/,
            cas : /^\d{1,}-\d{1,}-\d{1,}$/,
            ch : /^[\u4e00-\u9fa5]+$/,
            en : /^[a-zA-Z]+$/,
            num : /^\d/,
            num_:/(^\d)+|(^$)/,
            username : /^[a-zA-Z0-9_.@-]{1,}$/,
            noempty : /\S/,
            name : /^[\u4e00-\u9fa5a-zA-Z0-9]{1,}/,
            expression : /\w*\.\w{3,}/,
            tel_:/(\d{3}-\d{8}|\d{4}-\d{7})+|(^$)/, //只有电话
            phone : /(^(\d{3,4}-)?\d{7,8})$|(^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$)/, //手机号和电话
            phone_ : /(^(\d{3,4}-)?\d{7,8})$|(^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$)+|(^$)/, //手机号和电话
            sj_:/^(((13[0-9]{1})|15[0-9]{1}|18[0-9]{1})+\d{8})$/, //只有手机号
            code : /^[0-9]{6}$/, //邮编
            code_ : /(^[0-9]{6}$)+|(^$)/, //邮编
            fax : /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/, //传真
            fax_ : /(^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$)+|(^$)/, //传真
            float : /^\d+(\.\d+)?$/,
            str: /[^|#\`\^\&\(\)<>\?:"\{\},\.\\\/;'\[\]]+$/, //字符串
            str_: /([^|#\`\^\&\(\)<>\?:"\{\},\.\\\/;'\[\]]+$)+|(^$)/, //字符串
            purity: /^((\d+\.?\d*)|(\d*\.\d+))\%$/, //百分百数字
            QQ : /^\d{5,11}$/,
            QQ_ : /(^\d{5,11}$)+|(^$)/
        }
        if(!reg[type]){
            console.log('判断类型不存在');
            return;
        }
        var result = reg[type].test(val);
        return result;
    },

    /**
     * 验证 方法
     * @JQobj 需要被验证的 form （可以是div 外部大盒子）
     * @result 验证结果 false表示不通过
     * 例子 <input check="QQ" /> 
     var data = $.validateFn($('form'));
     data.result  true false;
     data.obj  [input, input];
     * */
     validateFn: function(JQobj, callback){
        var result = true,
        inputObj = [];
        JQobj.find('input[check]').each(function(index, ele) {
            var obj  = $(ele),
            type = obj.attr("check");
            //必填
            if(obj.hasClass("required")){
                //非空判断
                if(!obj.val() || (type && !$.checkVal(obj.val(), type))){
                    result = false;
                    obj.addClass('error');
                    inputObj.push(obj);
                } 
                //如果为空但有验证格式(值不为空)               
            }else if(obj.val() && !$.checkVal(obj.val(), type)){
                result = false;
                obj.addClass('error');
                inputObj.push(obj);
                //如果为空但有验证格式(值不为空)    
            }else if(type && !$.checkVal(obj.val(), type)){
                result = false;
                obj.addClass('error');
                inputObj.push(obj);
            }

        });

        if(result && callback && $.isFunction(callback)){
            callback();
        }
        /*return {
            result: result,
            obj: inputObj
        };*/
        return $.valiField(JQobj,result,inputObj);
    },
    //验证表单
    valiField:function(frm,result,inputObj){
        frm.find(".errorMsg").html("");
        //console.log(JSON.stringify(result));
        if(!result){
            for (var i = inputObj.length - 1; i >= 0; i--) {
                var o = $(inputObj[i]);
                var msg = o.attr("msg")+"必填";
                if(o.hasClass("required") && o.attr("check")){
                    if(o.val()){
                        msg = o.attr("msg")+"格式错误";
                    }
                }
                if(!o.hasClass("required") && o.attr("check")){
                    msg = o.attr("msg")+"格式错误";
                }                   
                o.next().html(msg);                 
            }
        }
        return result;
    },



    /**
        页面滚动 到当前对象显示的时候 
        @param obj滚动目标位置到的  jqueyr对象
        @callback 滚动到目标后 会掉函数 function
        @author heqh
    */
    scrollOnObj: function(obj, callback){
        if(obj.length == 0 || !obj){
            return;
        }
        if(topPosition()){
            if(obj.attr('scrollload')){
                return;
            }
            obj.attr('scrollload', 'true');
            callback && $.isFunction(callback) ? callback() : ''; 
            return ;
        }
        $(window).scroll(function(){
            if(obj.attr('scrollload')){
                return;
            }
            if(topPosition()){
                obj.attr('scrollload', 'true');
                callback && $.isFunction(callback) ? callback() : ''; 
                return ;
            }
        });
        function topPosition(){
            return $.getScrollTop() >= obj.offset().top - obj.outerHeight();
        }
    },
    
    /**
     * Rsa加密字符串
     * 
     * @param text 要加密的字符串
     * @param publicKey 公钥
     * @return string
     */
    rsaEncrypt: function(text, publicKey) {
        if (!publicKey) {
            publicKey = c.publicKey;
        }
        setMaxDigits(publicKey.length / 2 + 3);
        var key = new RSAKeyPair('10001', '', publicKey); // 10001 => e的十六进制
        return encryptedString(key, text);
    },
    
    /**
     * 弹出自定义内容
     * */
    popContent: function(con, title, okCallback, loadCallback){
        $('.pop_modal_submit').removeAttr('style');
        var modal = $('.pop_modal').modal('show');
        modal.find('.modal-body').html(con||'');
        modal.find('.alert_title').html(title||'');
        okCallback ? $('body').off('click.pop_modal_submit').on('click.pop_modal_submit', '.pop_modal_submit', function(){
            okCallback();
        }) : '';
        modal.off('shown.bs.modal').on('shown.bs.modal', function(){
            loadCallback && $.isFunction(loadCallback) ? loadCallback() : ''; 
        });
        $('.pop_modal').on('.hide.bs.modal', function(){
            $('body').off('click.pop_modal_submit');
        });
    },
    
    /**
     * 页面滚动到目标
     * @author heqh
     * */
    scrollTo: function(obj){
        var top = obj.offset().top;
        $(window).scrollTop(top);
    },
    
    /**
     * 鼠标经过延时加载
     * @author heqh
     * */
    hoverTimeDelayFun : function(select,_item,overCallback,levelCallback, time){
        var time = time || 500, overTimeFun, levelTimeFun;
        $('body').on('mouseover',select+':not(.stop)',function(){
            var obj = $(this);
            overTimeFun?clearTimeout(overTimeFun):'';
            levelTimeFun?clearTimeout(levelTimeFun):'';
            overTimeFun = setTimeout(function(){
                overCallback&&$.isFunction(overCallback)? overCallback(obj):'';
            },time)
        }).on('mouseover',_item,function(){
            levelTimeFun?clearTimeout(levelTimeFun):'';
        });

        $('body').on('mouseout',select+':not(.stop)',function(){
            overTimeFun?clearTimeout(overTimeFun):'';
            levelTimeFun?clearTimeout(levelTimeFun):'';
            levelTimeFun = setTimeout(function(){
                levelCallback&&$.isFunction(levelCallback)? levelCallback():'';
            },time)
        }).on('mouseout',_item,function(){
            overTimeFun?clearTimeout(overTimeFun):'';
            levelTimeFun?clearTimeout(levelTimeFun):'';
            levelTimeFun = setTimeout(function(){;
                levelCallback&&$.isFunction(levelCallback)? levelCallback():'';
            },time)
        });
    },

    /**
     * jquery 对象obj 定位到的对象
     * vertical : bottom top
     * horizontal : left right
     * 
     * */
    followTip: function(obj, con, autoclose, vertical, horizontal) {
        var left = obj.offset().left;
        var top = obj.offset().top;
        if ($('.follow_tip').length > 0) {
            $('.follow_tip').remove();
            autoclose && timer ? clearTimeout(timer) : '';
        }
        console.log(vertical);
        var html = $('<div class="follow_tip '+(vertical||"")+ ' ' +(horizontal||"")+'">' + con + '</div>');
        $('body').append(html);
        
        if(vertical == 'bottom'){  //浮层位于目标下面
            html.css({
                left: left,
                top: top + obj.outerHeight(true)
            });
        }else{
            html.css({
                left: left,
                top: top - html.outerHeight(true)
            });
        }
        
        
        var timer;
        if (autoclose) {
            timer = setTimeout(function () {
                $('.follow_tip').remove();
                clearTimeout(timer);
            }, config.closeTime);
        }
        return html;
    },
    
    /**
     * 动态加载css
     * @author heqh
     * */
    loadCss: function(url){
        var html = '<link href="/css/'+ url+'" type="text/css" rel="stylesheet" />';
        $(document.head).append(html);
    },
    
    /**
     * 动态加载css
     * @author heqh
     * */
    loadJs: function(url){
        var html = '<script src="/js'+url+'"></script>';
        $(document.head).append(html);
    },
    
    /**
     * loading状态
     * @author heqh
     * @param loadObj（可选） 显示 loading的对象 没有就为body
     */
    loading: function(loadObj) {
        var loadObj = loadObj ? loadObj : $('body');
        var w = loadObj.outerWidth() + 'px';
        var style = '';
        if (loadObj[0] == document.body) {
            h = $.getWindowH() + 'px';
            style = "position: fixed;"
        } else {
            loadObj.addClass('load_relative');
            h = loadObj.outerHeight() + 'px';
            style = "position: absolute;"
        }
        var html = '<div class="loading_box" style="' + style + 'width: ' + w + ';height: ' + h + '; line-height: ' + h + '"><img src="' + IMGURL + 'small_load.gif" /> 努力加载中...</div>'
        loadObj.prepend(html);
    },
    
    /**
     * 关闭 loading
     * @author heqh
     * @param loadObj（可选）
     */
    closeLoading: function(loadObj) {
        var loadObj = loadObj || $('body');
        loadObj.find('.loading_box').remove();
        loadObj.removeClass('load_relative');
    },
    
    /**
     * @author heqh 
     * @return 窗口的宽高
     */
    getWindowH: function() {
        var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        return h;
    },
    getWindowW: function() {
        var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        return w;
    },
    
    /**
     * 获取滚动高度
     * @author heqh
     */
    getScrollTop: function() {
        var scrollTop, bodyScrollTop = 0, documentScrollTop = 0;
        if (document.body) {
            bodyScrollTop = document.body.scrollTop;
        }
        if (document.documentElement) {
            documentScrollTop = document.documentElement.scrollTop;
        }
        scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
        return scrollTop;
    },
    
    /**
     * 点击空白 (传入选择器之外的地方 执行回调函数)
     * @author heqh
     * @param target [] jquery选择器 在这些选择器范围内 不触发事件
     * @param Namespace命名空间
     */
    closeBlank: function(target, namespace, callback) {
        $('body').off('click'+namespace).on('click'+namespace, function(event) {
            var executeCallback = true;
            var len = target.length;
            var event = event ? event : window.event;
            var obj = event.srcElement ? event.srcElement : event.target;
            for ( var i = 0; i < len; i++) {
                if ($(obj).closest(target[i]).length > 0 || $(obj).parents().closest(target[i]).length > 0) {
                    executeCallback = false;
                }
            }
            if (executeCallback && callback) {
                callback();
            }
        });
    },
    
    /**
     * 获取文件大小
     * @author heqh
     * */
    getFileSize: function(target) {
        var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
        var fileSize = 0;
        if (isIE && !target.files) {
            var filePath = target.value;
            var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
            var file = fileSystem.GetFile(filePath);
            fileSize = file.Size;
        } else {
            fileSize = target.files[0].size;
        }
        return fileSize/1024/1024;
    },
    
    /**
     * 弹出提示语 没有title
     * @author heqh
     * */
    showAlert: function(str){
        clearTimeout(timer);
        var showTipClose = true;
        if($('.show_tip').length > 0){
            return;
        };
        $('body').append('<div class="show_tip">'+str+'</div>');
        $('.show_tip').css({
            'marginLeft' : $('.show_tip').outerWidth() / 2 * -1,
            'width': $('.show_tip').outerWidth()
        });
        $('.show_tip').on('closeTip', function(){
            $('.show_tip').remove();
            clearTimeout(timer);
        });
        var timer = setTimeout(function(){
            $('.show_tip').remove();
            clearTimeout(timer);
        }, config.closeTime);
        
        $.closeBlank(['.show_tip'], 'showtip', function(){
            clearTimeout(timer);
            $('.show_tip').remove();
        })
    },
    
    

    /**
     *@type string:  success error warning
     * */
    showContent: function(type, title, con, okfn, okvalue, closevalue){
        $('.follow_tip').remove();
        $('.alert_title').html(title);
        //var modal = $('.pop_modal').modal('show');
        var html = '<div class="modal_alert_box '+type+'"><i class="'+type+'"></i>' + con +' </div>';
        $('.pop_modal .modal-body').html(html);
        $('.pop_modal').modal('show', null, okvalue, closevalue);
        okfn ? $('body').off('click.pop_modal_submit').on('click.pop_modal_submit', '.pop_modal_submit', function(){         
            okfn();
        }) : '';
        $('.pop_modal').on('.hide.bs.modal', function(){
            $('body').off('click.pop_modal_submit');
        });
        
        if(!okfn){
            $('.pop_modal_submit').hide();
        }else{
            $('.pop_modal_submit').show();
        }
        
        
    },

    closeModal: function(){
        $('.modal ').modal('hide');
    },
    
    
    isInArray: function(val, arr){
        if(!arr){
            return false;
        }
        var len = arr.length;
        var result = false;
        if(len == 0){
            return result;
        }else{
            for(var i=0; i<len; i++){
                if(arr[i] == val){
                    result = true;
                    break;
                }
            }
        }
        return result;
    },
    
    /*
     * 监控回车  obj  需要监控回车发生区域的 jquery对象
     * callback 回车的回调函数
     * */
    enter: function(obj, callback){
        obj.on('keyup', function(event){
            var event = event? event: window.event;
            if(event.keyCode == 13 && $.isFunction(callback)){
                callback(obj);
            }
        })
    },
    
    /**
     * 切换
     * 板块选择器
     * */
    tabChange: function(JQtab){
        
    },
    
    confirm: function(con, callback){
        
    },
    
    /**
     * 删除cookie
     * 以_结尾的都是为非必填项
     * @param name 要删除的cookie名
     * @return void
     */
    delCookie : function(name, domain) {
        if (!$.checkVal(domain, 'noempty')) {
            domain = '';
        } else {
            domain = '; domain=' + domain;
        }
        document.cookie = name + '=;expires=' + (new Date(0)).toGMTString() + '; path=/' + domain;
    },
    
    checkVal: function(val, type) {
        var reg = {
            email : /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            password : /^[\w]{6,20}$/,
            cas : /^\d{1,}-\d{1,}-\d{1,}$/,
            ch : /^[\u4e00-\u9fa5]+$/,
            en : /^[a-zA-Z]+$/,
            num : /^\d/,
            num_:/(^\d)+|(^$)/,
            username : /^[a-zA-Z0-9_.@-]{1,}$/,
            noempty : /\S/,
            name : /^[\u4e00-\u9fa5a-zA-Z0-9]{1,}/,
            expression : /\w*\.\w{3,}/,
            tel_:/(\d{3}-\d{8}|\d{4}-\d{7})+|(^$)/, //只有电话
            phone : /(^(\d{3,4}-)?\d{7,8})$|(^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$)/, //手机号和电话
            phone_ : /(^(\d{3,4}-)?\d{7,8})$|(^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$)+|(^$)/, //手机号和电话
            sj_:/^(((13[0-9]{1})|15[0-9]{1}|18[0-9]{1})+\d{8})$/, //只有手机号
            code : /^[0-9]{6}$/, //邮编
            code_ : /(^[0-9]{6}$)+|(^$)/, //邮编
            fax : /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/, //传真
            fax_ : /(^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$)+|(^$)/, //传真
            float : /^\d+(\.\d+)?$/,
            str: /[^|#\`\^\&\(\)<>\?:"\{\},\.\\\/;'\[\]]+$/, //字符串
            str_: /([^|#\`\^\&\(\)<>\?:"\{\},\.\\\/;'\[\]]+$)+|(^$)/, //字符串
            purity: /^((\d+\.?\d*)|(\d*\.\d+))\%$/, //百分百数字
            QQ : /^\d{5,11}$/,
            QQ_ : /(^\d{5,11}$)+|(^$)/
        }
        if(!reg[type]){
            console.log('判断类型不存在');
            return;
        }
        var result = reg[type].test(val);
        return result;
    },

    /**
     * 获取地址栏的参数列表
     * @returns {Object}
     */
    getRequest: function() {
        var href = location.href;   //获取整个地址栏
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
            }
        }
        theRequest.host = href.replace(url, '');
        theRequest.getNewUrl = function(){
            var newUrl = this.host;
            var first = 0;
            for (var item in this) {
                if (item == 'host' || typeof this[item] == 'function')
                    continue;
                first ++;
                if (first == 1) {
                    newUrl += '?' + item + '=' + this[item];
                } else {
                    newUrl += '&' + item + '=' + this[item];
                }

            }
            return newUrl;
        };
        theRequest.delParam = function(param){
            if (undefined != param) {  //删除指定参数
                delete this[param];
            } else {
                for (var item in this) {  //删除所有参数
                    if (item == 'host' || typeof this[item] == 'function')
                        continue;
                    delete this[item];
                }
            }
            return true;
        };
        theRequest.delParamExpect = function(param){  //删除除指定参数之外的其他参数
            if (undefined == param) {
                return false;
            }

            for (var item in this) {
                if (item == 'host' || typeof this[item] == 'function'){
                    continue;
                } else {
                    if ($.inArray(item, param) == -1) {    //删除除指定的多个参数之外的参数
                        delete this[item];
                    }
                }
            }
            return true;
        };
        return theRequest;
    },

    requestQueue : {
        funcArray : [],
        timeArray : [],
        pushMany : function(objArr) {
            for (var i = 0; i < objArr.length; i++) {
                this.funcArray.push(objArr[i].func);
                this.timeArray.push(objArr[i].time);
            }
            return this;
        },
        pushOne : function(obj) {
            this.funcArray.push(obj.func);
            this.timeArray.push(obj.time);
            return this;
        },
        run : function() {
            var funcArray = this.funcArray,
                timeArray = this.timeArray;
            window.onload = function(){
                var time = 0;
                for (var j = 0;  j < funcArray.length; j++) {
                    time += timeArray[j];
                    setTimeout(funcArray[j], time)
                }
            }
            return this;
        }
    },
    
    EscapeUrl : function(urlStr) {
    	var chars = {
    		"%" : "%25",
    		"&" : "%26",
    		"["	: "%5B",
    		"]"	: "%5D"
    	};
    	
    	for (item in chars) {
    		urlStr = urlStr.replace(item, chars[item]);
    	}
    	
    	return urlStr;
    },
    
            /**
     * 上传组件
     * @author heqh
     *  @jQobj      点击选择文件的 jquery对象 (非input)
     *  @server     上传的地址
     *  @type       上传的文件类型 (验证用)
     *  @successFn  上传成功的回调函数
     *  @limit       上传限制大小 默认10M
     *  @progressFn  上传中需要做的事情
     *  @makeThumb   进度条
     *  @formData    额外参数
     *  @beforeQueuedFn  上传前的判断
     *  @fileQueuedFn   上传刚开始
     * */
     upload: function(jQobj, server, type, successFn, limit, progressFn, formData, makeThumb , beforeQueuedFn,fileQueuedFn){
        var extensions = {
            'image': 'png,jpg,jpeg,gif,bmp,wmf',
            'file': 'txt,docx,doc,xls,xlsx,png,jpg,jpeg,gif,bmp,pdf,wmf,tif,pptx,ppt'
        }
        var formData = formData || {};
        // formData._csrf = csrfToken;
        jQobj.each(function(index, obj){
            var uploader = WebUploader.create({
                auto: true,
                swf: '../bin/Uploader.swf',
                server: server,
                pick: {
                    id: jQobj[index]
                },
                formData: formData,  
                accept: {
                    extensions: extensions[type] || ''
                },
                fileSingleSizeLimit: limit || 1024*10*1024   /*b*/
            });
            
            config.uploadArr.push(uploader);
            var len = config.uploadArr.length;
            config.uploadArr[len-1].on( 'uploadSuccess', function(file, data) {
                successFn && $.isFunction(successFn) ? successFn(file, data, $('#rt_'+file.source.ruid)) : '';
            });
            config.uploadArr[len-1].on('uploadProgress', function(file, percentage) {
                progressFn && $.isFunction(progressFn) ? progressFn(file, percentage) : '';
            });
            // config.uploadArr[len-1].on('error', function(file) {
            //     //config.uploadArr[len-1].removeFile(file, true);
            //     if(file == 'Q_TYPE_DENIED'){
            //        // alert('文件类型错误');
            //     }else if(file == 'F_EXCEED_SIZE'){
            //         alert('文件过大');
            //     }
            // });
            
            config.uploadArr[len-1].on('fileQueued', function(file) {

                config.uploadArr[len-1].makeThumb( file, function( error, src ) {

                    makeThumb && $.isFunction(makeThumb) ? makeThumb(error, src, $('#rt_'+file.source.ruid)) : '';
                });
            });
            //上传队列
            config.uploadArr[len-1].on('fileQueued', function(file) {
                fileQueuedFn && $.isFunction(fileQueuedFn) ? fileQueuedFn(file) : '';
            });
            
            config.uploadArr[len-1].on('uploadComplete', function(file) {
                config.uploadArr[len-1].removeFile(file, true);
            });
            config.uploadArr[len-1].on('beforeFileQueued', function(file) {               
                if(beforeQueuedFn && $.isFunction(beforeQueuedFn)){
                    return beforeQueuedFn(file);//如果是false会阻止添加到队列
                }
            });
            
            config.uploadArr[len-1].on('error', function( code ) {
                var text = '';
                switch( code ) {
                    case  'F_DUPLICATE' : text = '该文件已经被选择了!' ;
                    break;
                    case  'Q_EXCEED_NUM_LIMIT' : text = '上传文件数量超过限制!' ;
                    break;
                    case  'F_EXCEED_SIZE' : text = '文件大小超过限制!';
                    break;
                    case  'Q_EXCEED_SIZE_LIMIT' : text = '所有文件总大小超过限制!';
                    break;
                    case 'Q_TYPE_DENIED' : text = '文件类型不正确或者是空文件!';
                    break;
                    default : text = '未知错误!';
                    break; 
                }
                $.showAlert(text);
            })
        });
    },

    
    /**
     * ajax上传文件
     * 
     * @param inputObj 提交按钮对象
     * @param url php端处理的url地址
     * @param completefn 完成后的回调函数
     * @param submitfn 提交后的回调函数
     * @param fileName $_FILES['fileName']
     * @param data 额外数据
     * @param accept 允许的文件类型 如：image/jpeg;image/png
     * @param uploadChange 选中上传文件开始上传时执行
     * @return void
     * 
     */
    ajaxUpload : function(inputObj, url, completefn, submitfn, fileName, data, accept, uploadChange) {
        if (!data) {
            data = {};
        }
        if (!fileName) {
            fileName = 'ajaxupload';
        }
        new AjaxUpload(inputObj[0], {
            action : url, // 请求目标
            name : fileName, // 文件参数名
            autoSubmit : true, // 自动提交
            responseType : 'json',
            accept : accept,
            data : data,
            onSubmit : function(file, extend) {
                if (submitfn) {
                    submitfn(extend, file, $);
                }
            },
            onComplete : function(file, response) {
                if (completefn) {
                    completefn(response, file, $);
                }
            },
            onChange : function() {
                if (uploadChange) {
                    $.isFunction(uploadChange) ? uploadChange() : '';
                }
            }
        });
    },
    
    /*下拉框*/
    select_box : function(selector){
        //打开下拉框
        var box;
        $('body').on('click', '.'+selector, function(){
            box = $(this);
            box.toggleClass('active');
        });
        //选中下拉框
        $('body').on('click', '.'+selector+' a', function(){
           var option = $(this);
           box = option.parents('.select_box');
           var val = option.attr('ivalue');
           box.find('.show_text').text(option.text());
           box.attr('ivalue', val);
        });
        $('body').on('click', function(event){
            var e = window.event||event;
            var target = $(e.target);
            var box = target.hasClass('select_box') ? target : target.parents('.select_box');
            if(target.hasClass('select_box') || target.parents('.select_box').length > 0){
                $('.select_box').not(box[0]).removeClass('active');
            }else{
                $('.select_box').removeClass('active');
            }
        });
    }
});


/**
 * 发送ajax封装 防重复、 loading状态、未登录跳登录页等
 * @author heqh
 * @param loadObj load覆盖对象
 * @param noLoad 传入 true 则不会出现loading
 * @param canSend  true强制可以重复提交   默认是不可以重复提交
 * @type type 请求类型 默认post
 * */
$.fn.ajax = function(opts, loadObj, canSend) {
    var objBtn = $(this);
    // 防止重复提交
    if ($(this).hasClass('ajax-lock') && !canSend) {
        return;
    }
    if (!opts.noLoad) {
        $.loading(loadObj);
    }
    var promise = $.ajax({
        type : opts.type || 'POST',
        url : opts.url,
        data : opts.data,
        dataType : 'json',
        timeout : config.ajaxTimeout,
        success : function(ajaxData) {
            config.canSendAjax = true;
            objBtn.removeClass('ajax-lock')
            var data;
            $.closeLoading(loadObj);
            if(typeof(ajaxData) == 'string'){
                data = eval('(' + ajaxData +')');
            }else{
                data = ajaxData;
            }
            if(data.status == -1){
                location.href = INTEGLE_URL + 'login/login';
                return;
            }
            if(data.status != 1 && data.info && !opts.noTipError && typeof(data.info) == 'string'){
                $.showAlert(data.info);
            }
            opts.success && $.isFunction(opts.success) ? opts.success(data) : '';
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            $.closeLoading(loadObj);
            if (textStatus == 'timeout') {
                $.closeLoading(loadObj);
                config.canSendAjax = true;
                opts.timeOut && $.isFunction(opts.timeOut) ? opts.timeOut() : '';
            }
        },
        beforeSend : function() {
            config.canSendAjax = false;
        },
        complete : function() {
            config.canSendAjax = true;
        }
    });
    return promise;
}

/**
 * 表单验证
 * class名:form_check_box 验证的form
 * form-check 验证类型 form-error错误提示语
 * 
 * <form class="form_check_box">
 * <input form-check="phone" form-error="请输入正确电话号码" />
 * <button class="submit"></button>
 * </form>
 * */
$.fn.form_check_box = function(){
    var form_check_box = '.form_check_box';
    $('body').on('blur', form_check_box+' [form-check]', function(){
        check($(this));
     });
    $('body').on('input', form_check_box+' .error[form-check]', function(){
        var box = $(this).parents(form_check_box);
        var val = $(this).val();
        var ckeckType = $(this).attr('form-check');
        var result = $.checkVal(val, ckeckType);
        if(result){
            $(this).removeClass('error');
        }
        if(box.find('input.error').length == 0 && box.find('textarea.error').length == 0){
            box.find('.submit').removeClass('disabled');
        }
    });
    $('body').on('click', form_check_box+' .submit', function(){
        $(this).parents(form_check_box).find('[form-check]').each(function(){
            if(!check($(this))){
                return false;
            }else{
                check($(this));
            }
        })
    });
    
    function check(input){
    	var valueResult = false;
    	
    	//方法验证
//    	var funcResult = true;
//    	var checFunc = input.attr('check-func');
//    	if (checFunc != undefined) {
//    		funcResult = window[checFunc]();
//    	}
    	
        var box = input.parents(form_check_box);
        var val = input.val();
        var ckeckType = input.attr('form-check');
        var result = $.checkVal(val, ckeckType);
        if(!result){
            if(input.siblings('.tip-info').length == 0){
                input.after('<div class="tip-info"></div>');
            }
            input.addClass('error');
            box.find('.submit').addClass('disabled');
            input.siblings('.tip-info').css('display','block').text(input.attr('form-error')||input.attr('placeholder')||'输入有误，请重新输入');
            valueResult = false;
        }else{
            input.siblings('.tip-info').hide().text('');
            $(this).removeClass('error');
            valueResult = true;
        };
        if(box.find('input.error').length == 0 && box.find('textarea.error').length == 0){
            box.find('.submit').removeClass('disabled');
            valueResult = true;
        }
        
        //return funcResult && valueResult;
        return valueResult;
    };
};

//select 取值
$.fn.ival = function(){
    var obj = $(this);
    if(obj.length == 0){
        return false;
    }
    if(obj.hasClass('select_box')){
        return obj.attr('ivalue') ? obj.attr('ivalue') : obj.find('a').eq(0).attr('ivalue');
    }
}

$(function(){
    //调用 模拟select方法
    $.select_box('select_box');
    var turnPage = function(that){
    	var urlObj = $.getRequest();
        if(that.attr('page')){   //页码按钮
            urlObj.p = parseInt(that.attr('page'));
        }else{  //确定按钮
            var p = parseInt(that.parents('.smarty-page').find('.turn-page').val());
            var tp = parseInt($('.smarty-page span.total').data('pages'));
            if (p > tp || p < 0 || isNaN(p)) {
                $.showAlert($.Lang.page_err);
                return false;
            } else {
                urlObj.p = p;
            }
        }
        window.location.href = urlObj.getNewUrl();
    }
    //翻页使用，其他参数不修改的前提下只改翻页参数
    $('.smarty-page a.n, .smarty-page .submit').click(function(){
    	turnPage($(this));
    });
    
    $('.smarty-page .turn-page').keydown(function (event) {
    	if (event.keyCode == 13) 
    		turnPage($(this));
    });
    //console.log("%c Integle ", "font-size:35px;text-shadow: 3px 1px 1px grey"," 上海鹰谷致力于打造专业的化学信息服务团队。");
    //console.log([  "            _ooOoo_",  "           o8888888o",  "           88\" . \"88",  "           (| ^_^ |)",  "            O\\ = /O",  "        ____/`---'\\____",  "       .' \\\\|   |// `.",  "      / \\\\||| : |||// \\",  "      / _||||| -:- |||||- \\",  "      |  | \\\\\\ - /// |  |",  "      | \\_| ''\\---/'' |  |",  "      \\ .-\\__ `-` ___/-. /",  "     ___`. .' /--.--\\ `. . __",  "   .\"\" '< `.___\\_<|>_/___.' >'\"\".",  "   | | : `- \\`.;`\\ _ /`;.`/ - ` : | |",  "   \\ \\ `-.  \\_ __\\ /__ _/  .-` / /",  "======`-.____`-.___\\_____/___.-`____.-'======",  "          `=---='",  "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",  "     佛祖保佑    永无BUG", " "].join('\n'));
});
 