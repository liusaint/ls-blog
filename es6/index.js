//es6学习


/*for of*/
(function() {
	return;
	var arr = [1, 2, 3, 4, 5];
	var obj = {
		a: 'a0',
		b: 'b0'
	}
	var i;

	for (i of arr) {
		console.log(i)
	}

	for (i of arguments) {
		console.log(i)
	}

})(11, 22, 33, 44, 55);


//插曲 apply传入arguments会如何.
//apply应该传入数组或arguments
//内外arguments是不一样的。
(function() {

	return;
	var argOut = arguments;

	function a() {
		console.log(arguments, arguments == argOut);
	};
	a.apply(this, arguments);


})(11, 22, 33, 44, 55);

//生成器 
//1.基本使用
(function() {
	return;

	function* quips(name) {

		yield "你好 " + name + "!";
		yield "希望你能喜欢这篇介绍 ES6 的译文";
		if (name.startsWith("X")) {
			yield "你的名字 " + name + " 首字母是 X，这很酷！ ";
		}
		yield "我们下次再见！ ";
	}

	var a = quips('ls'); //返回一个生成器对象
	// console.log(a.next());//{ value: '你好 ls!', done: false }
	// console.log(a.next());//{ value: '希望你能喜欢这篇介绍 ES6 的译文', done: false }
	// console.log(a);//{}
	// console.log(a.next());//{ value: '我们下次再见！ ', done: false }
	// console.log(a.next());//{ value: undefined, done: true }

	for (var i of a) {
		console.log(i);
	}
	//你好 ls!
	//希望你能喜欢这篇介绍 ES6 的译文
	//我们下次再见！ 
})();

//2.循环呢？
(function() {
	return;

	function* a() {
		yield a();
	}
	var ite = a();
	for (var i of ite) {
		console.log(i)
	}

})();

//let块级声明
(function() {
	return;
	b++;
	console.log(b); //NaN
	var b = 1;

	// c++; //ReferenceError: c is not defined  暂时性死区
	// let c = 1;
	// let c = 1; //SyntaxError: Identifier 'c' has already been declared

	// var d = 1;//SyntaxError: Identifier 'd' has already been declared
	// let d = 1;
})();

//const 块级 死区 不重复定义 
(function() {
	return;
	//a++;//ReferenceError: a is not defined

	//声明时必须进行初始化
	const a = 1;
	// const b ;//SyntaxError: Missing initializer in const declaration

	// const a = 2;//SyntaxError: Identifier 'a' has already been declared
	// var a = 2;//SyntaxError: Identifier 'a' has already been declared
	// typeof obj;//ReferenceError: obj is not defined
	const obj = {}
	obj.a = 1;
	// obj = {}//TypeError: Assignment to constant variable.
	console.log(obj)

})();