
# crudOptions.search
查询框配置    
更多参数见：[FsSearch](/api/components/crud/search/index.md)



## show
* 说明：显示或隐藏查询框
* 类型：Boolean
* 默认：`true`

## buttons
* 说明：按钮配置
* 类型：Object
* 默认： `{search:{},reset:{}}`
* 相关：[按钮组配置](../common-options.md#buttons)
* 示例：

```js
const crudOptions = {
  search: {
    buttons: {
        search:{
            ...FsButton, //fs-button组件的参数
            order:1, //排序，越小越靠前
            show:true,//是否显示此按钮
            click(){} //点击事件，默认触发查询
        },
        reset:{...同上},// 重置按钮
        custom:{...同上}//可以自定义
    }
  }
}
```
[FsButton](../common-options)


## buttonsPosition
* 说明：按钮位置 (已废弃)
* 类型：string，可选【default，bottom】
* 默认：`default`


## initialForm
* 说明：初始化查询表单数据
* 类型：Object
* 默认：null

## validatedForm
* 说明：校验通过后的查询表单数据，你可以在`computed`中调用`crudBinding.value.search.validatedForm.xxx`来根据查询条件进行动态计算
* 类型：Object
* 默认：{}


## columns
* 说明：查询字段配置
* 类型：Object
* 默认： {}
* 示例：


## columns[key][对应ui组件的配置]
* 说明：支持对应ui库的form-item组件的配置
* 支持：el-form-item,a-form-item,n-form-item的配置
* 类型：Object
* 备注：此属性无需配置，`useCrud`后会从`crudOptions.columns[key].search`中复制过来,你只需要配置各个字段的`search`即可


## columns[key].component
* 说明：查询字段组件配置
* 类型：Object
参考组件配置[component](../common-options.md)


## options
* 说明：表单参数
* 类型：Object
* 支持：el-form,a-form,n-form的参数


## formItem
* 说明：每个条件的form-item公共配置，比如可以配置label的宽度、靠左还是靠右等
* 类型：Object
* 支持：el-form-item,a-form-item,n-form-item的参数

## container
* 说明：布局容器，支持search自定义布局
* 类型：Object
* 默认： `{is:'fs-search-layout-default'}`
* 参考： [fs-search-layout-default](https://github.com/fast-crud/fast-crud/blob/main/packages/fast-crud/src/components/search/layout-default.vue)
```js
const crudOptions = {
    search:{
        container:{
            is:'your-custom-layout-component-name',
            collapse:true, //是否展开，你布局组件中定义的props
            'onUpdate:collapse':(value)=>{
              crudBiding.value.search.container.collapse = value  
            },
            action:{
                label:"操作", //查询按钮前缀
                col:{ span: 4} //查询按钮所占格子宽度
            },
            col:{ span:4}, // 默认列宽度配置
            collapseButton:{ //展开按钮配置
                // fs-button 属性
            }
        },
    }
}

```

## on_search
* 说明：点击查询按钮实际触发的search（框架使用），覆盖它将不执行默认查询操作，你需要自定义查询
* 类型：`async Function(context)`

```js
const crudOptions = {
    search:{
        on_search(context:any){
            console.log('default search is off')
        }
    }
}
```

## onSearch
* 说明：监听查询点击事件（用户使用）
* 类型：`async Function(context)`

```js
const crudOptions = {
    search:{
        onSearch(context:any){
            console.log('search clicked',context)
        }
    }
}
```

## on_reset
* 说明：监听重置事件(框架使用)
* 类型：`async Function(context)`


## onReset
* 说明：监听重置事件（用户使用）
* 类型：`async Function(context)`

```js
const crudOptions = {
    search:{
        onReset(context:any){
            console.log('reset click',context)
        }
    }
}
```

## validate
* 说明：是否启用表单验证
* 类型：Boolean
* 默认：`false`
* 注意： naive-ui 需要配置 `search.options.showFeedback` 为`true`,才能显示错误提示
```js
const crudOptions = {
    search:{
        validate:true,
        options:{
            showFeedback:true
        }
    }
}
``` 

## onValidateError
* 说明：监听校验错误事件
* 类型：`async Function(context)`
* 默认值： `()=>{ui.notification.error({message:'查询表单校验失败'})}` 弹出查询表单校验失败通知
```js
const crudOptions = {
    search:{
        onValidateError(context:any){
            console.log('validate  error',context.error)
        }
    }
}
```

## autoSearch
* 说明：是否字段变更后自动触发查询
* 默认值：true

## col
* 说明：每项宽度统一配置
* 示例：
```js
const crudOptions = {
    search:{
        col:{
            span:6  // 表示每列占6/24宽度，一行4列
            //为了自适应，你也可以配置 {xs:6,sm:4,md:3,lg:2,xl:1}
            //或者直接配置 'auto'，流式排列
        }
    }
}
```

## 更多参数
* 说明：更多参数见：[FsSearch](/api/components/crud/search/index.md)组件文档
