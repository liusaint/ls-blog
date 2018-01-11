
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






/*递归
1.递归逻辑上消耗参数。
2.但是递归时不应该修改原始的参数。

自递归函数
1.知道什么时候停止。
2.决定怎样算一个步骤。
3.把问题分解成一个步骤和一个小问题。

自递归函数可以通过参数与下个递归进行交互。一个叫累加器的参数。


*/