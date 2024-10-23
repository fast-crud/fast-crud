# FsDictCascader

> 字典级联组件
> 支持 el-cascader|a-cascader 组件的参数

## Props

| Prop name         | Description                 | Type  | Values | Default   |
| ----------------- | --------------------------- | ----- | ------ | --------- |
| dict              | 字典配置                    | -     | -      |           |
| options           | 选项，比 dict.data 优先级高 | array | -      |           |
| transformDictData | 转换 DictData               | func  | -      | undefined |

## Events

| Event name      | Properties | Description                                      |
| --------------- | ---------- | ------------------------------------------------ |
| dict-change     |            | 字典数据变化事件                                 |
| selected-change |            | 选中值变化事件，可以获取到当前选中的 option 对象 |
| change          |            | 值变化事件                                       |

---
