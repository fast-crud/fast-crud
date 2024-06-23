
# 字段类型

## 字段类型简介
字段类型背后代表了一段默认配置，当你配置了type时，你可以省略它代表的这部分默认配置    

例如：当没有字段类型时，你需要写如下这一大段字段配置
```js
const crudOptions = {
    columns:{
        status:{
            title:'状态',
            dict:{url:'/dict/status'},
            search:{
                component:{  //查询 使用选择框组件，并且是可以清除的
                    name:'fs-dict-select',
                    clearable:true
                }
            },
            form:{  //添加和编辑表单 使用选择框组件
                component:{
                    name:'fs-dict-select'
                }
            },
            column:{
                component:{ //单元格 使用value格式化组件，展示为tag
                    name:'fs-values-format'
                }
            }
        }
    }   
}
    

```

通过字段类型，你可以使用字段类型简写上面的配置
```js
columns:{
    status:{
        title:'状态',
        dict:dict({url:'/dict/status'}),
        type:'dict-select'
    }
}
```


::: tip
你可以通过[字段类型列表](/api/types.md)查看字段类型包含了哪些具体配置
:::

::: tip

你还可以通过`fast-crud`初始化日志查看最终生成的配置具体是什么  
![](../..//images/crud-init-log.jpg)

:::


## 字段类型组合使用
字段类型支持配置多个（数组），运行时继承合并，可以使配置更简洁    

比如`antdv`的字段跨列配置需要配置三条，就相当繁琐    
```js
{ //key.column
    type:"textarea"
    form:{
        col:{span:24}, //配置在表单中此字段独占整行,
        // 由于antdv的label也是通过row,col来配置的
        // 跨列之后，此时label会没有对齐，需要通过如下配置让它能够对齐
        labelCol: { span: 2 }, 
        wrapperCol: { span: 21 }
    }   
}
```
以上配置可以如下写法进行简化，`colspan`背后就是上面的配置
```js
{ //key.column
    type:["textarea","colspan"]
}
```

## 字段类型配置合并过程

#### 1.‘dict-select’类型的默认配置
```js
{  
    select : {
        search: { component: {  clearable: true  } },
        form: { component: { name: 'fs-dict-select' ,vModel: 'modelValue'} }, //如果是使用antdv，那么vModel应为value
        column: { component: { name: 'fs-values-format'} }
    }
}
```
#### 2.用户的字段配置
本示例中用户自定义设置dict-select为多选

```javascript
export const crudOptions = {
  columns: [ 
    {
      name: '城市',
      key: 'city',
      type: 'dict-select' ,//字段类型
      form:{ component:{ multiple:true } }, //用户自定义配置
      dict: { 
        data:[  //dict-select字段类型需要配置数据字典
          {value:'sz',label:'深圳'},
          {value:'bj',label:'北京'} 
        ] 
      } 
    }
  ]
}
```
#### 3.运行时合并配置
运行时，将会根据type生成该类型定义的默认配置，与用户定义的配置进行合并
   
>其中dict配置会分发复制到form/search/column的component下，这不属于本章节所需要学习的范畴，你可以忽略dict

```javascript
export const crudOptions = {
  columns: {
    city:{
     name: '城市',
       type: 'dict-select',                      //字段类型
       search:{
         component: { 
           clearable:true,                       // <----来自于type
           dict: Dict
         } 
       },
       form: { // form里面的配置最终会被复制到addForm,viewForm,editForm,search里面
         component: { 
           name: 'fs-dict-select',               // <----来自于type
           clearable:true,                       // <----来自于type
           multiple:true,                        // <----来自于用户自定义配置
           dict: Dict
         } 
       },
       component: {                              // <----来自于type
         name: 'fs-values-format',               // <----来自于type
         dict: Dict,
       }
    }
  }
}
```


#### 4.转化成fs-crud的最终配置  

* 初始化时，通过`useCrud`将 从`crudOptions` 生成`crudBinding`。    
* 主要从每个字段配置里面挑出`search`、`addFrom`、`viewForm`、`editForm`、`column`部分。生成不同位置的columns配置。     
* 从`每个字段下包含不同分类`转换为`分类下包含多个字段`的格式，交给不同的组件渲染（`fs-search`，`fs-table`，`fs-form`）。    

```javascript
crudBinding.value= {
  table:{ //表格的参数
      columns:[] //表格这里的columns是数组
  },
  form:{ //作为addForm、viewForm、editForm的基准配置
    columns:{}
  },
  addForm:{ //添加form的参数，当你独立使用fs-form时，可以直接使用此参数打开一个表单对话框
    columns:{}
  },
  editForm:{ //编辑form的参数，当你独立使用fs-form时，可以直接使用此参数打开一个表单对话框
    columns:{}
  },
  viewForm:{ //查看form的参数，当你独立使用fs-form时，可以直接使用此参数打开一个表单对话框
    columns:{}
  },
  search:{ //查询框的参数
    columns:{}
  },
  ... //更多其他配置
}
```

fs-crud有哪些配置项，请参考[fs-crud组件文档](../../api/components/crud/fs-crud.md)


## 自定义字段类型
通过自定义字段类型，同时配合上面的组合功能，可以让你开发crud更爽更快

### 添加自定义字段类型
通常在你有相同类型的字段，都要写相同的配置的时候，为了避免`copy your self`，你可以建立自定义字段类型。
```javascript
import FastCrud,{ useTypes } from '@fast-crud/fast-crud'
Vue.use(FastCrud)

//添加自定义字段类型,使用type:'time2'，你就可以省略下面的配置
//不要写在页面里，这个是全局的，要写在vue.use(FastCrud)之后
const { addTypes } = useTypes()
addTypes({
  'time2':{ //如果与官方字段类型同名，将会覆盖官方的字段类型
     form: { component: { name: 'el-date-picker' } },
     column:{ component: { name: 'fs-date-format',  format: 'YYYY-MM-DD'  }
  }
})
```

### 修改官方字段类型配置
当你使用官方type每次都要配置一些相同的参数的时候，就需要用到这个功能了。   
获取到官方配置，然后修改它。

如下例子可以将所有的dict-select字段类型的单元格组件支持自动染色
```js
import FastCrud,{ useTypes } from '@fast-crud/fast-crud'
Vue.use(FastCrud)

//修改官方字段类型
//不要写在页面里，这个是全局的，要写在vue.use(FastCrud)之后
const { getType } = useTypes()
const selectType = getType('dict-select')
selectType.column.component.color='auto'  //修改官方的字段类型，设置为支持自动染色

// 也可以修改其他配置，增加配置等
// selectType.form.component.xxx = xxx
// selectType.search.component.xxx = xxx

const { getType } = useTypes()
const textType = getType('text')
textType.search.autoSearchTrigger='change'  //修改官方的字段类型，设置为文本变化就触发查询

```

## 字段类型列表
[官方字段类型列表](../../api/types.md)



## 字段merge插件

当你想自定义columns额外处理方法时可以使用 `registerMergeColumnPlugin` 来注册字段merge插件。   
可以帮助你实现类似`dict`、`type`等公共属性的功能    
可以让你自定义字段配置简化逻辑，提高复用性，减少重复代码。


```js
import { useColumns,MergeColumnPlugin,useMerge } from '@fast-crud/fast-crud'

// 跟上面一样，不要写在页面里，这个也是全局的，要写在vue.use(FastCrud)之后

const { registerMergeColumnPlugin } = useColumns();
const {merge} = useMerge()
registerMergeColumnPlugin({
    name: 'readonly-plugin',
    order: 1,
    handle: (columnProps: ColumnCompositionProps={},crudOptions:any={}) => {
        // 你可以在此处做你自己的处理
        // 比如你可以定义一个readonly的公共属性，处理该字段只读，不能编辑
        if (columnProps.readonly) {
            // 合并column配置
            // 意思是，当用户给这个字段配置了columns[key].readonly = true
            // 就相当于配置了 {form: {show: false},viewForm: {show: true}}
            merge(columnProps, {
                form: {show: false},
                viewForm: {show: true},
            });
        }
        return columnProps;
    }
})

```

使用这个`readonly`配置
```js
const crudOptions = {
    columns:{
        key:{
            title:"测试",
            type:'text',
            //在这里使用这个自定义配置
            // 效果就是，在添加和编辑时都看不到这个字段
            readonly:true  
        }
    }
}
```


## 更多
你可能还想了解 [扩展](./extends.md)
