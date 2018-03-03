// function A(){
// 	this.a = 1;
// }

// A.prototype = {
// 	constructor:A,
// 	fnA:function(){
// 		console.log('fa');
// 	}
// }


// function B(){

// }


//1以实例为原型。
// B.prototype = new A();

// var b = new B();
// b.fnA()

//2共享原型。
// B.prototype = A.prototype;
// var b = new B();
// b.fnA()

//3多重继承。
// function B(){
// 	A.apply(this,arguments);
// 	// C.apply(this);
// }
// var b = new B();
// console.log(b)

//4.多重继承加设置原型。A调用了两次。
// function B(){
// 	A.apply(this,arguments);
// 	// C.apply(this);
// }
// B.prototype = new A()
// var b = new B();
// b.fnA()
// console.log(b)

//5.临时构造函数
// function C(){}
// C.prototype = A.prototype;
// B.prototype = new C();

// var b = new B()

function A(){
	this.a = 1;
}
A.prototype = {
	constructor:A,
	fna:function(){
		console.log(1)
	}
}
var b =Object.create(A.prototype)
console.log(b)



// 面向对象编程
// 封装  把一个对象的状态和行为聚合在一起。与外部世界保持一条界限。
// 多态  同一个类的子类的有不同的表现。多态性是一种比封装和继承更难掌握的概念。在本质上，多态性表示属于一个分层结构的同一个分支的对象，在发送相同的消息时（也即在被告知执行同一件事时），可通过不同方式表现出该行为。
// 继承	 子类天然带有父类的方法。使得特殊化的类 — 无需额外的代码 — 可以 “复制” 它们要特殊化的来源类的属性和行为。如果其中一些属性或行为需要更改，您可覆盖它们。您更改的唯一的源代码是创建特殊化的类所需的代码。来源对象称为父对象，新的特殊化对象称为子对象
// https://www.ibm.com/developerworks/cn/java/j-perry-object-oriented-programming-concepts-and-principles/index.html
// http://blog.csdn.net/cancan8538/article/details/8057095