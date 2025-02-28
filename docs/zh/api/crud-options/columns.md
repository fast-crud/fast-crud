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



## [key].column
* 说明：该字段的列配置
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


## [key].column.[x-table-column配置]
* 说明：column下支持对应ui的table-column组件配置， el-table-column / a-table-column /n-table-column 的全部配置
* 文档： [el-table-column](https://element-plus.gitee.io/#/zh-CN/component/table#table-column-attributes) | [a-table-column](https://2x.antdv.com/components/table-cn#API)
* 示例：
```js
{ //crudOptions
    columns:{
       key:{
            column:{
                width: 200, //列宽
                minWidth: 100 //最小列宽
                align：'center', //对齐方式
                fixed: 'left' //固定列
            }
       }
    }   
}

```


## [key].column.valueChange
* 说明: 值变化触发
* 类型：`(context)=>void`
* 示例：
```js
crudOptions = { //
    columns:{
        key:{
            column:{
                valueChange(context:ValueChangeContext){
                    console.log('value:',context.value, " row:",context.row)
                }
            }
    }
}
```


## [key].column.component
* 说明：单元格组件配置
* 类型：Object
参考组件配置[component](../common-options.md)

## [key].column.columnSetDisabled
* 说明：在列设置中禁用该字段的勾选
* 类型：Boolean

## [key].column.columnSetShow
* 说明：在列设置中显示该字段的勾选
* 类型：Boolean


## [key].column.show
* 说明：是否显示该列,列设置中也是通过修改此字段来进行列的显示。
* 类型：boolean
* 默认值： true 


## [key].column.formatter
* 说明：格式化显示，此参数与antdv、element的原始属性名重叠，非特殊列以此为准。
* 类型：`Function(context:ScopeContext):String`
* 示例：
```js
const crudOptions = {
    columns:{
        key:{
            column:{
                formatter({value,row,index}){
                    return value + '元'
                }
            }
        }
    }
}
``` 

## [key].column.order
* 说明：列排序号，数字越小越靠前排列。
* 类型：number
* 默认值： 1 ， 当配置0或负数则排到最前面，配置2则排到最后面
* 场景：比如可以在commonOptions里面配置一个显示在最后面的公共时间列

## [key].column.showTitle
* 说明：是否显示title,鼠标放上去显示文本
* 类型：boolean | string
* 默认值： false
* 场景：配置true，则value当做文本显示；配置string，则直接显示配置的文本

## [key].column.columnSlots
* 说明：自定义table-column列的插槽【仅element-plus有用】
* 类型：`{key:RenderFunc}`
* 场景：可以自定义列头


## [key].column.cellRender
* 说明：自定义单元格渲染。
* 类型：`Function(scope:ScopeContext)`
* 相关：[jsx/tsx文档](https://cn.vuejs.org/guide/extras/render-function.html#jsx-tsx)
```js
const crudOptions = { 
    columns:{
       key:{
            column:{
                cellRender(scope:ScopeContext){
                    return <div>{scope.value}</div>
                }
            }
       }
    }   
}

```


## [key].column.conditionalRender
* 说明：单元格条件render，符合条件的情况下优先render
* 类型： `{match:(scope:ScopeContext)=>boolean,render:(scope:ScopeContext)=>any}`
* 默认值：无
* 示例：
```js
{
  columns:{
      key:{
          column:{
              conditionalRender:{
                  match(scope) {
                      return scope.form.isPreview;
                  },
                  render(scope) {
                      return <div style={{lineHeight:'32px'}}>{{scope.value}}</div>
                  }
              }
          }
      }
  }    
}
```


## [key].column.editable.disabled
* 说明：定义列是否支持行编辑。
* 类型：`boolean / Function(scope:ScopeContext)`
```js
{ //crudOptions
    columns:{
       key:{
            column:{
                editable:{
                    disabled: true, //直接配置boolean ，也可以配置方法根据条件判断
                    disabled: ({column,index,data})=>{
                        return index % 2 ===0
                    }
                }
            }
       }
    }   
}

```


## [key].form
* 说明：该字段在表单里面的配置
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
## [key].form[对应ui组件的配置]
* 说明：对应的ui组件的配置
* 类型：Object
* 支持：el-form-item，a-for-item
* 示例：
```json
{ // crudOptions.columns
  key: { //字段key
    form: {
      label: '字段在表单里的label',
      //此处支持更多 el-form-item / a-form-item的配置
    } 
  }
}
```

## [key].form.label 
* 说明：表单字段label ,也可以配置为 `[key].form.title`
* 类型：`string | render(context:ScopeContext)`
* 默认：默认继承 `columns.[key].title`

```js
// 下面是render方式自定义字段label
{ // crudOptions.columns.[key]
    form:{
        title(context){
            return <div style={{'color':red}}> 字段名称 <div>
        }
    }
}
```


### [key].form.component
* 说明：表单输入组件配置
* 类型：Object
参考组件配置[component](../common-options.md)


## [key].form.col
* 说明：表单字段col配置
* 类型：Object
* 默认：{span:12} ，继承 [crudOptions.form.col](form#col)

## [key].form.value
* 说明：该字段的默认值
* 类型：any
```
columns:{
    fieldKey:{
        form:{
            value:2 //当此字段value为空时，将被设置为默认值2
        }
    }
}

```
::: warning   
注意：此处配置了默认值，会被search复制过去，一般来说，search是不需要默认值的，此时需要配置search.value=null进行取消。
:::

## [key].form.helper
* 说明：字段的帮助说明，显示在组件的下方
* 类型：string | { render:(scope:ScopeContext)=>{} }
```jsx
columns:{
    fieldKey:{
        form:{
            helper: "我这里是字段的帮助说明"
            // 也支持jsx形式的复杂显示
            helper:{
                render(scope){
                    return <div class="red">我这里是通过jsx显示的帮助说明</div>
                }
            }
        }
    }
}

```

## [key].form.order
* 说明：表单字段排序号，数字越小越靠前排列。
* 类型：number
* 默认值： 1 ， 当配置0或负数则排到最前面，配置2则排到最后面


## [key].form.show
* 说明：表单里是否显示该字段。
* 类型：boolean
* 默认值： true

## [key].form.submit
* 说明：该字段是否提交到后台，为false时不提交。
* 类型：boolean
* 默认值： true


## [key].form.blank
* 说明：是否该字段占一个空白位置。
* 类型：boolean
* 默认值： false

## [key].form.render
* 说明：表单组件自定义render
* 类型： `(scope:ScopeContext)=>slots`
* 默认值：无
* 示例：

```jsx
const crudOptions = {
    columns:{
        key:{
            form:{
                render(scope) {
                    return (<div style={{lineHeight:'32px'}}>{{scope.value}}</div>)
                }
            }
        }
    }
}
```

## [key].form.conditionalRender
* 说明：表单组件条件render，符合条件的情况下优先render
* 类型： `{match:(scope:ScopeContext)=>boolean,render:(scope:ScopeContext)=>slots}`
* 默认值：无
* 示例：
```jsx
{
  columns:{
      key:{
          form:{
              conditionalRender:{
                  match(scope) {
                      return scope.form.isPreview;
                  },
                  render(scope) {
                      return (<div style={{lineHeight:'32px'}}>{{scope.value}}</div>)
                  }
              }
          }
      }
  }    
}
```


## [key].form.prefixRender
* 说明: 可以在字段组件前面自定义渲染
* 类型：`(scope:ScopeContext)=>jsx`
* 默认：无
* 相关：[jsx/tsx文档](https://cn.vuejs.org/guide/extras/render-function.html#jsx-tsx)
```js
{ // crudOptions.cloumns.[key].form
    prefixRender(scope){
        return <div>组件的前面</div>
    }
}
```

## [key].form.suffixRender
* 说明: 可以在字段组件后面自定义渲染
* 类型：`(scope:ScopeContext)=>jsx`
* 默认：无
* 相关：[jsx/tsx文档](https://cn.vuejs.org/guide/extras/render-function.html#jsx-tsx)
```js
{ // crudOptions.cloumns.[key].form
    suffixRender(scope){
        return <div>组件的后面</div>
    }
}
```

## [key].form.topRender
* 说明: 可以在字段组件上面自定义渲染
* 类型：`(scope:ScopeContext)=>jsx`
* 默认：无
* 相关：[jsx/tsx文档](https://cn.vuejs.org/guide/extras/render-function.html#jsx-tsx)
```js
{ // crudOptions.cloumns.[key].form
    topRender(scope){
        return <div>组件的上面</div>
    }
}
```

## [key].form.bottomRender
* 说明: 可以在字段组件下面自定义渲染
* 类型：`(scope:ScopeContext)=>jsx`
* 默认：无
* 相关：[jsx/tsx文档](https://cn.vuejs.org/guide/extras/render-function.html#jsx-tsx)
```js
{ // crudOptions.cloumns.[key].form
    bottomRender(scope){
        return <div>组件的下面</div>
    }
}
```

## [key].form.valueChange
* 说明: 值变化触发
* 类型：`(context:ValueChangeContext)=>void` | `{immediate:boolean,handle:(context:ValueChangeContext)=>void}`
* 示例：
```js
crudOptions = { //
  columns:{
      key:{
          form: {
              valueChange(context){
                  console.log(context)
              },
              // 或者
              valueChange:{
                  immediate:true, //是否立即执行一次
                  handle(context){
                      //值变化后的处理
                  }
              }
          }
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
* 说明：该字段在查询框表单里面的配置
* 类型：`SearchProps`
* 配置同`[key].form`
>初始化时会与`[key].form`合并，然后放入`crudOptions.search.columns[key]`

## [key].search[对应ui组件的配置]
* 说明：formItem配置，支持el-form-item,a-form-item,n-form-item的配置
* 配置： 具体配置请根据你使用的ui库，前往对应ui库的文档查找相应组件的配置
* 类型：any
* 示例：
```js
const crudOptions = {
    columns:{
        key:{
            search:{
                labelWidth:200 //配置查询框的label宽度(此字段仅限element-plus,其他ui请查阅对应ui的文档)
                //... 更多配置，请阅读对应组件的文档
            }
        }
    }
}
```

## [key].search.component
* 说明：查询框字段组件配置
* 类型：`ComponentProps`
参考组件配置[component](../common-options.md)


## [key].search.valueResolve
* 说明：查询字段值转化，doRefresh查询数据时会被执行
* 类型：`(context:ValueResolveContext)=>void`
```js
const crudOptions ={
  columns:{
      test:{
          search:{
              valueResolve({key,value,form}){  //  <------注意这里是form，不是row
                  if(value!= null){
                      //当后台需要的是int类型，输入的是string，就需要转化一下
                      form[key] = parseInt(value)
                  }
              }
          }
      }
  }   
}
```

## [key].search.order
* 说明：查询排序号，数字越小越靠前排列。
* 类型：number
* 默认值： 1 ， 当配置0或负数则排到最前面，配置2则排到最后面


## [key].search.col
* 说明：查询字段的单独col配置，设置查询字段宽度，支持el-col,a-col,n-col的配置
* 类型：Object
* 示例：
```js
const crudOptions = {
    columns:{
        key:{
            search:{
                col:{span:4} //占据一行的4格
                //像时间范围查询这种，可以配置为{span:8}，占据一行的8格，就可以实现规整的查询框布局
            }
        }
    }
}
```

## [key].search.autoSearchTrigger
* 说明：是否在该字段变化时触发自动查询，需要总的autoSearch开启状态才会生效
* 类型： boolean | 'input' 输入触发 | 'change' 变化时触发 | 'enter'  回车键触发
* 示例：
```js
const crudOptions = {
    columns:{
        key:{
            search:{
                autoSearchTrigger: true  // change | enter | input
            }
        }
    }
}
```


## [key].search.valueChange
* 说明: 值变化触发
* 类型：`(context:ValueChangeScope)=>void`
* 示例：
```js
crudOptions = { //
  columns:{
      key:{
          search:{
              valueChange(context){
                  console.log(context)
              },
          }
      }
  }
}
```


## valueBuilder与valueResolve
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
