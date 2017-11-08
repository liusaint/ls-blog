/*!
 * jQuery Placeholder Plugin v2.3.1
 * https://github.com/mathiasbynens/jquery-placeholder
 *
 * Copyright 2011, 2015 Mathias Bynens
 * Released under the MIT license
 */
(function(factory) {
    //比较常见的兼容各种模块机制的写法。
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {

    /****
     * Allows plugin behavior simulation in modern browsers for easier debugging. 
     * When setting to true, use attribute "placeholder-x" rather than the usual "placeholder" in your inputs/textareas 
     * i.e. <input type="text" placeholder-x="my placeholder text" />
     */
    /*让本插件在高级浏览器有在不支持的浏览器中类似的操作以方便调试。毕竟IE中调试成本很高。
     *在支持palceholder的浏览器中不使用placeholder="111"而使用placeholder-x="111",因为如果直接使用placeholder*的话它就正常显示出来，看不到插件运行的效果。
     */



    //是否开启调试模式
    var debugMode = false;

    // Opera Mini v7 doesn't support placeholder although its DOM seems to indicate so
    // 对Opera Mini v7的特殊判断。
    var isOperaMini = Object.prototype.toString.call(window.operamini) === '[object OperaMini]';
    var isInputSupported = 'placeholder' in document.createElement('input') && !isOperaMini && !debugMode;
    var isTextareaSupported = 'placeholder' in document.createElement('textarea') && !isOperaMini && !debugMode;
    //jQuery的val()方法的钩子
    var valHooks = $.valHooks;
    //jQuery.prop()方法的钩子
    var propHooks = $.propHooks;
    var hooks;
    var placeholder;
    //设置项
    //这个设置项只有一个项。默认{customClass: 'placeholder'}
    //这个class placeholder是当text或textarea值为空且处理非focus状态时添加的class。或者说是本插件处理使用状态时的一个标识class。
    var settings = {};

    //如果浏览器支持，按jquery实例方法惯例返回this就行。
    if (isInputSupported && isTextareaSupported) {

        placeholder = $.fn.placeholder = function() {
            return this;
        };

        placeholder.input = true;
        placeholder.textarea = true;

    } else {
        //jQuery插件写法...$.fn.functionName = ...
        placeholder = $.fn.placeholder = function(options) {

            var defaults = {
                customClass: 'placeholder'
            };
            settings = $.extend({}, defaults, options);

            // this是当前jquery实例。如$('input textarea')的值;
            // 1.过滤掉不满足的。$(":input")可以找到button select textarea...并不仅仅是input标签。
            // （1）支持input的话就只要textarea
            // （2） debugMode就用placeholder-x属性的否则是placeholder。
            // （3） 已经含有标识class的忽略。
            // （4） :radio :checkbox [type=hidden] 
            // 2.focus绑定clearPlaceholder方法。注意事件命名空间的使用。这样trigger触发blur带上命名空间就不会
            // 触发元素上绑定的其他的事件方法。
            // 3.blur失焦绑定setPlaceholder方法。
            // 4.触发blur.placeholder。
            // 注意这里的事件绑定。有可能会出现重复绑定的情况。只有bind没有unbind。可能引起的逻辑问题已在事件方法的具体逻辑中避免。

            return this.filter((isInputSupported ? 'textarea' : ':input') + '[' + (debugMode ? 'placeholder-x' : 'placeholder') + ']')
                .not('.' + settings.customClass)
                .not(':radio, :checkbox, [type=hidden]')
                .bind({
                    'focus.placeholder': clearPlaceholder,
                    'blur.placeholder': setPlaceholder
                })
                .data('placeholder-enabled', true) //用这个属性标识是否在控制范围内。
                .trigger('blur.placeholder');
        };

        placeholder.input = isInputSupported;
        placeholder.textarea = isTextareaSupported;

        //放到jquery的钩子中$.valHooks,$propHooks。
        //在jQuery内部val()方法中。get的时候先执行钩子。得到值就返回。
        //set的时候。是先会对值进行处理。最后再调钩子。
        //并且会把val()方法处理后的值传递给钩子函数进一步处理
        hooks = {
            //运行$('input').val();$('input').prop('value')是会调用此方法。返回此方法的结果。
            //下面的set一样。
            'get': function(element) {
                
                var $element = $(element);
                //针对type=password的特殊处理。如果是为password生成的text。实际要拿它对应的password的值。
                var $passwordInput = $element.data('placeholder-password');

                if ($passwordInput) {
                    return $passwordInput[0].value;
                }
                //返回实际值还是返回空。
                return $element.data('placeholder-enabled') && $element.hasClass(settings.customClass) ? '' : element.value;
            },
            //调用$('input').val('abc')时会调用它。于jQuery内部的val()方法中调用。
            'set': function(element, value) {

                var $element = $(element);
                var $replacement;
                var $passwordInput;
                //上面这个判断只是为处理password和对应的text。
                //只有这种情况是需要优先于placeholder-enabled标识来判断的。
                if (value !== '') {
                    //text对应的password。这里用来判断自身是否是replacement text。
                    $replacement = $element.data('placeholder-textinput');
                    //password对应的text。这里用来判断自身是否是password。
                    $passwordInput = $element.data('placeholder-password');
                    //赋值给正确的dom并clearPlaceholder。涉及到password，不管元素是生成的text还是password本身。都会引起两个元素的id修改以及显示隐藏。下面两个判断会将操作都放在password元素上。
                    if ($replacement) {
                        //如果是plcement。就赋值给password。
                        clearPlaceholder.call($replacement[0], true, value) || (element.value = value);
                        $replacement[0].value = value;
                    } else if ($passwordInput) {
                        //如果自身是password。就用本身。
                        clearPlaceholder.call(element, true, value) || ($passwordInput[0].value = value);
                        element.value = value;
                    }
                }
                //如果是体制外的。不在本插件控制范围内的。
                //为什么不把这一段提到上面去？因为为password生成的text可能有也可能没有placeholder-enabled标识。
                if (!$element.data('placeholder-enabled')) {
                    element.value = value;
                    return $element;
                }
                //空值
                if (value === '') {

                    element.value = value;

                    // Setting the placeholder causes problems if the element continues to have focus.
                    // 如果它不是focus状态。设置placeholder.
                    if (element != safeActiveElement()) {
                        // We can't use `triggerHandler` here because of dummy text/password inputs :(
                        setPlaceholder.call(element);
                    }

                } else {
                    //有状态标识的话
                    if ($element.hasClass(settings.customClass)) {
                        clearPlaceholder.call(element);
                    }

                    element.value = value;
                }
                // `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
                // 如果返回了undefined。jQuery源码内部就会就会放弃上面的赋值操作。
                return $element;
            }
        };
        //在jQuery的钩子函数中增加类型
        if (!isInputSupported) {
            valHooks.input = hooks;
            propHooks.value = hooks;
        }

        if (!isTextareaSupported) {
            valHooks.textarea = hooks;
            propHooks.value = hooks;
        }

        $(function() {
            // Look for forms
            // 表单提交的时候。
            $(document).delegate('form', 'submit.placeholder', function() {

                // Clear the placeholder values so they don't get submitted
                // 清除placeholder的表单的value值。避免后面的submit方法或者浏览器自已的表单提交操作拿到不正确的值。
                var $inputs = $('.' + settings.customClass, this).each(function() {
                    clearPlaceholder.call(this, true, '');
                });
                //延时恢复。
                //比如监听submit事件，表单验证，ajax表单提交，验证不通过，不提交。那么不提交的情况需要恢复

                setTimeout(function() {
                    $inputs.each(setPlaceholder);
                }, 10);
            });
        });

        // Clear placeholder values upon page reload
        // 页面reload的时候，清空placeholder。
        $(window).bind('beforeunload.placeholder', function() {

            var clearPlaceholders = true;

            try {
                // Prevent IE javascript:void(0) anchors from causing cleared values
                // IE有时候点击<a href="javascript:void(0)">也会触发beforeunload事件。要避免。
                if (document.activeElement.toString() === 'javascript:void(0)') {
                    clearPlaceholders = false;
                }
            } catch (exception) {}

            if (clearPlaceholders) {
                $('.' + settings.customClass).each(function() {
                    this.value = '';
                });
            }
        });
    }

    //将元素的attrs提取出来
    function args(elem) {
        // Return an object of element attributes
        var newAttrs = {};
        var rinlinejQuery = /^jQuery\d+$/;

        $.each(elem.attributes, function(i, attr) {
            if (attr.specified && !rinlinejQuery.test(attr.name)) {
                newAttrs[attr.name] = attr.value;
            }
        });

        return newAttrs;
    }
    //取消placeholer状态。 focus或设置了值的时候。
    //将value设置为''
    //删除标识class。
    //如果是password的text。需要显示password。并focus（focus text进来的）。
    function clearPlaceholder(event, value) {

        var input = this;
        var $input = $(this);
        //判断value等于placeholder且有标识class。
        if (input.value === $input.attr((debugMode ? 'placeholder-x' : 'placeholder')) && $input.hasClass(settings.customClass)) {

            input.value = '';
            $input.removeClass(settings.customClass);
            //如果然触发事件的是一个为password生成的text.
            if ($input.data('placeholder-password')) {
                //隐藏它
                //显示对应的password
                //把id给当前focus的值。
                $input = $input.hide().nextAll('input[type="password"]:first').show().attr('id', $input.removeAttr('id').data('placeholder-id'));

                // If `clearPlaceholder` was called from `$.valHooks.input.set`
                // 如果是从$.valHooks.input.set中调用的。需要return。不用focus。
                if (event === true) {
                    $input[0].value = value;

                    return value;
                }
                //focus。
                $input.focus();

            } else {
                //当 textarea 或文本类型的 input 元素中的文本被选择时，会发生 select 事件。
                //如果input处于focus()状态。执行.select();why?
                input == safeActiveElement() && input.select();
            }
        }
    }
    //设置placeholder状态。
    //将placeholder中的值放到对应元素中。
    //blur或设置val('')时调用;
    //效果:如果值==placeholder。添加标识class。如果是password,需添加对应的text。
    function setPlaceholder(event) {
        var $replacement;
        var input = this;
        var $input = $(this);
        var id = input.id;

        // If the placeholder is activated, triggering blur event (`$input.trigger('blur')`) should do nothing.
        //如果已经执行过了，就直接返回了。
        //因为只有bind事件，没有unbind，所以可能会多次绑定本方法到一个元素上？针对这种情况就直接return。
        if (event && event.type === 'blur' && $input.hasClass(settings.customClass)) {
            return;
        }
        //值为空的时候操作多。
        if (input.value === '') {
            //针对type=password的处理。因为这个类型如果value有值它显示的是******。所以采用的方法是将本身的元素隐藏。并在原地clone一个它，设置type=text。这样就相当于看到了placeholder。
            if (input.type === 'password') {
                //是否已经生成过
                if (!$input.data('placeholder-textinput')) {

                    try {
                        //正常方式克隆
                        $replacement = $input.clone().prop({
                            'type': 'text'
                        });
                    } catch (e) {
                        //生成一个input。把password上所有的attr给它。
                        $replacement = $('<input>').attr($.extend(args(this), {
                            'type': 'text'
                        }));
                    }
                    //1.清除掉name属性。避免表单提交时候有两个相同name。
                    //2.设置相关data属性,placeholder-password指向原来的元素。
                    //3.绑定focus事件。clearPlaceholder。
                    $replacement
                        .removeAttr('name')
                        .data({
                            'placeholder-enabled': true,
                            'placeholder-password': $input,
                            'placeholder-id': id
                        })
                        .bind('focus.placeholder', clearPlaceholder);
                    //1.给原元素设置相关data属性。placeholder-textinput指向生成的元素。
                    //2.在原元素之前添加这个新元素。
                    $input
                        .data({
                            'placeholder-textinput': $replacement,
                            'placeholder-id': id
                        })
                        .before($replacement);
                }
                //设置值为'';
                input.value = '';
                //将它的id值赋予它前面的type=text的input上。
                //隐藏password显示text。
                $input = $input.removeAttr('id').hide().prevAll('input[type="text"]:first').attr('id', $input.data('placeholder-id')).show();

            } else {

                var $passwordInput = $input.data('placeholder-password');
                //如果触发事件的是一个为password生成的text。                
                if ($passwordInput) {
                    $passwordInput[0].value = '';
                    $input.attr('id', $input.data('placeholder-id')).show().nextAll('input[type="password"]:last').hide().removeAttr('id');
                }
            }
            //添加标识类
            $input.addClass(settings.customClass);
            //赋placeholder值
            $input[0].value = $input.attr((debugMode ? 'placeholder-x' : 'placeholder'));

        } else {
            //值不为空的时候只需要移除该标识class。
            $input.removeClass(settings.customClass);
        }
    }
    //ie9下document.activeElement可能会报错。
    function safeActiveElement() {
        // Avoid IE9 `document.activeElement` of death
        try {
            return document.activeElement;
        } catch (exception) {}
    }
}));