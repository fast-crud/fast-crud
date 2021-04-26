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
{
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
