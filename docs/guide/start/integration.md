# 集成到你的项目中

接下来介绍如何将`fast-crud`集成到你的`vue3`项目中

## 集成步骤

在开始着手集成之前，如果你还没有运行过demo，建议您先运行demo项目，在里面[开发一个crud](./first)感受一下

### 1.安装

```shell script
#安装fast-crud
npm i  @fast-crud/fast-crud

#安装ui，根据你选择的基础组件
# element
npm i  @fast-crud/ui-element
# or antdv
npm i  @fast-crud/ui-antdv


```

### 2.引入

 ```javascript
// 引入fast-crud
import {FastCrud} from "@fast-crud/fast-crud";
import "@fast-crud/fast-crud/dist/style.css";

// 请选择ui: element 或 antdv。二选一，不支持动态切换
// element 
import ui from "@fast-crud/ui-element";
// antdv 
import ui from "@fast-crud/ui-antdv";

// 先安装ui
app.use(ui); 
// 然后安装FastCrud
app.use(FastCrud, {
    i18n, //i18n配置，可选，默认使用中文，具体用法请看demo里的 src/i18n/index.js 文件
    // 此处配置公共的dictRequest（字典请求）
    async dictRequest({ dict }) {
        return await request({ url: dict.url }); //根据dict的url，异步返回一个字典数组
    },
    //公共crud配置
    commonOptions() {
        return {
            ... //你可以在此处配置你的crud公共配置
        };
    },
});
 ```



### 3. 安装扩展组件

如果你还需要文件上传、图片裁剪等组件   
那么你还需要安装对应的扩展插件。

以下为文件上传、图片裁剪扩展组件安装示例
```
npm install @fast-crud/extends-uploader
```
```js
import { FsUploader } from "@fast-crud/extends-uploader";
import "@fast-crud/extends-uploader/dist/style.css";
app.use(FsUploader, {
    defaultType: "cos",
    // 上传实现的配置，你使用哪一个就配置哪一个即可
    cos: {},
    alioss: {},
    qiniu: {},
    form: {},
});
```
扩展组件文档请参考[extends-uploader](../advance/extends.md)

### 4. 完成
现在`fast-crud`已经集成到你的项目中，你可以按照上一节学习的，在你的实际项目里开始你的crud开发了。

## starter
自己手动集成挺麻烦的？以下提供了当下流行的`admin`框架与`fast-crud`集成好的`starter`，开箱即用

* [vben-admin](http://fast-crud.docmirror.cn/vben/)  
