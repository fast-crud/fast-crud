# crudOptions.columns[key].form
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


## [key].form.component
* 说明：表单输入组件配置
* 类型：Object
参考组件配置[component](../../common-options.md)


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
