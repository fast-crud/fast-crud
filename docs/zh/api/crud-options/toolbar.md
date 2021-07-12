
# toolbar 工具条

更多参数见：[FsToolbar](/api/components/crud/toolbar/index.md)

## show
* 说明：显示或隐藏工具条
* 类型：Boolean
* 默认：`true`

## buttons

* 说明：按钮配置
* 类型：Object
* 默认：[buttons](#buttons)
```json5
{ //crudOptions.toolbar.buttons
    //查询按钮
    search:{
        ...FsButton,
        order:1,
        show:true,
        click:()=>{} //点击事件，默认开启隐藏查询框
    },
    // 刷新按钮
    refresh:{},
    // 紧凑模式
    compact:{},
    // 导出按钮
    export:{},
    // 列设置按钮
    columns:{}
}
```

## compact
* 说明：当前是否紧凑模式
* 类型：Boolean
* 默认：`true`
