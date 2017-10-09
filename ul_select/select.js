$(function() {
    
    /*模拟select功能　begin*/
    (function() {


        var $startLi, //移动的初始节点
        $currentLi, //移动的当前节点
        currentIndex, //当前节点的索引
        startIndex, //初始索引
        maxIndex, //本次移动的最大索引
        minIndex, //本次移动最小索引
        isMoving;//是否在移动中
        
        //避免重复绑定，先解绑事件。
        $('body').off('.ul_select_event');
        
        //数据同步。仅仅是从模拟的同步到原生的。
        function setSelectVal() {
            $(".ori_select").val('');
            $('.ul_select .choosed').each(function(index, el) {
                var val = $.trim($(this).attr('value'));
                $('.ori_select option[value="' + val + '"]').prop('selected', true);
            });
        }

        //不使用ctrl,单选的时候选中选项
        $("body").on('click.ul_select_event', '.ul_select li', function(event) {
            $(this).toggleClass('choosed');
            setSelectVal();
        });

        //鼠标按下去的事件。
        $("body").on('mousedown.ul_select', '.ul_select li', function(event) {
            
            //mousedown的时候，部分数据需要初始化。
            $startLi = $(this);
            startIndex = maxIndex = minIndex = $startLi.index();

            //延时一点。绑定。一定程度避免点击事件跟移动事件的冲突。
            setTimeout(function() {
                $(".ul_select li").on('mousemove', function(event) {

                    isMoving = true;

                    $currentLi = $(this);
                    currentIndex = $currentLi.index();

                    if (currentIndex > maxIndex) {
                        maxIndex = currentIndex;
                    }

                    if (currentIndex < minIndex) {
                        minIndex = currentIndex;
                    }

                    for (var i = minIndex; i <= maxIndex; i++) {
                        $('.ul_select li').eq(i).removeClass('choosed');
                    }
                   
                    if (currentIndex >= startIndex) {

                        for (var i = startIndex; i <= currentIndex; i++) {
                            $('.ul_select li').eq(i).addClass('choosed');
                        }

                    } else {                        

                        for (var i = startIndex; i >= currentIndex; i--) {
                            $('.ul_select li').eq(i).addClass('choosed');
                        }

                    }

                })
            }, 50)

        });

        //结束移动状态
        $("body").on('mouseup.ul_select_event', function(event) {
            $(".ul_select li").off('mousemove');
            if (isMoving) {
                isMoving = false;
                setSelectVal();
            }

        });

    })();
    /*模拟select功能　end*/
});