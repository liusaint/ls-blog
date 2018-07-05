/*一些工具函数*/

/*重复执行一个函数*/
function repeat(fn,num,context){

	for (var i = 0; i < num; i++) {		
		var resAgr = Array.prototype.slice.call(arguments,3);		
		fn.apply(context||null,resAgr);	
	}
}
/*使用
var c = {
	a:1,
	b:function(arg){
		console.log(this.a,arg);
	}
}

repeat(c.b,4,c,666);
*/

