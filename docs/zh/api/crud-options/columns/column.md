# crudOptions.columns[key].column
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
参考组件配置[component](../../common-options.md)

## [key].column.columnSetDisabled
* 说明：在列设置中禁用该字段的勾选
* 类型：Boolean

## [key].column.columnSetShow
* 说明：在列设置中显示该字段的勾选
* 类型：Boolean

## [key].column.showTitle
* 说明：是否显示title,鼠标放上去显示文本
* 类型：boolean | string


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
