# use

## 初始化crud

### useFs
* 说明: 初始化crud
* 类型： `(props:UseFsProps<R,C>):UseFsRet<R>`
* 参数说明：
    * props.crudExposeRef :  crudExpose创建好之后，会填充进此ref，可以让你在useFs之前创建使用crudExpose的方法(要在useFs之后才能调用)
    * props.context: 上下文容器，可以放入任何东西
    * ret.context: props传入的上下文容器，如果没传则会自动创建一个
    * R: 行数据模型，默认为any
    * C: 上下文模型，默认为any
* 示例：

```ts
//index.vue

type ContextModel = {
    props:any;
    ctx:any;
}
type RowModel = {
    id?:number;
    name?:string;
    //...
}; //行数据模型
export default {
    setup(props:any,ctx:any){
        const context: ContextModel = {
            props,ctx
        }; //自定义变量，传给createCrudOptions的额外参数（可以任意命名，传任意参数）
        const crudExposeRef:Ref<CrudExpose> = ref() //crudExpose创建好之后，会填充进此ref，可以在useFs之前创建使用crudExpose的方法
        const customAdd = ()=>{
            crudExposeRef.value.openAdd({row:{}})
        }
       
        const { crudBinding, crudRef, crudExpose, resetCrudOptions } = useFs<RowModel,ContextModel>({ createCrudOptions, context, crudExposeRef});
        return {
            crudBinding,
            crudRef,
            customAdd
        }
    }
}
   
```

```js
// crud.ts
import { CreateCrudOptionsProps, CreateCrudOptionsRet, dict } from "@fast-crud/fast-crud";
import { addRequest, delRequest, editRequest, pageRequest } from "./api";

//------------------------------------↓↓↓↓↓↓↓↓↓↓ 获取传入的额外参数
export default function ({ crudExpose, context }: CreateCrudOptionsProps): CreateCrudOptionsRet {
   const {props,ctx} = context
    return {
    crudOptions: {
      // 自定义crudOptions配置
    }
  }
}
```



### useFsAsync
* 说明: 异步初始化crud , 可以从后台获取配置后再初始化crud, 需要事先定义crudRef,crudBinding
* 类型： `(props:UseFsProps):Promise<UseFsRet>`
* demo： [antdv](http://fast-crud.docmirror.cn/antdv/#/crud/advanced/from-backend)  /  [element](http://fast-crud.docmirror.cn/element/#/crud/advanced/from-backend)  /  [naive](http://fast-crud.docmirror.cn/naive/#/crud/advanced/from-backend)
* 示例：

```js
//index.vue
export default {
    setup(){
        const crudBinding:Ref<CrudBinding> = ref()
        const crudRef:Ref = ref()
        const context: any = {}; //变量上下文，传给createCrudOptions的额外参数（可以任意命名，任意多个）
        const onExpose = (e:OnExposeContext)=>{}
        onMounted(async ()=>{
            // 要求createCrudOptions也要是一个异步方法
            const {  crudExpose, context } = await useFs({crudBinding,crudRef, createCrudOptions, context });
        })
        return {
            crudBinding,
            crudRef
        }
    }
}
```

### props.createCrudOptions
* 说明: 创建CrudOptions的方法，需要用户实现，并传入useFs 或 useFsAsync
* 类型： `(props:CreateCrudOptionsProps):CreateCrudOptionsRet |  (props:CreateCrudOptionsProps):Promise<CreateCrudOptionsRet>`

### ret.resetCrudOptions
* 说明: useFs返回值之一，可以重新设置crudOptions，重设后表格数据会被清空
* 类型： `(opts:CrudOptions)=>void`
* 示例：

```js
//index.vue
export default {
    setup(){
        const { crudBinding, crudRef, crudExpose, crudOptions, resetCrudOptions } = useFs({ createCrudOptions });

        // 此处演示如何合并crudOptions，
        // 合并后在原有配置基础上追加多一个字段
        // 然后进行重置（重置后，data数据会被清空，需要重新refresh）
        onMounted(()=>{
            resetCrudOptions(_.merge({},crudOptions,{
                columns:{
                    addField:{
                        title:"追加字段",
                        type:'text'
                    }
                }
            }))
            crudExpose.doRefresh()
        })
        
        return {
            crudBinding,
            crudRef
        }
    }
}
```



## form对话框

### useFormWrapper
* 说明: 获得打开自定义对话框能力，可以同时打开多个（默认的view/add/edit只能打开一个）
* 类型： `()=>{opts:OpenDialogProps}`
* 示例：
```js

import {useFormWrapper,useColumns,CrudOptions} from "@fast-crud/fast-crud";
import createCrudOptions from 'crud'

async function openCustomDialog(){
  const {openDialog} = useFormWrapper()
  const {buildFormOptions} = useColumns();
  const {crudOptions} = createCrudOptions({...} as CrudOptions);
  const opts = buildFormOptions(crudOptions); //将 crudOptions 转化为form表单所需要的options
  const wrapperRef = await openDialog(opts) //打开对话框
  //获取formData
  const formData = wrapperRef.getFormData();
  wrapperRef.setFormData({xxx:'value'});
  //对话框实例
  return wrapperRef
}
```
::: warning
使用此方式打开的对话框无法通过crudExpose.getFormWrapperRef、crudExpose.getFormData获取到实例Ref和data。你只能通过返回值获取
:::



## 插件

### registerCrudOptionsPlugin
* 说明：注册自定义插件，注意：这是一个全局方法，不是配置，你应该写在app.use(FastCrud)后面
* 类型：(name:string,plugin:(props:any,ctx:UseCrudProps)=>CrudOptions)
* 内置插件：[rowSelection](./crud-options/settings.md#plugins-rowSelection),[mobile](./crud-options/settings.md#plugins-mobile)
* 示例
```js
import {registerCrudOptionsPlugin} from '@fast-crud/fast-crud'
registerCrudOptionsPlugin("rowSelection",(pluginProps:RowSelectionProps,ctx:UseCrudProps)=>{
    //这里返回crudOptions结构的配置，用以实现插件的功能
    return {
        table:{
            
        },
        ... //覆盖crudOptions配置
    }    
})
```

