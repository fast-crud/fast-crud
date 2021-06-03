# rowHandle
* 说明: 操作列配置
* 类型： Object

更多配置请参考[FsRowHandle](../components/crud/crud/fs-row-handle.md)    
支持 el-table-column / a-table-column 配置
## show
* 说明：显示或隐藏查询框
* 类型：Boolean
* 默认：`true`

## buttons
* 说明：按钮配置
* 类型：Object
* 默认：
```json5
{ //crudOptions
  rowHandle: {
    atLeast: 2, //按钮折叠配置，至少显示多少个按钮，多余的折叠
    buttons: {
      view:{
          ...FsButton,
          order:1,
          show:true,
          click:()=>{} //点击事件,默认打开查看对话框
      },
      edit:{},
      remove:{},
      custom:{},
    }
  }
}
```

## dropdown
* 说明：按钮折叠配置，当按钮数多于`dropdown.atLeast`的个数时，将会被折叠
* 类型：Object
```json5
{ // rowHandle.dropdown
  dropdown: {
    atLeast: 2, //当按钮大于2个时，多余的按钮将会被折叠
    more: {...FsButton}//'更多'按钮的配置
    //此处支持el-dropdown,a-dropdown的配置
  }
}
```
