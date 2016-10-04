/*观察者模式在需要AJAX获取数据的控件中的运用

*author:ls
*date:20161004
*email:841766635@qq.com
*/
function A(name){
	this.name = name ;
	this.init();
}
A.prototype={

	init:function(name){
		//在回调函数中拿到初始化的这个对象
		var self = this;
		//拿到数据之后的回调函数
		var callback = function(event,data){
			console.log('这是初始化的'+self.name+'的回调函数');
			console.log(data);
			A.data = data;
		}
		//判断要获取的数据是否已经获取过。没获取过则ajax获取。
		if(A.data){
			callback(A.data);
		}else{
			if(!A.ajaxing){
				this.getAjaxData();
			}
			//订阅
			$(document).on('dataOk',callback);			
		}

	},
	getAjaxData:function(){
		A.ajaxing = true;
		$.ajax({
			url : 'data.json',
			noLoad: true,
			success: function(data){
				//触发我们定义的这个事件,并传递ajax获取到的数据
				//发布
				$(document).trigger('dataOk',[data]);
				A.ajaxing = false;
			}
		});
	}
}


//第一次调用
var a = new A('1a');
//第二次调用
var aa = new A('2a');