
# 组件配置

## 组件配置
表单组件、行组件都是通过`fs-component-render`进行动态生成的。   
每个字段的配置中有几处地方可以配置component：
 1. column.form.component = 表单组件配置
 2. column.column.component = 表格行展示组件配置
 3. column.search.component = 查询表单组件配置
 4. column.viewForm.component = 查看表单组件独立配置
 5. column.addForm.component = 添加表单组件独立配置
 6. column.editForm.component = 编辑表单组件配置
::: warning
使用相关组件前，需要通过`app.use` 或 `app.component`引入组件
:::
## 组件配置项
```js
component:{ //组件配置
  name: 'fs-dict-select', //表单组件名称，支持任何v-model组件
  disabled: false, //组件是否禁用
  readonly: false, //组件是否是只读
  show: true, //是否显示该组件
  on:{ //组件事件监听
    onClick(context){console.log(context)} //监听表单组件的select事件
  },
  children:{ //组件的插槽(jsx)
     default:(scope)=>{  //默认插槽
        return (<div>{scope.data}</div>)
     },
     slotName:(scope)=>{  //具名插槽
        return (<div>{scope.data}</div>)
     }
  },
  //表单组件的参数，具体参数请查看对应的组件文档
  separator:",",//fs-dict-select的组件参数，[不同组件参数不同]
  placeholder:'',
  filterable: true, //可过滤选择项
  multiple: true, //支持多选
  clearable: true, //可清除
  // 组件的其他html属性,会直接传递给组件
  style:{width:'100px'},
  class:{'mr-5':true}
}
```

## 我想要配置组件的某个功能该如何查找文档
下面以`日期选择器禁用今天之前的日期`这个需求为例
### 1. 查看type对应使用的什么组件
日期选择器我们配置的 `type=date`    
所以先去[字段类型列表](./types.html)，查找`type=date`里面用的是什么组件   
在[日期时间选择](./types.html#日期时间选择)这一条中我们找到了`type=date`的配置
```js
date: {
    form: { component: { name: 'el-date-picker' } },
    component: { name: 'date-format', props: { format: 'YYYY-MM-DD' } }
}
```
从这里知道`type=date`使用的`el-date-picker`组件

### 2.查找该组件的文档，确定参数
在[日期时间选择](./types.html#日期时间选择) 拉到下方   
可以看到相关组件的文档链接（如果没有文档链接，请告诉我，我会尽快加上的）
 
![](./images/type-date-picker.jpg)  

点击[el-date-picker](https://element.eleme.cn/#/zh-CN/component/date-picker)
跳转到elementUI的文档页面，找到禁用日期相关参数

![](./images/date-picker-1.jpg)

![](./images/date-picker.jpg)

### 3.给component添加参数
```js
export const crudOptions = (vm) => {
  return {
    columns: [
      {
        title: '日期',
        key: 'date',
        type:'date',
        form:{
          component:{
            props:{
              pickerOptions:{
                disabledDate: time => {
                  return time.getTime() < Date.now()
                }
              }
            }
          }
        }
      }
    ]
  }
}
```
