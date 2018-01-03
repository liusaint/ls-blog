
//动态作用域

//保存值。最终生成{a:[1,2,3],b:[4,3,5,{}]}这样的数据结构。
var globals = {} 

function makeBindFun(resolver){
	return function(k,v){
		//拿到某个值的栈。
		var stack = globals[k] || [];
		// 使用传入的函数处理该值的栈。传入的resolver的功能比如删除一个值，添加一个值等。
		globals[k] = resolver(stack,v);
		return globals;
	}
}