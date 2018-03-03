function Promise(fn){
    this.status = 'pending';    
    fn(this.resolve.bind(this),this.reject.bind(this));
    this.resolveList = [];
    this.rejectList = [];
    this.arguments;
}
Promise.prototype = {
    then:function(resolve,reject){
        resolve && this.resolveList.push(resolve);
        reject && this.rejectList.push(reject);
        var callList;
        if(this.status == 'pending'){
            return;
        }
        if(this.status == 'fulfilled'){
            callList = this.resolveList;
        }
        if(this.status == 'rejected'){
            callList = this.rejectList;
        }
        //callback中可能会增加内容长度。
        while(callList.length>0){
            var callback = callList.pop();
            typeof callback == 'function' && callback.apply(null,arguments)
        }

    },
    resolve:function(){
        this.status = 'fulfilled'
        this.resolve = this.reject = function(){}
        this.arguments = arguments;
        this.then();
    },
    reject:function(){
        this.status = 'rejected'
        this.resolve = this.reject = function(){}
        this.arguments = arguments;
        this.then()
    },

}



var promise = new Promise(function(resolve,reject){
    setTimeout(function(){

        Math.random()>0.5?resolve(1):reject(2)
    })
    
})

function callback_y(){
    console.log('callback_y')
}
function callback_n(){
    console.log('callback_n')
}

promise.then(callback_y,callback_n)
setTimeout(function(){
    console.log(promise);
    promise.then(callback_y,callback_n)
})

promise.then(function(){
    console.log('y')
},function(){
    console.log('n')
})

promise.then(callback_y,callback_n)