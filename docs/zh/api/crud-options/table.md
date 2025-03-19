# crudOptions.table
表格配置     
更多参数见：[FsTable](/api/components/crud/crud/fs-table.md)
支持 el-table | a-table | n-table的配置

## show
* 说明：显示或隐藏table
* 类型：Boolean
* 默认：`true`

## 对应ui库的table组件的参数
* 说明：支持fs-table/el-table/a-table/n-table的参数
* 配置： 具体配置请根据你使用的ui库，前往对应ui库的文档查找相应组件的配置

```json
{
  // crudOptions
  table: {
    border: true,
    bordered: true,
    height: "100%",
    rowKey: "id",
    size: "small",
    stripe: true,
    onXxxx:()=>{}, //表格事件监听
    //...更多配置，请阅读对应组件的文档
  }
}
```

## columns
* 说明：列配置
* 类型：<del>Array</del>  `TableColumnsProps`(v1.14改成map)

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

## disableLoading
* 说明：是否禁用加载状态
* 类型：Boolean

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


## remove.confirmProps
* 说明：删除确认框原生属性，在打开confirm对话框时解析传入
* 类型：any
```js
messageBox.confirm('确定删除此数据吗', '提示', {
    ...crudBinding.value.table.remove.confirmProps
})
```


## remove.refreshTable
* 说明：删除后是否刷新表格
* 类型：boolean
* 默认值： true


## remove.onCanceled
* 说明：取消后的操作
* 类型：`(context)=>Promise<any>`

## remove.afterRemove
* 说明：删除请求提交后的操作，返回false，不执行后面的逻辑
* 类型：`(context:{index,row,res})=>Promise<any>`

```ts
{
  table:{
    remove:{
         afterRemove:async (context)=>{
            //context参数中带请求返回值（res），你可以在此处处理一些业务逻辑，比如校验是否失败;如果此方法返回false，不执行后面的逻辑，比如弹出删除成功消息
            if(context.res.code !== 200){
                return false
            }
        }
    }
  }    
}
```

## remove.showSuccessNotification
* 说明：是否显示成功删除提示
* 类型：boolean
* 默认值： true
* 
## remove.onRemoved
* 说明：删除后的操作（可以自定义提示，记得关掉showSuccessNotification）
* 类型：`({...context,res=删除请求返回值})=>Promise<any>`


## editable
* 说明：行编辑配置
* 类型：`object`
```js
const crudOptions = {
    table:{
        editable:{
            //是否启用编辑
            enabled:true,
            //模式，free 自由编辑，row：行编辑,cell：单元格编辑
            mode:"free",  //"free" | "row" | "cell";
            /**
             * 是否排他式激活，激活一个，关闭其他
             */
            exclusive: true,
            /**
             * 排他式激活关闭其他编辑时的效果，是取消还是保存
             */
            exclusiveEffect: "save", // "cancel" | "save";

            //单元格进入编辑模式的激活触发方式,onClick,onDbClick,false, 仅free模式生效
            activeTrigger:"onClick", // "onClick" | "onDbClick" | false;
            //是否默认激活
            activeDefault:false, 
            //通过一个方法判断哪些 cell可以激活编辑
            isEditable: (opts)=>{
                //(opts: { editableId: any; key: string; row: any }) => boolean;
                if(opts.key === 'username'){
                    //username不可编辑
                    return false
                }
                return true
            },  
            updateCell: async (opts)=>{
                // (opts: {  row: any; key: string; value: any }) => Promise<any>;
                //cell模式下，点击确认√，将编辑数据提交给后台的请求
                const {row,key,value} = opts
                const res = await request({
                    url:"/xxx/cellUpdate",
                    method:"post",
                    data:{
                        id:row.id,
                        key,
                        value
                    }
                })
                // 如果你需要同步修改其他字段值， row.xxx = xxx 可以直接修改
                // 如果row.id(table.rowKey)为负数，则是添加，后台需要返回新的id值，用于更新到表格内
                // res 应该至少包含id(rowKey) 例如： {id:99,...}
                return res
            },
            /**
             * 本地自定义插入方法
             * 如果你不喜欢新增的记录在第一条的话，你可以自己实现插入方法
             */
            addRow: (data: any[], row: any)=>{
                // (data: any[], row: any) => void
                //在最后一行插入数据
                data.push(roow)
            }
        }
    },
    
    columns:{
        key:{
            column:{
                //此处可以给某列单独进行一些配置，比table.editable优先级高
                editable:{
                    //该列是否禁用编辑, boolean | TableColumnEditableDisabledFunc;
                    //比table.editable.isEditable优先级更高
                    disabled: false,
                    // 单元格提交的请求，示例同上
                    updateCell: undefine
                }
            }
        }
    }
}



```

### crudExpose.editable 
crudExpose.editable暴露了很多editable相关的方法，你可以直接调用

<<<@/../../packages/fast-crud/src/d/expose-editable.ts

::: warning

行编辑模式下，你的AddRequest必须返回 `{[rowKey]:xxx,...}`格式（示例中为 `{id:xxx}`）, 否则保存之后用户再次编辑又会新增一条

```js
const addRequest = async ({ form }: AddReq) => {
const res = await api.AddObj(form);
//res 必须为 `{[rowKey]:xxx,...}`格式
return res;
};
```
:::
