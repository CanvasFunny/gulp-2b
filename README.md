# gulp-2b  
一些常用的gulp操作汇总，针对非es6的前端工程  

## 安装
npm install gulp-2b

## 接口使用介绍  
`gulp-2b` 主要提供了三个函数：  
`concatJs` - 用于将多个 js 文件的合并为一个 js（可配置压缩、suorcemap、自动编译）  
`singleJs` - 用于操作单个 js 文件（可配置压缩、suorcemap、自动编译）  
`singleLess` - 用于操作单个 less 文件（可配置压缩、suorcemap、插件、自动编译）  

## 案例讲解  
### concatJs  
现有目录结构如下：  

```javascript
project
+--src
    +--project1
        +-- p1_1.js
        +-- p1_2.js
        ...
    +--project2
        +-- p2_1.js
        +-- p2_2.js
        ...
    +--ex.js
+--dest
```

现在想将 `src/project1` 目录中的 **所有的js文件** 打包合并到 `dest/p1.js`，
将 `src/project2` 目录中的 **所有的js文件** 打包合并到 `dest/p2.js`，那么做法如下：

```javascript
const gulp2b = require('gulp-2b');
gulp2b.concatJs({
    modules: [
        // 如果只取一层目录则 src: ['src/project1/*.js']
        { src: ['src/project1/**/*.js'], dest: 'dest/p1.js' },
        { src: ['src/project2/**/*.js'], dest: 'dest/p2.js' },
    ],
    uglify: false,      // 是否压缩，默认为 false
    sourcemap: false,   // 是否生成sourcemap，默认为 false
    watch: false        // 是否启用监听，默认为 false（启用监听后当文件内容变动时，自动重新打包）
}, (err) => {
    // 任务完成后的操作，可自定义
});
```

如果想将 `src/project1` 目录中的 **所有的js文件** 以及 `src/ex.js` 压缩打包合并到 `dest/p1.min.js`：
```javascript
const gulp2b = require('gulp-2b');
gulp2b.concatJs([
    modules: [
        { src: ['src/project1/**/*.js', 'src/ex.js'], dest: 'dest/p1.min.js' }
    ],
    uglify: true
], (err) => {
    // 任务完成后的操作，可自定义
});
```

### singleJs
还是之前的目录结构：

```javascript
project
+--src
    +--project1
        +-- p1_1.js
        +-- p1_2.js
        ...
    +--project2
        +-- p2_1.js
        +-- p2_2.js
        ...
    +--ex.js
+--dest
```

现在想将 `src/project1` 目录中的 **所有的js文件** 进行压缩并移动到 `dest/project1` 目录中，
将 `src/project2` 目录中的 **所有的js文件** 进行压缩并移动到 `dest/project2` 目录中。实现如下：

```javascript
const gulp2b = require('gulp-2b');
gulp2b.singleJs({
    groups: [
        { src: ['src/project1/**/*.js'], dest: 'dest/project1' },
        { src: ['src/project2/**/*.js'], dest: 'dest/project2' },
    ],
    uglify: true
}, (err) => {
    // 任务完成后的操作，可自定义
});
```

执行后 `dest` 目录下文件结构：

```
+--dest
    +--project1
        +-- p1_1.js
        +-- p1_2.js
        ...
    +--project2
        +-- p2_1.js
        +-- p2_2.js
        ...
```

需要注意的是移动的时候无法保持原有的目录结构，例如原先的 `src/project1/xx/aa.js` 在上述
操作中，就移动到了 `dest/project1/aa.js`。

### singleLess
与 singleJs 操作类似，主要用于 less 的编译。现有目录结构如下：

```javascript
project
+--src
    +--header
        +-- h1.less
        +-- p2.less
        ...
    +--footer
        +-- h1.less
        +-- h2.less
        ...
+--dest
```

将 `src/header` 与 `src/footer` 中的 less 文件编译到 `dest/header` 与 `dest/footer` 目录中。实现如下：

```javascript
const gulp2b = require('gulp-2b');
gulp2b.singleLess({
    groups: [
        { src: ['src/project1/**/*.less'], dest: 'dest/project1' },
        { src: ['src/project2/*.less'], dest: 'dest/project2' },
    ],
    uglify: true,
    watch: false,
    sourcemap: false,
    plugins: [],    // 非必要参数，可添加自定义less插件
    globalVars: { key: '"value"' }  // 向less编译过程中注入的全局变量
}, (err) => {
    // 任务完成后的操作，可自定义
});
```

执行后 `dest` 目录下文件结构：

```
+--dest
    +--header
        +-- h1.less
        +-- p2.less
        ...
    +--footer
        +-- h1.less
        +-- h2.less
        ...
```

### 关于contactLess
由于 `less` 自带相应的 `import` 机制，所以推荐使用 `less` 的该机制进行组装，而不是交给gulp，所以这里
没有去实现这一部分。

### 配合 gulp
参考 `examples` 目录下的 `gulpfile.js`