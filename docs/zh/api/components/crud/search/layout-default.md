# FsSearchLayoutDefault

## Props

| Prop name      | Description                                | Type    | Values | Default       |
| -------------- | ------------------------------------------ | ------- | ------ | ------------- |
| collapse       | 是否收缩                                   | boolean | -      | true          |
| collapseButton | 展开按钮                                   | object  | -      |               |
| action         |                                            | object  | -      |               |
| layout         | 布局模式                                   | string  | -      | "single-line" |
| columns        | 查询字段列表，可以精细化自定义查询字段布局 | object  | -      |               |
| col            | 默认的 col 配置                            | object  | -      |               |
| getContextFn   | 获取查询上下文                             | func    | -      |               |

## Events

| Event name      | Properties | Description |
| --------------- | ---------- | ----------- |
| update:collapse |            |
| collapse        |            |

## Slots

| Name           | Description | Bindings |
| -------------- | ----------- | -------- |
| search-left    |             |          |
| search-middle  |             |          |
| search-buttons |             |          |
| search-right   |             |          |

---
