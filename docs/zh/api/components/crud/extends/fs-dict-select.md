# FsDictSelect

> 字典选择框
> 支持 el-select|a-select 的属性配置

## Props

| Prop name         | Description                   | Type   | Values | Default   |
| ----------------- | ----------------------------- | ------ | ------ | --------- |
| dict              | 字典                          | -      | -      |           |
| options           | 可选项，比 dict.data 优先级高 | array  | -      |           |
| placeholder       | placeholder                   | string | -      |           |
| slots             | select 组件的插槽             | -      | -      |           |
| renderLabel       | 自定义 label 的 render 方法   | func   | -      |           |
| transformDictData | 转换 DictData                 | func   | -      | undefined |

## Events

| Event name      | Properties | Description                                      |
| --------------- | ---------- | ------------------------------------------------ |
| dict-change     |            | 字典项变化                                       |
| selected-change |            | 选中值变化事件，可以获取到当前选中的 option 对象 |
| change          |            | 值变化事件                                       |

---
