# FsDictRadio

> 字典单选框
> 支持 el-radio-group|a-radio-group 的参数

## Props

| Prop name         | Description                                                                        | Type   | Values | Default   |
| ----------------- | ---------------------------------------------------------------------------------- | ------ | ------ | --------- |
| dict              | 数据字典配置                                                                       | -      | -      |           |
| options           | 可选项，比 dict.data 优先级高                                                      | array  | -      |           |
| radioName         | radio 组件名称<br/>antdv 使用 button 样式的时候有用<br/>即将废弃,请使用 optionName | -      | -      |           |
| optionName        | 选项的组件名称                                                                     | string | -      |           |
| optionProps       | 选项的属性                                                                         | object | -      | {}        |
| transformDictData | 转换 DictData                                                                      | func   | -      | undefined |

## Events

| Event name      | Properties | Description                                      |
| --------------- | ---------- | ------------------------------------------------ |
| dict-change     |            | 字典数据变化事件                                 |
| selected-change |            | 选中值变化事件，可以获取到当前选中的 option 对象 |
| change          |            | 值变化事件                                       |

---
