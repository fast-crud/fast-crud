# FsDictCheckbox

> 字典 checkbox
> 支持 el-checkbox|a-checkbox 参数

## Props

| Prop name         | Description                 | Type   | Values | Default   |
| ----------------- | --------------------------- | ------ | ------ | --------- |
| dict              | 字典                        | -      | -      |           |
| options           | 选项，比 dict.data 优先级高 | array  | -      | undefined |
| optionName        | 选项的组件名称              | string | -      |           |
| optionProps       | 选项的属性                  | object | -      | {}        |
| transformDictData | 转换 DictData               | func   | -      | undefined |

## Events

| Event name      | Properties | Description                                      |
| --------------- | ---------- | ------------------------------------------------ |
| dict-change     |            | 字典数据变化事件                                 |
| selected-change |            | 选中值变化事件，可以获取到当前选中的 option 对象 |
| change          |            | 值变化事件                                       |

---
