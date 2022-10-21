
# search【查询框】
更多参数见：[FsSearch](/api/components/crud/search/index.md)

## show
* 说明：显示或隐藏查询框
* 类型：Boolean
* 默认：`true`

## buttons
* 说明：按钮配置
* 类型：Object
* 默认： {search:{},reset:{}}
* 相关：[FsButton配置](../common-options.md#buttons)
* 示例：
```json
{//crudOptions.search.buttons
    search:{
        ...FsButton, //fs-button组件的参数
        order:1, //排序，越小越靠前
        show:true,//是否显示此按钮
        click(){} //点击事件，默认触发查询
    },
    reset:{...同上},// 重置按钮
    custom:{...同上}//可以自定义
}
```
[FsButton](../common-options)


## buttonsPosition
* 说明：按钮位置
* 类型：string，可选【default，bottom】
* 默认：`default`


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

## doSearch
* 说明：触发查询
* 类型：async Function(context)
* 

## options
* 说明：表单参数
* 类型：Object
* 支持：el-form,a-form的参数


## 更多参数
* 说明：更多参数见：[FsSearch](/api/components/crud/search/index.md)组件文档
