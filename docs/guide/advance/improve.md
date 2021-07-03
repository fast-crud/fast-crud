# 入门常见问题
此处列出入门之后大概率会遇到的一些问题，以及解决方案

## FastCrud图标使用
1. `fast-crud`底层使用`FsIcon`组件来使用图标
2. 所有的`button`的`icon`属性都是用于配置图标的
3. 目前仅支持使用相应ui库的内置图标，后续我会考虑使用iconify
4. 在antdv里面使用的图标需要事先全局注册，然后配置`icon`为图标名称即可。

## FsAdmin图标使用
fs-admin已经支持iconify，你需要使用哪些图标直接去
https://iconify.design/icon-sets/ion/ 查找你要使用的图标

使用方式支持如下3种:
1. 将图标的`<span class=iconify/>`的完整代码复制粘贴到你的vue文件里面
2. 使用FsIconify组件配置icon为查找到的图标名称
3. 给路由菜单配置图标，`meta.icon=iconify`的图标名称即可

## 后台值与前端值不一致的问题

1. 比如表单图片上传：上传组件需要一个数组，但是提交到后台接口需要的是一个将多个图片逗号分隔的字符串。    
2. 又或者省市区级联选择：后台返回的数据是province、city、county三个字段，而前端则需要将这三个字段组成一个数组，传给表单组件。

请参考 [valueBuilder与valueResolve](/api/crud-options/columns.md#valuebuilder与valueresolve)

## 如何配置组件参数
fast-crud文档里面不会包含底层ui组件的文档。当你要配置组件不同的参数时，需要去查找对应的组件文档，然后配置在`xxx.component`下    
具体请参考[字段组件配置](./component.md#字段组件配置)
 
