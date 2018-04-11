/*一个简单的订阅发布 
只包含事件订阅，触发，取消订阅。没有命名空间相关的处理。有时间再完善吧
*/

class Event {
    constructor() {
        this.eventObj = {};
    }
    on(type, fn) {

        if (!this.eventObj[type]) {
            this.eventObj[type] = [];
        }
        this.eventObj[type].push(fn);
    }
    off(type, fn) {
        if (!type) {

            this.eventObj = {};
        } else if (!fn) {

            delete this.eventObj[type]
        } else {

            for (var i = 0; i < this.eventObj[type].length;) {

                var fnItem = this.eventObj[type][i]
                if (fnItem == fn) {
                    this.eventObj[type].splice(i, 1)
                } else {
                    i++;
                }
            }
        }
    }
    trigger(type) {
        if (!this.eventObj[type]) {
            return;
        }
        this.eventObj[type].forEach(function(val, key) {
            val();
        })
    }
}

var event = new Event()
var fn = function() {
    console.log('haha');
}
event.on('ha', fn)
event.on('ha', function() {
    console.log('haha');
})
event.trigger('ha')
event.off('ha', fn)
event.trigger('ha')