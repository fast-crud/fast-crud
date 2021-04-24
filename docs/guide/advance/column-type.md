
# 字段类型

## 字段类型简介
字段类型背后代表了一段默认配置，当你配置了type时，你可以省略它代表的这部分默认配置    

例如：当没有字段类型时，你需要写如下这一大段字段配置
```js
columns:[
    {
      title:'状态',
      key:'status',
      dict:{url:'/dict/status'},
      search:{
        compnent:{  //查询 使用选择框组件，并且是可以清除的
          name:'fs-dict-select',
          clearable:true
        }
      },
      form:{  //添加和编辑表单 使用选择框组件
        compnent:{
          name:'fs-dict-select'
        }
      },
      component:{ //单元格 使用value格式化组件，展示为tag
        name:'fs-values-format'
      }
    }
]
    

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
你可以通过[字段类型列表](./types.md)查看字段类型包含了哪些具体配置
:::

## 配置生成过程

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
this.crud= {
  table:{
      columns:[]
  },
  form:{ //作为addForm、viewForm、editForm的基准配置
    columns:{}
  },
  addForm:{
    columns:{}
  },
  editForm:{
    columns:{}
  },
  viewForm:{
    columns:{}
  },
  search:{
    columns:{}
  }
}
```

fs-crud有哪些配置项，请参考[fs-crud组件文档](../../api/components/crud/fs-crud.md)
