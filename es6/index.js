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
//
(function() {
	function* quips(name) {

		yield "你好 " + name + "!";
		yield "希望你能喜欢这篇介绍 ES6 的译文";
		if (name.startsWith("X")) {
			yield "你的名字 " + name + " 首字母是 X，这很酷！ ";
		}
		yield "我们下次再见！ ";
	}

	var a = quips('ls');//返回一个生成器对象
	// console.log(a.next());//{ value: '你好 ls!', done: false }
	// console.log(a.next());//{ value: '希望你能喜欢这篇介绍 ES6 的译文', done: false }
	// console.log(a);//{}
	// console.log(a.next());//{ value: '我们下次再见！ ', done: false }
	// console.log(a.next());//{ value: undefined, done: true }
	
	for(var i of a){
		console.log(i);
	}
	//你好 ls!
	//希望你能喜欢这篇介绍 ES6 的译文
	//我们下次再见！ 
})();