# 入门常见问题
此处列出入门之后大概率会遇到的一些问题，以及解决方案

## 图标使用
1. `fast-crud`底层使用`FsIcon`组件来使用图标，通过`icon`属性来配置图标
2. 当`icon`参数包含`:`时会被识别为iconify图标（例如：`icon="ion:apps-sharp"`），否则视为ui库的内置图标(例如`icon="CheckOutlined"`)
3. 使用antdv的内置图标需要事先全局注册该图标。
4. 使用iconify图标见下一条

## Iconify图标使用
1. 如果要使用Iconify图标，需要配置[PurgeIcons](https://github.com/antfu/purge-icons) 的`vite`插件,然后在main.ts中`import "@purge-icons/generated";`
2. 然后去[iconify图标库](https://iconify.design/icon-sets/ion/) 中查找你要使用的图标，复制图标名称，配置到`icon`属性即可.
3. 注意图标名称要是`xxx:yyyy`格式的，中间要有冒号。如果图标没有冒号的，请确认当前图标所在图标库名，图标库名后面的第一个`-`换成`:`即可
4. fs-admin、vben-admin 默认已经支持iconify。

## 菜单图标
 给路由菜单配置iconify图标即可显示图标，`meta.icon=iconifyName`

## 后台值与前端值类型不一致的问题
1. 比如表单图片上传：上传组件需要一个数组，但是提交到后台接口需要的是一个将多个图片逗号分隔的字符串。    
2. 又或者省市区级联选择：后台返回的数据是province、city、county三个字段，而前端则需要将这三个字段组成一个数组，传给表单组件。

请参考 [valueBuilder与valueResolve](/api/crud-options/columns.md#valuebuilder与valueresolve)

## 如何配置组件参数
fast-crud文档里面不会包含底层ui组件的文档。当你要配置组件不同的参数时，需要去查找对应的组件文档，然后配置在对应的地方    
具体请参考[字段组件配置](./component.md#字段组件配置)
 
## 后台接口参数和返回数据结构与fast-crud的数据结构不一致
请参考文档[request请求配置](/api/crud-options/request.html#request-【请求】)


## 关于rowKey
`a-table`和`el-table`都有`rowKey`的设置。       
默认情况下，`fast-crud` 将`rowKey`设置为`id`。      
当你后台返回的列表数据主键列名称就是`id`，则无需关心此设置。  
否则你需要修改rowKey的配置
```js
const crudOptions ={
    table:{
        rowKey:'yourIdName',
        editable:{
            //如果你启用了行编辑，那么还需要修改行编辑的rowKey
            rowKey:'yourIdName',
        }   
    }
}

``` 

## 设置日志级别
日志级别包括: `debug`、 `info` 、`warn`、 `error`
```js
import {setLogger} from '@fast-crud/fast-crud'
setLogger({level:'error'})
```

## 关于render
fs中有很多地方可以配置带render的方法，例如：`columns.key.form.render`、`columns.key.form.topRender`、`columns.key.column.cellRender`、`columns.key.form.prefixRender`等等。
所有这些render方法都是通过`jsx/tsx`进行自定义渲染.

使用方法如下：
```js
const crudOptions ={
    columns:{
        name:{
            form:{
                render:(context)=>{
                    return <a-input v-model={[context.form.name, "value"]} />    //<------注意这里的v-model写法
                }
            }
        }
    }
}
```

更多jsx语法，请参考文档：https://github.com/vuejs/babel-plugin-jsx

