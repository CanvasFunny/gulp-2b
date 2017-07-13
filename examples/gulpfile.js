/**
 * gulp-2b 使用案例
 *
 * @author wujohns
 * @date 17/7/13
 */
'use strict';

const gulp = require('gulp');
const gulp2b = require('../index');

gulp.task('concatJs', (callback) => {
    gulp2b.concatJs({
        modules: [
            // 如果只取一层目录则 src: ['src/project1/*.js']
            { src: ['srcjs/project1/**/*.js'], dest: 'dest/p1.js' },
            { src: ['srcjs/project2/**/*.js'], dest: 'dest/p2.js' },
        ],
        uglify: false,      // 是否压缩，默认为 false
        sourcemap: false,   // 是否生成sourcemap，默认为 false
        watch: false        // 是否启用监听，默认为 false（启用监听后当文件内容变动时，自动重新打包）
    }, callback);
});

gulp.task('singleJs', (callback) => {
    gulp2b.singleJs({
        groups: [
            { src: ['srcjs/project1/**/*.js'], dest: 'dest/project1' },
            { src: ['srcjs/project2/**/*.js'], dest: 'dest/project2' },
        ],
        uglify: true
    }, callback);
});

gulp.task('singleLess', (callback) => {
    gulp2b.singleLess({
        groups: [
            { src: ['srcLess/header.less', 'srcLess/footer.less'], dest: 'dest/css' },
        ],
        uglify: true
    }, callback);
});