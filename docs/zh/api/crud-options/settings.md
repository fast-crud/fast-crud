# crudOptions.settings
一些fs的设置

## viewFormUseCellComponent
* 说明：查看表单字段组件是否使用行展示组件来展示
* 类型：Boolean
* 默认：`false`


## searchCopyFormProps
* 说明：search字段从form配置中继承哪些属性，其中`valueResolve`,`valueBuilder`会先从columns中继承
* 类型：`string[]`
* 默认：`["component", "valueChange","title", "key","label", "render"]`

## onUseCrud
* 说明：useCrud结束后触发，最后可以修改一下crudBinding
* 类型：`(bindings: CrudBinding) => void;`
* 默认： null

## plugins
* 说明：crudOptions插件，插件能够生成一些crudOptions配置，并与用户的crudOptions进行合并
* 类型：`Record<string,CrudOptionsPlugin<any>>`
* 文档： [开发自定义插件](../use.md#registerCrudOptionsPlugin)

## plugins.rowSelection
* 说明：行选择插件
* 示例：
```js
const crudOptions = {
    settings:{
        plugins:{
            //行选择插件，内置插件
            rowSelection:{
                //是否启用本插件
                enabled: true,
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

## plugins.mobile
* 说明：手机版适配插件
* 示例：
```js
const crudOptions = {
    settings:{
        plugins:{
            //行选择插件，内置插件
            mobile:{
                //是否启用本插件
                enabled: true,
                props: {
                    isMobile: computed(()=>{
                        //浏览器窗口小于768px时，认为是手机端
                        //你也可以实现自己的判断手机版逻辑
                        return  window.innerWidth<768
                    }),
                    rowHandle:{
                        width: 60, //自定义手机版操作列的宽度
                        //同时操作列的所有按钮都作为dropdown
                    }
                },
            }
        }
    }
}
```


