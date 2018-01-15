function A(){
	this.a = 1;
}

A.prototype = {
	constructor:A,
	fnA:function(){
		console.log('fa');
	}
}


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
function B(){
	A.apply(this,arguments);
	// C.apply(this);
}
var b = new B();
console.log(b)

//4.多重继承加设置原型。A调用了两次。
function B(){
	A.apply(this,arguments);
	// C.apply(this);
}
B.prototype = new A()
var b = new B();
b.fnA()
console.log(b)

//5.临时构造函数
function C(){}
C.prototype = A.prototype;
B.prototype = new C();

var b = new B()
