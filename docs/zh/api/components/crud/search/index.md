# FsSearch

> 查询框组件

## Props

| Prop name        | Description                                                                   | Type            | Values | Default   |
| ---------------- | ----------------------------------------------------------------------------- | --------------- | ------ | --------- |
| container        | 布局容器                                                                      | object          | -      |           |
| initialForm      | 初始查询条件<br/>点击重置，会重置成该条件                                     | object          | -      |           |
| validatedForm    | 校验后的查询表单数据                                                          | object          | -      |           |
| options          | 表单参数<br/>支持 el-form \| a-form 的属性                                    | object          | -      |           |
| columns          | 查询字段配置                                                                  | object          | -      |           |
| buttons          | 按钮配置,可以根据 order 排序<br/>`{search:{...FsButton},reset:{...FsButton}}` | object          | -      |           |
| searchAfterReset | 点击重置后是否立即触发查询                                                    | boolean         | -      | true      |
| autoSearch       | 是否开启自动查询                                                              | boolean         | -      | true      |
| debounce         | 自动查询，防抖设置<br/>传 false 则关闭自动查询                                | boolean\|object | -      | undefined |
| slots            | 插槽                                                                          | object          | -      | {}        |
| show             | 是否显示查询框                                                                | boolean         | -      | true      |
| validate         | 是否启用校验                                                                  | boolean         | -      | false     |
| validateOnChange | 是否任意值变化就触发校验                                                      | boolean         | -      | true      |
| col              | 列的宽度设置，span=xx                                                         | -               | -      |           |
| formItem         | 统一字段的 formItem 属性                                                      | object          | -      | undefined |

## Events

| Event name           | Properties | Description                |
| -------------------- | ---------- | -------------------------- |
| search               |            | 查询事件                   |
| \_search             |            | 查询事件，此事件供系统调用 |
| reset                |            | 重置事件，供用户使用       |
| \_reset              |            | 重置事件，此事件供系统调用 |
| validate-error       |            | 校验失败事件               |
| update:validatedForm |            | 校验后的表单数据变化       |

---
