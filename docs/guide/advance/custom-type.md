
# 字段类型自定义
通过自定义字段类型，可以帮助你省略column的通用配置

## 添加自定义字段类型
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

## 修改官方字段类型配置
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
selectType.component.color='auto'  //修改官方的字段类型，设置为支持自动染色
```

[官方字段类型列表](./types.md)
