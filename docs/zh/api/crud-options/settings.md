# crudOptions.settings
一些fs的设置

## viewFormUseCellComponent
* 说明：查看表单字段组件是否使用行展示组件来展示
* 类型：Boolean
* 默认：`false`


## searchCopyFormProps
* 说明：search字段从form配置中继承哪些属性
* 类型：`string[]`
* 默认：`["component", "valueChange","title", "key","label", "render","valueResolve"]`

## onUseCrud
* 说明：useCrud结束后触发，最后可以修改一下crudBinding
* 类型：`(bindings: CrudBinding) => void;`
* 默认： null

## plugins
* 说明：crudOptions插件，插件能够生成一些crudOptions配置，并与用户的crudOptions进行合并
* 类型：`Record<string,CrudOptionsPlugin<any>>`
* 默认： null
* 示例：

```js
const crudOptions = {
    settings:{
        plugins:{
            //行选择插件，内置插件
            rowSelection:{
                //是否启用本插件
                enabled: true,
                order: -2,
                //合并在用户配置crudOptions之前还是之后
                before: true,
                props: {
                    multiple: true,
                    crossPage: true,
                    selectedRowKeys,
                    onSelectedChanged(selected) {
                        console.log("已选择变化：", selected);
                    }
                },
                //如果是内置插件，通过key自动获取handle，否则需要自定义配置
                // handle: (props:any,useCrudProps:UseCrudProps)=>CrudOptions,
                // 你还可以使用 registerCrudOptionsPlugin 方法注册自定义插件，就不需要每次都写配置了
            }
        }
    }
}
```
::: tips
### registerCrudOptionsPlugin方法
* 说明：注册自定义插件，注意：这是一个全局方法，不是配置，你应该写在app.use(FastCrud)后面
* 类型：(name:string,plugin:(props:any,ctx:UseCrudProps)=>CrudOptions)
* 示例
```js
import {registerCrudOptionsPlugin} from '@fast-crud/fast-crud'
registerCrudOptionsPlugin("rowSelection",(selection:RowSelectionProps,ctx:UseCrudProps)=>{
    //这里返回crudOptions结构的配置，已实现插件的功能，这里是实现行选择功能
    return {
        table:{
            rowSelection:{
                
            }
        }
    }    
})
```
::: 
