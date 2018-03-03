 /* author:ls
  * date:20171218
  * 一个gulp插件。处理雪碧图的版本号。
  * 不使用less的时候，可在css文件中定义一个变量$version = 20171218，然后使用雪碧图时　.png?v=$version。会完成替换功能。
  */


var through = require('through2');
var gutil = require('gulp-util');

//参考：https://www.cnblogs.com/pingfan1990/p/4809128.html
// 插件级别函数 (处理文件)
function gulpCssVersion() {

    $version = '';
    versionRe = /\$version\s*?=\s*?(\w+)\s*?;/;
    versionReG = /\$version\s*?=\s*?(\w+)\s*?;/g;
    replaceRe = /=\$version\b/g;
    // 创建一个让每个文件通过的 stream 通道
    return through.obj(function(file, enc, cb) {

        if (file.isNull()) {
            // 返回空文件
            cb(null, file);
        }
        if (file.isBuffer()) {

            //读取每一个version
            var oriString = file.contents.toString();
            var newString = oriString;
            var match = oriString.match(versionRe);
            if (match) {
                $version = match[1];
            }
            if ($version) {
                newString = newString.replace(versionReG, '');
                newString = newString.replace(replaceRe, '=' + $version)
            }
            file.contents = new Buffer(newString);
        }

        cb(null, file);
    });
}
;

// 暴露（export）插件主函数
module.exports = gulpCssVersion;