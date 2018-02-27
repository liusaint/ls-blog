//set weakSet Map weakMap
(function(){

	var set = new Set();
	var set1 = new Set([1,2,3,4,1,2]);
	console.log(set1.size)
	console.log(set1.add(5))
	set1.delete(1);
	console.log(set1)
	console.log(set1.add('5'));//内部使用Object.is()来判断
	console.log(set1.has(2));
	set1.clear();
	console.log(set1);
	set1.forEach(function a(value,key,set){},this);//第二个参数可传入this

	console.log([...new Set([1,2,3,2,3])]);//数组去重以及转化。


	//https://zhuanlan.zhihu.com/p/25454328 weakMap和弱引用

	// Map的key支持所有数据类型。
	var map = new Map();
	map.set('a',123);
	map.get('a');
	// map.has(key);
	// map.delete(key);
	// map.clear();

})()