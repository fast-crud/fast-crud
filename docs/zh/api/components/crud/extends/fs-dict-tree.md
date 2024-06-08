# FsDictTree

> 字典树选择组件
> 支持 a-tree-select 参数

## Props

| Prop name         | Description                   | Type   | Values | Default   |
| ----------------- | ----------------------------- | ------ | ------ | --------- |
| dict              | 数据字典                      | -      | -      |           |
| options           | 可选项，比 dict.data 优先级高 | array  | -      |           |
| placeholder       | placeholder                   | string | -      |           |
| transformDictData | 转换 DictData                 | func   | -      | undefined |

## Events

| Event name      | Properties | Description                                      |
| --------------- | ---------- | ------------------------------------------------ |
| dict-change     |            | 字典数据变化事件                                 |
| selected-change |            | 选中值变化事件，可以获取到当前选中的 option 对象 |
| change          |            | 值变化事件                                       |

---
