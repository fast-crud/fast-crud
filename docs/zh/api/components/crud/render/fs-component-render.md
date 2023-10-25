# FsComponentRender

> 组件动态渲染组件

## Props

| Prop name      | Description                               | Type           | Values | Default |
| -------------- | ----------------------------------------- | -------------- | ------ | ------- |
| modelValue     | modelValue                                | -              | -      |         |
| name           | 组件名称                                  | -              | -      |         |
| slots          | 插槽                                      | object         | -      |         |
| children       | 子元素，同 slots                          | object         | -      |         |
| on             | 事件监听                                  | object         | -      |         |
| events         | 同 on                                     | object         | -      |         |
| scope          | 上下文 scope                              | object         | -      |         |
| vModel         | modelValue 的属性名                       | string\|object | -      |         |
| props          | 组件参数，会与 attrs 合并                 | -              | -      |         |
| render         | 自定义 render                             | -              | -      |         |
| undefineToNull | 当输入框的值上报为 undefine 时，转为 null | boolean        | -      | true    |

## Events

| Event name        | Properties | Description |
| ----------------- | ---------- | ----------- |
| update:dict       |            |
| update:modelValue |            |
| mounted           |            |

---
