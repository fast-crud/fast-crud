# columns【字段配置】
* 说明：字段配置
* 类型：Object:{[字段key]:Object}
* 示例：
```js
const crudOptions = {
    columns:{
        key:{ //字段key
            title: '字段名',
            type: 'text'
        }
    }
}
```

## [key].title

* 说明：字段名称
* 类型：String

可以通过如下配置在不同的位置覆盖这里配置的字段名称
```js
const crudOptions = {
    columns:{
        testKey:{
            title: "字段名",
            form:{ //会覆盖 testKey.title
                title:"显示在表单上的字段名"
            },
            addForm:{ //会覆盖form.title
                title:"显示在添加表单上的字段名"
            },
            viewForm:{//会覆盖form.title
                title:"显示在查看表单上的字段名"
            },
            editForm:{//会覆盖form.title
                title:"显示在编辑表单上的字段名"
            },
            search:{//会覆盖form.title
                title:"显示在查询框上的字段名"
            },
            column:{//会覆盖testKey.title
                title:"显示在列上的字段名"
            }
        }
    }
}
```

## [key].type

* 说明：字段类型，初始化时，将会使用type代表的字段配置与用户的配置合并。
* 类型：String

更多帮助，请参考[字段类型](../guide/advance/column-type.md)



## [key].column
* 说明：该字段的列配置
* 类型：Object
* 示例：
```json5
{
    columns: {
        key: {
            column: {
                // 支持el-table-column / a-table-column的配置
                component: {}
            }    
        }
    }
}
```

### [key].column.component
* 说明：单元格组件配置
* 类型：Object
参考组件配置[component](../common-options.md)


## [key].form
* 说明：该字段在表单里面的配置
* 类型：Object
* 支持：el-form-item，a-for-item
* 示例：
```json5
{ // crudOptions.columns
  key: { //字段key
    form: {
      title: '字段在表单里的label',
      component: {}, //组件配置
      rules: [], //校验规则
      col: {span: 12} //分栏配置
      //此处支持 el-form-item / a-form-item的配置
    } 
  }
}
```

### [key].form.component
* 说明：表单输入组件配置
* 类型：Object
参考组件配置[component](../common-options.md)


### [key].form.col
* 说明：表单字段col配置
* 类型：Object
* 默认：{span:12}
* 同[form.col](form#col)


## [key].addForm
* 说明：该字段在添加表单里面的配置
* 类型：Object
* 配置同`[key].form`  

>初始化时会与`[key].form`合并，然后放入`crudOptions.addForm.columns[key]`


## [key].viewForm
* 说明：该字段在查看表单里面的配置
* 类型：Object
* 配置同`[key].form`   

>初始化时会与`[key].form`合并，然后放入`crudOptions.viewForm.columns[key]`


## [key].editForm
* 说明：该字段在编辑表单里面的配置
* 类型：Object
* 配置同`[key].form`
>初始化时会与`[key].form`合并，然后放入`crudOptions.editForm.columns[key]`

## [key].search
* 说明：该字段在查询框表单里面的配置
* 类型：Object
* 配置同`[key].form`
>初始化时会与`[key].form`合并，然后放入`crudOptions.search.columns[key]`

### [key].search.component
* 说明：查询框字段组件配置
* 类型：Object
参考组件配置[component](../common-options.md)
