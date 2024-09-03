# crudOptions.columns[key].editForm
* 说明：该字段在编辑表单里面的配置，会继承 `crudOptions.columns[key].form` 的配置，配置项同`form`
* 类型：Object
* 示例：
```js
const crudOptions = { // crudOptions.columns
    key: { //字段key
        editForm: {
            title: '字段在编辑表单里的label',
            component: {}, //组件配置
            rules: [], //校验规则
            col: {span: 12} //分栏配置
            //此处支持更多 el-form-item / a-form-item的配置
        }
    }
}
```
