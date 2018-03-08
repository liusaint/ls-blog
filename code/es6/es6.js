

function lg(...a){
	console.log.apply(console,a);
}













//Symbol一方面是函数。但不是构造函数，不能new。 另一方面也保存了很多内部方法原生实现的方法名的引用如Symbol.iterator

//set weakSet Map weakMap
(function() {
	return;
	var set = new Set();
	var set1 = new Set([1, 2, 3, 4, 1, 2]);
	console.log(set1.size)
	console.log(set1.add(5))
	set1.delete(1);
	console.log(set1)
	console.log(set1.add('5')); //内部使用Object.is()来判断
	console.log(set1.has(2));
	set1.clear();
	console.log(set1);
	set1.forEach(function a(value, key, set) {}, this); //第二个参数可传入this

	console.log([...new Set([1, 2, 3, 2, 3])]); //数组去重以及转化。


	//https://zhuanlan.zhihu.com/p/25454328 weakMap和弱引用

	// Map的key支持所有数据类型。
	var map = new Map();
	map.set('a', 123);
	map.get('a');
	// map.has(key);
	// map.delete(key);
	// map.clear();

})()

// for of 循环可迭代对象，当你向任意对象添加 myObject[Symbol.iterator]()方法，就可以遍历这个对象了
//$.fn[Symbol.iterator] = Array.prototype[Symbol.iterator];//[ɪtə'reɪtə]
// for of也可以遍历字符串
// 普通对象不能用for of。  map对象可以。
;(function(){
	return;
	function* a() {
		console.log(1)
		yield 11;
		console.log(2);
		yield 22;
		console.log(3)

	}
	console.log('generators begin')
	var item = a();
	console.log(item.next()); //1 { value: 11, done: false }
	console.log(item.next()); //2 { value: 22, done: false }
	console.log(item.next()); //3 { value: undefined, done: true }

	console.log(typeof a); //function
	/*Generators
	* a()的时候 不执行。
	* a().next()才输出1.
	* 生成器对象保留了对
	这个堆栈结构的引用（备份），所以稍后调用.next()可以重新激活堆栈结构并且继续执行
	* 生成器是迭代器。
	*
	*/
})();

//for of 使用函数的方式来实现

(function() {

	return;
	var a = [1, 2, 3];
	var aIterator = a[Symbol.iterator]();
	var next = aIterator.next();
	while (next.done == false) {
		console.log(next.value, 'while');
		next = aIterator.next()
	}

})();



//迭代器对象
// for of 首先会调用对象的 Symbol.iterator方法。返回带有.next()方法的iterator对象。
// 然后调用 iterator.next();返回result。
// 如果 result.done ！= false 就继续迭代。 将result.value赋予for of循环的of前面的变量使用。
// 如果过早退出会触发，break或return时会触发迭代器 iterator.return()方法。

//所以 并不能说对象不能使用for of。要判断它是否满足条件。
//并且 迭代器对象 因为它是边迭代边生成 可以在next中加逻辑，产生一些特殊的集合。
(function() {

	return;
	var count = 0;

	var a = {
		[Symbol.iterator]: function() {
			return this;
		},

		next() {
			var done = false;
			var value;
			if (count > 7) {
				done = true;
				value = undefined;
			} else {
				value = count++
			}
			return {
				done: done,
				value: value
			}

		},

		return(){

			console.log('return');
			return {}
		}
	}


	for (var i of a) {
		console.log(i);
		// if(i == 2){
		// 	break;
		// }
	}

	console.log(a[5]);//这种没有得到支持。

})();


//生成器 generators
// yield返回的是带value和done的对象
// iterator.next()可传入参数.返回到生成器中接着执行.比如ajax执行成功之后接着执行回调.

(function(){

	return;
	function *kk(){
		let first = yield 1;
		lg(first)
		let second = yield first + 2;
		lg(second)
		yield second +3;
		console.log(second);

	}

	var iteratorKk = kk();
	lg(iteratorKk.next());
	lg(iteratorKk.next(3));
	lg(iteratorKk.next(6));
	lg(iteratorKk.next(7));




	// return;

	function *a(){
		yield 1;
		var data = yield 8;
		console.log(data);
	}

	var iterator = a();
	console.log(typeof a);//function
	console.log(iterator.next());//{ value: 1, done: false }
	console.log(iterator.next());//{ value: 8, done: false }
	console.log(iterator.next({status:1,data:666}));

	//生成器是迭代器
	function *c(){
		var i=5;
		while(i--){
			yield i;
		}
	}

	var iteratorC = c();
	for(let d of iteratorC){
		console.log(d)
	}

})()


//字符器
;(function(){

return;
var name = 'ls';
console.log(`my name is ${name}`);


})();


//不定参数
;(function(){
	return;
	function a(a,...b){
		console.log(arguments);//{ '0': 1, '1': 2, '2': 3 } arguments也还是有效的。
		console.log(b);//[ 2, 3 ]
		
	}
	a(1,2,3)
	console.log(a.length);//.length不包含不定参数和默认参数

})();


//解构
;
(function() {

	return;

	var [a, b] = [1, 2];
	lg(a); //1
	var [c, [d]] = [1, [3]];
	lg(d); //3
	var {
		a: aa,
		b: bb
	} = {
		a: 11,
		b: 22
	}
	lg(aa); //11kq1,	 b56tr5555555

	var {
		e,
		f: {
			g
		}
	} = {
		e: 12,
		f: {
			g: 222
		}
	}
	lg(g); ///222


	//使用
	function k({a,b,c}){
		lg(a);//1
	}
	k({a:1,b:2,c:3})

	//var [key,val] of [1,2,3]
	//var [a1,a2] = fa();
	//var {a,b} = require('a.js');

})();



// Symbol
//1.for in不会把Symbol为键的遍历出来.
//2.如果没有拿到定义Symbol时的变量,外部无法访问到该值,也无法覆盖该值.比如var a = Symbol().只有通过a代表的值能获取到Symbol属性的值.
//3.Symbol不是构造函数.不能加new.
//4.全局的Symbol对象上,有很多内置的属性指向JS很多内部使用的Symbol.如Symbol.iterator方法.
//5.Symbol.for('123');返回的始终是同一个Symbol.
//6.Symbol('abc');
//7.obj instanceof constructor.可以换成. constructor[Symbol.hasInstance](object);
//
//
//weakSet weekMap
//1.weekSet的值和WeeMap的键要是对象.
//2.不可迭代.
//
//


//class
;(function(){

	class A {
		constructor(a){

		};
		static a(){
			console.log('a')
		};
		a(){
			console.log('1')
		};
		set b(b){
			this.__b = b;
		};
		get b(){
			return this.__b;
		}
		*c(){}
	}

	var a = new A();

	lg(a.b = 5)
	lg(a.b)
	


})();