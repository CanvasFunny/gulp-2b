/**
 * module bundler with simple configure
 */
'use strict';

const packageConfig = {
    // 基础说明配置
    name: 'gulp-2b',
    version: '1.0.1',
    author: 'wujohns',
    description: 'Common Actions For Gulp',
    homepage: 'https://github.com/CanvasFunny/gulp-2b',
    license: 'MIT',

    /**
     * scripts
     */
    scripts: {},

    /**
     * 代码库
     */
    repository: {
        type: 'git',
        url: 'https://github.com/CanvasFunny/gulp-2b.git'
    },

    /**
     * 关键字
     */
    keywords: [
        'gulp', 'gulp-2b', 'js', 'css', 'less'
    ],

    /**
     * bugs
     */
    bugs: {
        url: 'https://github.com/CanvasFunny/gulp-2b/issues'
    },

    engine: {
        node: '>=4.0.0'
    },

    dependencies: {
        // 基础工具
        'lodash': '^4.17.4',
        'async': '^2.5.0',

        // gulp 相关
        'gulp': '^3.9.1',
        'gulp-util': '^3.0.8',
        'gulp-concat': '^2.6.1',
        'gulp-sourcemaps': '^2.6.0',
        'gulp-uglify': '^3.0.0',
        'gulp-watch': '^4.3.11',
        'gulp-less': '^3.3.2'
    },

    devDependencies: {}
};

const fs = require('fs');
const path = require('path');
const targetFile = path.join(__dirname, './package.json');
fs.writeFileSync(targetFile, JSON.stringify(packageConfig, null, 2), {
    encoding: 'utf8',
    flags: 'w',
    mode: 0o666
});