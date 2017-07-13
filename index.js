/**
 * 对通用处理方法的汇总（可被其他工程使用）
 *
 * gulp 工具类方法
 *
 * @author pool(wujohns)
 * @date 16/12/6
 */
'use strict';

const _ = require('lodash');
const gulp = require('gulp');
const gutil = require('gulp-util');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');
const less = require('gulp-less');
const async = require('async');

class Gulp2BUtils {
    /**
     * gulp中js通用数据流转换（包含sourcemap与压缩）
     * @param {Object} stream - gulp数据流
     * @param {Object} config - 转换配置
     * @param {Boolean} config.sourcemap - 是否启用sourcemap功能
     * @param {Boolean} config.uglify - 是否启用压缩功能
     */
    static _commonJsTransform (stream, config) {
        if (_.get(config, 'sourcemap')) stream = stream.pipe(sourcemaps.init({ loadMaps: true }));
        if (_.get(config, 'uglify')) stream = stream.pipe(uglify());
        if (_.get(config, 'sourcemap')) stream = stream.pipe(sourcemaps.write('./'));
        return stream;
    }

    /**
     * gulp中less通用数据流转换（包含sourcemap与压缩）
     * @param {Object} stream - gulp数据流
     * @param {Object} config - 转换配置
     * @param {Boolean} config.sourcemap - 是否启用sourcemap功能
     * @param {Array} plugins - 转换时使用的less插件（详细参考：http://lesscss.org/usage/#plugins）
     * @param {Object} globalVars - 转换时添加进去的全局变量
     */
    static _commonLessTransform (stream, config) {
        if (_.get(config, 'sourcemap')) stream = stream.pipe(sourcemaps.init({ loadMaps: true }));

        const lessConfig = _.pick(config, ['plugins', 'globalVars']);
        stream = stream.pipe(less(lessConfig));
        
        if (_.get(config, 'sourcemap')) stream = stream.pipe(sourcemaps.write('./'));
        return stream;
    }

    /**
     * 多数据流的end事件汇总处理
     * @param {String} taskName - 该组stream所属的任务
     * @param {Array} streams - 数据流数组
     * @param {Function} callback - 回调函数
     */
    static _streamsEndListening (taskName, streams, callback) {
        async.each(streams, (stream, callback) => {
            stream.on('end', () => {
                return callback();
            });
        }, () => {
            console.log(`${ taskName } finished`);
            return callback();
        });
    }

    /**
     * 多组js的合并
     *
     * @param {Object} config - 合并配置
     * @param {Array} config.modules - 参与合并的文件的配置
     * @param {String} config.modules[].dest - 合并后文件的存储路径
     * @param {Array} config.modules[].src - 参与合并的文件
     * 
     * @param {Boolean} config.sourcemap - 是否启用sourcemap功能
     * @param {Boolean} config.uglify - 是否启用压缩功能
     * @param {Boolean} config.watch - 是否启用文件变动监听（变动后自动编译相关部分）
     *
     * @param {Function} callback - 回调函数（当第一次的编译完成时调用）
     */
    static concatJs (config, callback) {
        const streams = [];
        config.modules.forEach((module) => {
            let addListener = false;
            const bundle = () => {
                // stream的基础编译
                let stream = gulp.src(module.src).pipe(concat(module.dest));
                stream = Gulp2BUtils._commonJsTransform(stream, config).pipe(gulp.dest('./'));
                // 对stream的end做监听
                if (!addListener) {
                    streams.push(stream);
                    addListener = true;
                }
                // reload实现（浏览器刷新）
                if (config.reload) {
                    stream.pipe(config.reload({stream: true}))
                }
            };

            // 文件变动监听
            if (config.watch) {
                const watcher = gulp.watch(module.src, () => {
                    bundle();
                });
                watcher.on('change', gutil.log);
            }
            bundle();
        });
        Gulp2BUtils._streamsEndListening('concatJs', streams, callback);
    }

    /**
     * 单独的js处理
     *
     * @param {Object} config - 单独js处理配置
     * @param {Array} config.groups - js批次的配置
     * @param {String} config.groups[].dest - 该批次js目标存储目录
     * @param {Array} config.groups[].src - 该批次js来源（支持正则匹配）
     *
     * @param {Boolean} config.sourcemap - 是否启用sourcemap功能
     * @param {Boolean} config.uglify - 是否启用压缩功能
     * @param {Boolean} config.watch - 是否启用文件变动监听（变动后自动编译相关部分）
     *
     * @param {Function} callback - 回调函数（当第一次的编译完成时调用）
     */
    static singleJs (config, callback) {
        const streams = [];
        config.groups.forEach((group) => {
            let addListener = false;
            const bundle = () => {
                let stream = gulp.src(group.src);
                stream = Gulp2BUtils._commonJsTransform(stream, config).pipe(gulp.dest(group.dest));
                if (!addListener) {
                    stream.dest = group.dest;
                    streams.push(stream);
                    addListener = true;
                }
                if (config.reload) {
                    stream.pipe(config.reload({stream: true}))
                }
            };
            if (config.watch) {
                const watcher = gulp.watch(group.src, () => {
                    bundle();
                });
                watcher.on('change', gutil.log);
            }
            bundle();
        });
        Gulp2BUtils._streamsEndListening('singleJs', streams, callback);
    }

    /**
     * 单独的less编译处理（没有合并操作）
     *
     * @param {Object} config - 编译配置
     * @param {Array} config.groups - 参与编译的文件的配置
     * @param {String} config.groups[].dest - 该批次less的目标存储目录
     * @param {Array} config.groups[].src - 该批次js来源（支持正则匹配）
     *
     * @param {Boolean} config.sourcemap - 是否启用sourcemap功能
     * @param {Array} plugins - 转换时使用的less插件（详细参考：http://lesscss.org/usage/#plugins）
     * @param {Object} globalVars - 转换时添加进去的全局变量
     * @param {Boolean} config.watch - 是否启用文件变动监听（变动后自动编译相关部分）
     */
    static singleLess (config, callback) {
        const streams = [];
        config.groups.forEach((group) => {
            let addListener = false;
            const bundle = () => {
                let stream = gulp.src(group.src);
                stream = Gulp2BUtils._commonLessTransform(stream, config).pipe(gulp.dest(group.dest));
                if (!addListener) {
                    stream.dest = group.dest;
                    streams.push(stream);
                    addListener = true;
                }
                if (config.reload) {
                    stream.pipe(config.reload({stream: true}))
                }
            };
            if (config.watch) {
                const watcher = gulp.watch(group.src, () => {
                    bundle();
                });
                watcher.on('change', gutil.log);
            }
            bundle();
        });
        Gulp2BUtils._streamsEndListening('singleLess', streams, callback);
    }
}

module.exports = Gulp2BUtils;