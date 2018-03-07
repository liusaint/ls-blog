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

//所以 并不能说对象不能使用for of。要判断它是否满足条件。
//并且 迭代器对象 可以
(function() {

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

		}
	}


	for (var i of a) {
		console.log(i)
	}

	console.log(a[5]);//这种没有得到支持。

})();


