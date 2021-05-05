# 字段类型列表

此处列出目前官方支持的全部字段类型

## 文本输入框
* 字段类型: text | password | textarea

<<<@/../packages/fast-crud/src/types/list/text.ts

## 基本组件

### 选择框
* 字段类型 dict-select | dict-radio | dict-checkbox | dict-switch  
  
<<<@/../packages/fast-crud/src/types/list/select.ts

* 相关组件参数：
    * [fs-dict-select](/api/components/crud/extends/fs-dict-select.md)  
    * [fs-dict-radio](/api/components/crud/extends/fs-dict-radio.md)  
    * [fs-dict-checkbox](/api/components/crud/extends/fs-dict-checkbox)  
    * [fs-values-format](/api/components/crud/extends/fs-values-format)
* 示例：[antdv](http://fast-crud.docmirror.cn/antdv/#/component/select) | [element](http://fast-crud.docmirror.cn/element/#/component/select)
* 配置示例：
```javascript
let column={
   type: 'dict-select',
   form: {
     component: {
         name:'fs-dict-select', 
         //支持fs-dict-select的参数，
         separator: ',' ,
         //由于fs-dict-select内部封装了a-select/el-select，所以也支持这两个组件的参数
         filterable: true,
         multiple: true,
         clearable: true
     }
   },
   component:{
     name:'fs-values-format',
     props:{
       multiple:true, //默认支持多选
       separator: ',' ,//多选时，value的分隔符
     }   
   }
}

```


### 级联

* 类型  
type = dict-cascader

<<< @/../packages/fast-crud/src/types/list/cascader.ts

* 相关组件：
    * [fs-dict-cascader](/api/components/crud/extends/fs-dict-cascader.md)  
    * [fs-dict-cascader-format](/api/components/crud/extends/fs-dict-cascader-format.md)
* 示例：[antdv](http://fast-crud.docmirror.cn/antdv/#/component/cascader) | [element](http://fast-crud.docmirror.cn/element/#/component/cascader)

### 日期时间选择
* type = datetime | date | time | daterange | datetimerange

<<<@/../packages/fast-crud/src/types/list/date.ts

* 相关组件：
    * [el-date-picker](https://element-plus.gitee.io/#/zh-CN/component/date-picker#attributes)  
    * [el-time-picker](https://element-plus.gitee.io/#/zh-CN/component/time-picker)  
    * [fs-date-format](/api/components/crud/extends/fs-date-format)
* 示例：[antdv](http://fast-crud.docmirror.cn/antdv/#/component/date) | [element](http://fast-crud.docmirror.cn/element/#/component/date)
 
   

### 数字输入
* type = number

<<< @/../packages/fast-crud/src/types/list/number.ts

* 表单组件：
    * [el-input-number](https://element-plus.gitee.io/#zh-CN/component/input-number)
* 示例：[antdv](http://fast-crud.docmirror.cn/antdv/#/component/number) | [element](http://fast-crud.docmirror.cn/element/#/component/number)
 

## 其他el组件
### 开关
* type = switch
* 相关组件：
    * [el-switch](https://element-plus.gitee.io/#/zh-CN/component/switch)
* 示例：
    * <http://preview.d2-crud-plus.docmirror.cn/D2CrudPlusExample/index.html#/demo/form/el>  
### 滑动条
* type = slider
* 相关组件：
    * [el-slider](https://element-plus.gitee.io/#/zh-CN/component/slider)  
* 示例：
    * <http://preview.d2-crud-plus.docmirror.cn/D2CrudPlusExample/index.html#/demo/form/el>
### 评分
* type = rate
* 相关组件：
    * [el-rate](https://element-plus.gitee.io/#/zh-CN/component/rate)  
* 示例：
    * <http://preview.d2-crud-plus.docmirror.cn/D2CrudPlusExample/index.html#/demo/form/el>
### 颜色
* type = color-picker
* 相关组件：
    * [el-color-picker](https://element-plus.gitee.io/#/zh-CN/component/color-picker)  
* 示例：
    * <http://preview.d2-crud-plus.docmirror.cn/D2CrudPlusExample/index.html#/demo/form/el>
    
### 穿梭框
* type = transfer 
* 相关组件:
    * [el-transfer](https://element-plus.gitee.io/2.0/#/zh-CN/component/transfer)  
* 示例：
    * <http://preview.d2-crud-plus.docmirror.cn/D2CrudPlusExample/index.html#/demo/form/el>



## 扩展组件

### 文件上传，裁剪上传
* 类型
    *  file-uploader（文件上传） | image-uploader（图片上传） | avatar-uploader（头像上传，单图片）  
    *  avatar-cropper (头像裁剪上传)
    
<<< @/../packages/extends/extends-uploader/src/type/types.js
* 示例：[antdv](http://fast-crud.docmirror.cn/antdv/#/component/uploader/form) | [element](http://fast-crud.docmirror.cn/element/#/component/uploader/form)

* 相关组件文档：
    * [fs-file-uploader](/api/components/extends/uploader/fs-file-uploader.md) 
    * [fs-cropper-uploader](/api/components/extends/uploader/fs-cropper-uploader.md) 
    * [fs-cropper](/api/components/extends/uploader/fs-cropper.md)  
    * [fs-images-format](/api/components/extends/uploader/fs-images-format.md)
    * [fs-files-format](/api/components/extends/uploader/fs-files-format.md)

