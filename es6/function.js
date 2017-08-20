//函数部分

//默认参数
//注意argumets的内容。
(function() {
return;
	function a(a1 = 1, a2 = 2,c) {
		console.log(a1 + a2, arguments);
	}
	a(); //3 {}
	a(2); //4 { '0': 2 }
	a(!0, 1); //2 { '0': true, '1': 1 }
	console.log(a.length); //0

	//es5严格模式下与非严格模式下arguments的区别。严格下arguments不可改变。
	//带默认参数的也会按严格来。
	function b(b1 = {}, b2) {

		console.log(arguments[0] === b1);//true
		b1.b = 2;
		b2 = 6;
		console.log(arguments); //{ '0': { a: 1, b: 2 }, '1': 1 }
	}

	b({a:1},1)


})();

//不定参数
(function() {
return;
	function a(a1 = 1,...rests) {
		console.log(rests, arguments);
	}
	a(2,3,4,5,6,7,8); //3 {}

	console.log(a.length); //0

})();

//展开运算符
(function() {
	return;
	function a() {
		console.log(arguments);
	}
	var arr = [1,2,3,4,5];
	a(...arr); //{ '0': 1, '1': 2, '2': 3, '3': 4, '4': 5 }

	console.log(a.length); //0

})();

//箭头函数
(function() {
//即用即弃
//this和arguments指向外层
//可用appLy,call,bind。改变不了this。
//不可new,没有prototype
//
//没有[[construct]]
//没有new.target。指向外层？

})();