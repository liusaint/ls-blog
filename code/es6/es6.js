function lg(...a) {
	console.log.apply(console, a);
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
;
(function() {
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

		return () {

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

	console.log(a[5]); //这种没有得到支持。

})();


//生成器 generators
// yield返回的是带value和done的对象
// iterator.next()可传入参数.返回到生成器中接着执行.比如ajax执行成功之后接着执行回调.

(function() {

	return;

	function* kk() {
		let first = yield 1;
		lg(first)
		let second = yield first + 2;
		lg(second)
		yield second + 3;
		console.log(second);

	}

	var iteratorKk = kk();
	lg(iteratorKk.next());
	lg(iteratorKk.next(3));
	lg(iteratorKk.next(6));
	lg(iteratorKk.next(7));



	// return;

	function* a() {
		yield 1;
		var data = yield 8;
		console.log(data);
	}

	var iterator = a();
	console.log(typeof a); //function
	console.log(iterator.next()); //{ value: 1, done: false }
	console.log(iterator.next()); //{ value: 8, done: false }
	console.log(iterator.next({
		status: 1,
		data: 666
	}));

	//生成器是迭代器
	function* c() {
		var i = 5;
		while (i--) {
			yield i;
		}
	}

	var iteratorC = c();
	for (let d of iteratorC) {
		console.log(d)
	}

})()


//字符器
;
(function() {

	return;
	var name = 'ls';
	console.log(`my name is ${name}`);


})();


//不定参数
;
(function() {
	return;

	function a(a, ...b) {
		console.log(arguments); //{ '0': 1, '1': 2, '2': 3 } arguments也还是有效的。
		console.log(b); //[ 2, 3 ]

	}
	a(1, 2, 3)
	console.log(a.length); //.length不包含不定参数和默认参数

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
	function k({
		a,
		b,
		c
	}) {
		lg(a); //1
	}
	k({
		a: 1,
		b: 2,
		c: 3
	})

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
//es5与es6在this生成时的不同。p204b
//super后才可以用this，在constructor中，在子类中。super()与super.getArea()
//只要有[[Construct]]属性和原型就可以被继承。
//super在静态方法之中指向父类，在普通方法之中指向父类的原型对象。
//ES5 是先新建子类的实例对象this，再将父类的属性添加到子类上，由于父类的内部属性无法获取，导致无法继承原生的构造函数。比如，Array构造函数有一个内部属性[[DefineOwnProperty]]，用来定义新属性时，更新length属性，这个内部属性无法在子类获取，导致子类的length属性行为不正常。
//ES6 允许继承原生构造函数定义子类，因为 ES6 是先新建父类的实例对象this，然后再用子类的构造函数修饰this，使得父类的所有行为都可以继承。
;
(function() {
	// return;
	class A {
		constructor(a) {
			
			if(new.target === A){
				// throw new Error('这个类不能直接被实例化，只能继承')
			}

		};
		//静态方法
		static a() {
			console.log('a')
		};
		//类方法
		a() {
			console.log('1')
		};
		//getter.setter
		set b(b) {
			this.__b = b;
		};
		get b() {
			return this.__b;
		}; 
		//生成器方法
		*c() {}
	}

	var a = new A();

	lg(a.b = 5)
	lg(a.b)

	//内建对象的继承。
	class MyArray extends Array{

	}
	var myArr = new MyArray(1,2,3);
	console.log(myArr)

	console.log(myArr.slice());//返回的依然是myArray类型

	//因为Symbol.species
	class BaseClass{
		static get [Symbol.species](){
			return this;
		}

		constructor(val){
			this.val = val;
		}

		clone(){
			return new this.constructor[Symbol.species](this.val);
			// return new this.constructor(this.val)
		}
	}

	class SubClass extends BaseClass{

	}

	var sub = new SubClass(123);
	lg(sub)
	lg(sub.clone())

})();





//promise
/* 
 * 1.promise的错误处理。.then(resolve,reject)中的reject中或.catch中。
 * 会错误冒泡，直到被捕获。比如在一个promise中报错了或reject了。错误会传递下去，直到被后续的then的第二个参数reject函数处理，并且在此之前不会处理中间的then的resolve函数。相当于只要错误没被处理，后面的then返回的都是rejected状态的promise。
 * 建议总是使用catch方法，而不使用then方法的第二个参数。Promise 内部的错误不会影响到 Promise 外部的代码。
 * catch方法返回的还是一个 Promise对象。如果没报错，会跳过它直接执行后面的then。catch后面还可以接catch。catch中如果没报错，后面的then还是执行resolve回调。
 * unhandledRejection和rejectionHandled事件，unhandledRejection表示没有错误处理的回调（一次事件循环内），rejectionHandled表示在新的事件循环中处理了。如果没有catch.也没有reject回调。nodejs下会报错UnhandledPromiseRejectionWarning。可以监测事件process.on('unhandledRejection',fn)。浏览器环境也有这两个事件。可以用dom0的方式或addEventListener的方式来处理。通常用unhandledRejection来记录未处理的错误的promise（map结构），用rejectionHandled来从记录的数据中清除promise。 再加上一个60000或更长的时间对未处理的进行统一处理。
 * 当一个Promise错误最初未被处理，但是稍后又得到了处理，则会触发rejectionhandled事件（上一个事件循环中还触发了unhandledRejection）。
 * 2.promise.then()返回的是promise。回调的参数是return的值。当resolve或then()返回新的promise时，promise状态取决于这个返回的promise。
 * 3.thenable。
 * 4.将普通对象转为promise对象。 传入的是thenable对象，会异步转换状态，由pending变成fullfilled。
 * 5.Promise.all().then()。的回调的参数的顺序是resolve时间顺序还是传入顺序。在某个promise被处理之后.
 */

;
(function() {

return
	var a = Promise.resolve().then(function() {
		return Promise.reject(6)
	}).then(function() {
		// return Promise.reject(6)
		lg('resolve')
	}).then(
		function() {
			lg('err then')
		},
		function() {
			lg('reject')
		}
	).then(
		function() {
			lg('resolve')
		},
		function() {
			lg('reject')
		}
	).catch(function() {
		lg('err catch')
	}).then(function() {
		lg('after err catch')
	})


	var eP = Promise.reject()

	process.on('unhandledRejection', function(...a) {
		lg(a)
	});


	process.on('rejectionHandled', function(...a) {
		lg(a)
	})

	setTimeout(function() {
		eP.catch(function() {
			lg('delay catch')
		})
	}, 1000)

	// rejectionHandled与 unhandledRejection


	var thenObj = {
		then: function(resolve) {
			resolve(77)
			console.log('then')
		}
	}

	var thenP = Promise.resolve(thenObj);

	thenP.then(function() {
		console.log(110)
	})

	lg(thenP, 888)

	setTimeout(function() {
		lg(thenP, 8881)
	})


	lg(Promise.resolve(1))
	lg(112)

})()

;(function() {

	return;
	//浏览器下是a b
	//node下是 b a 
	//所以promise链中返回的promise到底是不是异步展开的。
	var p3 = new Promise(function(resolve, reject) {
		resolve('b');
	})
	lg(p3)
	var p1 = new Promise(function(resolve, reject) {
		resolve(p3);
	})
	lg(p1)
	var p2 = new Promise(function(resolve, reject) {
		resolve('a');
	})
	p1.then(function(a) {
		lg(a)
	})
	p2.then(function(a) {
		lg(a)
	})
})();