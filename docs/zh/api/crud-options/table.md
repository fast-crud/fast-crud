
## table【表格配置】

更多参数见：[FsTable](/api/components/crud/crud/fs-table.md)
支持 el-table | a-table的配置

## show
* 说明：显示或隐藏table
* 类型：Boolean
* 默认：`true`

## 对应ui库的table组件的参数
* 说明：支持fs-table/el-table/a-table/n-table的参数
* 配置： 具体配置请根据你使用的ui库，前往对应ui库的文档查找相应组件的配置
```json
{// crudOptions
    table:{
          border: true,
          bordered: true,
          height: "100%",
          rowKey: "id",
          size: "small",
          stripe: true
    }
}
```

## columns
* 说明：列配置
* 类型：Array

## loading
* 说明：当前是否加载中
* 类型：Boolean
* 示例：自定义显示loading
```vue
<fs-crud ref="crudRef" v-bind="crudBinding">
    <template #default>
        <div class="loading" v-if="crudBinding.table.loading"></div>
    </template>
</fs-crud>
```

## slots
* 说明：table插槽
* 类型：{ slotName: Function(scope){ return jsx } }
* 示例：
```js
{ //crudOptions
  table: {
    slots: {
       // el-table的append插槽
       //https://element-plus.gitee.io/#/zh-CN/component/table#table-slot
       append(scope){
         // 注意，这里使用了jsx，所以crud.js文件后缀名要改成crud.jsx
         return <div>{scope}</div>
       },
       // a-table的expandedRowRender插槽
       //https://2x.antdv.com/components/table-cn#components-table-demo-expand
       expandedRowRender(scope){
        // 注意，这里使用了jsx，所以crud.js文件后缀名要改成crud.jsx
         return <div>行展开数据</div>
       }

    }
  }
}
```
## onSortChange
* 说明：表头排序改变事件
* 类型：Function
* 默认：通常无需配置，自动根据配置触发服务端排序或本地排序，只需要在pageRequest中处理sort相关参数即可
```js
{
  table:{
    onSortChange({isServerSort, prop, asc, order}){
        
    }
  }    
    
}
```

## onFilterChange
* 说明：表头筛选变化事件
* 类型：Function
* 默认值：无
```js
{
  table:{
    onFilterChange(filters){
          // 你的过滤操作
          // 比如你想要服务端过滤，就可以修改查询表单，然后触发doSearch
    }
  }    
    
}
```

## onRefreshed
* 说明：doRefresh之后触发
* 类型：Function
* 默认值：无
```js
{
  table:{
    onRefreshed(){
        //列表数据变化时的操作
    }
  }    
}
```


## conditionalRender
* 说明：条件render，符合条件的情况下优先执行render
* 类型： `{match:(scope)=>boolean,render:(scope)=>any}`
* 默认值：无
* 示例： 以下演示，对所有的cell，当其`value`为空值时，显示一个`-`
```js
{
  table:{
      conditionalRender: {
          match(scope) {
              return !scope.value;
          },
          render(scope) {
              return "-";
          }
      }
  }    
}
```



## remove
* 说明：删除相关配置
* 类型：Object


## remove.confirmFn
* 说明：自定义确认，返回promise，resolve为确认，reject为取消
* 类型：`(context)=>Promise<void>`
* 默认值：无
```js
{
  table:{
    remove:{
        confirmFn(context){
          return new Promise((resolve, reject)=>{
              Modal.confirm({
                  content:"确定删除此数据吗",
                  ok(){
                      resolve()
                  },
                  cancel(){
                      reject()
                  }
              })
          })   
        } 
    }
  }    
}
```



## remove.confirmTitle
* 说明：删除确认框的标题，当confirmFn未配置时生效
* 类型：string

## remove.confirmMessage
* 说明：删除确认框内容，当confirmFn未配置时生效
* 类型：string

## remove.showSuccessNotification
* 说明：是否显示成功删除提示
* 类型：boolean
* 默认值： true

## remove.refreshTable
* 说明：删除后是否刷新表格
* 类型：boolean
* 默认值： true


## remove.onCanceled
* 说明：取消后的操作
* 类型：`(context)=>Promise<any>`

## remove.onRemoved
* 说明：删除后的操作
* 类型：`(context)=>Promise<any>`
