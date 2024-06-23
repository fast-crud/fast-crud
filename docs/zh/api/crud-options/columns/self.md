# crudOptions.columns
* 说明：字段复合配置
* 类型：`Object:{[字段key]:Object}`
* 示例：
```js
const crudOptions = {
    columns:{
        key:{ //字段key
            title: '字段名',
            type: 'text'
        },
        'user.name':{ //数据支持多级结构 row={key:xx,user:{name:xxx}}
            title: '用户名称',
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

更多帮助，请参考[字段类型](/guide/advance/column-type.md)

:::tip

* `type`功能通过 `字段merge插件` 来实现的    
* `字段merge插件` 可以用来简化字段配置，提高复用性，减少重复代码。    
* [去学习字段merge插件](/guide/advance/column-type.html#字段merge插件)
:::

## [key].dict
* 说明：字段字典分发，运行时字典实例将分别传递给column/form/search的组件的dict参数中
* 类型：Dict对象

:::tip

* `dict分发`功能也是通过 `字段merge插件` 来实现的    
* `字段merge插件` 可以用来简化字段配置，提高复用性，减少重复代码。   
* [去学习字段merge插件](/guide/advance/column-type.html#字段merge插件)

::: 

## [key].valueBuilder与valueResolve
* 说明： 后台值与前端值不一致时解决方案
* 场景1： 比如图片展示组件和图片上传组件的value为数组类型，但是提交到后台需要的是逗号分割的字符串
* 场景2： 又或者省市区级联选择：后台返回的数据是province、city、county三个字段，而前端则需要将这三个字段组成一个数组，传给级联组件。
```js
columns:{
    key:{
        valueBuilder(context:ValueBuilderContext){
            //value构建，就是把后台传过来的值转化为前端组件所需要的值
            //在pageRequest之后执行转化，然后将转化后的数据放到table里面显示
            context.row.imageUrl = context.row.imageUrl?.split(',')
            //  ↑↑↑↑↑ 注意这里是row，不是form
        }, 
        valueResolve(context:ValueBuilderContext){
            //value解析，就是把组件的值转化为后台所需要的值
            //在form表单点击保存按钮后，提交到后台之前执行转化
            context.form.imageUrl = context.form.imageUrl?.join(',')
            //  ↑↑↑↑↑ 注意这里是form，不是row
        }, 
        form:{
            //有时候，行展示组件的值与form表单所需要的值也是不一样的
            valueBuilder(context){
                //如果配置在form下，则表示将行数据的值转化为表单组件所需要的值 
                //在点击编辑按钮之后，弹出表单对话框之前执行转化。
                
                //以下示例为，后台返回的数据的roles带了roleName和id
                // 但在表单编辑时，组件所需要的value值为roles =[1]，所以需要将value转化为id数组
                // context.form.roles = [{roleId:1,roleName:'管理员'}]
                context.form.roles = context.form.roles.map(item=>item.roleId)
                //  ↑↑↑↑↑ 注意这里是form，不是row
            }, 
            valueResolve(context){
                //与builder相反，提交表单时，需要将value值转换为后台所需要的格式提交给后台
            },
        }
    }
}
```



## [key].column
* 说明：该字段表格的列上的配置,[更多配置请前往文档 columns.key.column](./column.md)
* 类型：Object
* 示例：
```json
{//crudOptions
    columns: {
        key: {
            column: {
                // 此处支持el-table-column / a-table-column的配置
                component: {
                  //此处为单元格组件的配置
                }
            }    
        }
    }
}
```



## [key].form
* 说明：该字段在表单里面的配置,[更多配置请前往文档 columns.key.form](./form.md)
* 类型：Object
* 示例：
```json
{ // crudOptions.columns
  key: { //字段key
    form: {
      title: '字段在表单里的label',
      component: {}, //组件配置
      rules: [], //校验规则
      col: {span: 12} //分栏配置
      //此处支持更多 el-form-item / a-form-item的配置
    } 
  }
}
```



## [key].addForm
* 说明：该字段在添加表单里面的配置
* 类型：`FormProps`
* 配置同`[key].form`

>初始化时会与`[key].form`合并，然后放入`crudOptions.addForm.columns[key]`


## [key].viewForm
* 说明：该字段在查看表单里面的配置
* 类型：`FormProps`
* 配置同`[key].form`

>初始化时会与`[key].form`合并，然后放入`crudOptions.viewForm.columns[key]`


## [key].editForm
* 说明：该字段在编辑表单里面的配置
* 类型：`FormProps`
* 配置同`[key].form`
>初始化时会与`[key].form`合并，然后放入`crudOptions.editForm.columns[key]`


## [key].search
* 说明：该字段在查询框表单里面的配置， [更多配置请前往文档 columns.key.search](./search.md)
* 类型：`SearchProps`
* 配置同`[key].form`
>初始化时会与`[key].form`合并，然后放入`crudOptions.search.columns[key]`
