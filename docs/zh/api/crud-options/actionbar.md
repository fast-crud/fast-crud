
# crudOptions.actionbar
* 说明: 动作条配置
* 类型： Object
* 更多参数： [FsActionbar](/api/components/crud/actionbar/index.md)
* 位置：
```js
const crudOptions:{
    actionbar:{
        ...动作条配置
        buttons:{
            key:{
                ...按钮配置
            }
        }
    }
}
```
## show
* 说明：显示或隐藏查询框
* 类型：Boolean
* 默认：`true`

## buttons

* 说明：按钮配置
* 类型：Object
* 默认： {add:{...FsButton}}
* 相关：[按钮组配置](../common-options.md#buttons)
* 示例：
```
{ //crudOptions.actionbar.buttons
    add:{
        ...FsButton, //fs-button组件的参数
        show:true,//是否显示此按钮
        click(){} //点击事件，默认打开添加对话框
    },
    addRow：{ // 仅行编辑模式
        //同上
    }
    //这里可以加自定义button
}
```
