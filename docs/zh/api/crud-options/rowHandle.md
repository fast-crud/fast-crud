# crudOptions.rowHandle
* 说明: 操作列配置
* 类型： Object

更多配置请参考[FsRowHandle](../components/crud/crud/fs-row-handle.md)    
支持 el-table-column / a-table-column 配置


## 对应ui组件的table-column的配置
* 支持： el-table-column / a-table-column / n-table-column的配置
* 配置： 具体配置请根据你使用的ui库，前往对应ui库的文档查找相应组件的配置
* 示例：
```js
const crudOptions = { 
  rowHandle: {
      align: 'center', //文本居中
      onXxxx: ()=>{}, //监听x-table-column组件的原始事件
      //...更多配置请阅读对应组件的文档
  }
}
```
## title
* 说明：操作列标题
* 类型：string

## show
* 说明：显示或隐藏操作列
* 类型：Boolean
* 默认：`true`
* 示例： [antdv版](http://fast-crud.docmirror.cn/antdv/#/crud/feature/hide)
  [element版](http://fast-crud.docmirror.cn/element/#/crud/feature/hide)
  [naive版](http://fast-crud.docmirror.cn/naive/#/crud/feature/hide)


## buttons
* 说明：按钮配置
* 类型：Object
* 示例： [antdv版](http://fast-crud.docmirror.cn/antdv/#/crud/feature/dropdown)
  [element版](http://fast-crud.docmirror.cn/element/#/crud/feature/dropdown)
* 默认：
* 相关：[按钮组配置](../common-options.md#buttons)
```json
{ //crudOptions
  rowHandle: {
    buttons: {
      view:{
          ...FsButton, // FsButton的配置，可以修改文本、颜色，也可以修改成图标按钮、纯文本按钮等
          order:1, //排序号，越小则排前面，默认值1
          show:true, 
          dropdown:false,//是否折叠此按钮，当配置为true，将会收起到dropdown中
          //点击事件,点击此按钮会触发此方法
          //此处的查看按钮如果不配置默认打开查看对话框
          click:(context)=>{} 
      },
      copy:{order:1}, //复制按钮
      edit:{order:1}, //编辑按钮
      remove:{order:1},//删除按钮
      custom:{},//自定义按钮，可以任意命名,任意数量
    }
  }
}
```

## buttons[key].render
* 说明：自定义按钮渲染
* 类型：Function
* 参数：`context:{row, column,index,  text}`

```js
//演示删除按钮popcomfirm方式弹出确认框
const crudOptions = {
  rowHandle: {
    buttons: {
      custom: {
        render(scope: any) {
          function confirm() {
            const { row, index } = scope;
            crudExpose.doRemove({ row, index }, { noConfirm: true });
          }
          return (
            <a-popconfirm title={"确定要删除这条记录吗"} ok-text="确认删除" cancel-text="取消" onConfirm={confirm}>
              <a-button>删除</a-button>
            </a-popconfirm>
          );
        }
      }
    }
  }
}

```

## buttons[key].dropdown
* 说明：按钮折叠配置，为true时，此按钮将会被折叠
* 类型：boolean


## dropdown
* 说明：按钮折叠配置，当按钮配置了dropdown=true时，将会被折叠
* 类型：Object
* 示例： [antdv版](http://fast-crud.docmirror.cn/antdv/#/crud/feature/dropdown)
  [element版](http://fast-crud.docmirror.cn/element/#/crud/feature/dropdown)
```json
{ // rowHandle.dropdown
  dropdown: {
    atLeast: 2, //当按钮大于2个时，多余的按钮将会被折叠,[注意：此参数将在1.x版中废弃]
    more: {...FsButton}//'更多'按钮的配置
    //此处支持el-dropdown,a-dropdown的配置
  }
}
```

::: warning
`dropdown.atLeast` 将在1.x版中废弃
:::


## group
* 说明：按钮分组配置
* 类型：Object
* 示例： 请参考行编辑，点击`编辑`时，会切换到`保存取消`按钮组，点击保存或取消，则切换回`编辑删除`按钮组

```json
{
  // rowHandle
  group: {
    editable: { //自由编辑模式
      "remove": {} //按钮配置
    },
    "editRow": { //行编辑模式
      "edit": {}, //进入编辑
      "save": {}, //保存
      "cancel": {}, //退出编辑
      "remove": {} //删除
    },
    yourGroupKey: { //自定义group
      buttonKey1: {},
      //按钮配置
      buttonKey2: {}
    }
  }
}
```

## active
* 说明：当前激活哪个分组，与上面的 `group`配合使用，切换一组按钮
* 类型：string
* 默认：'default'，代表当前激活的是`rowHandle.buttons`里面配置的按钮组

