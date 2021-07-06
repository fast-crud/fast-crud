# FsSearch

> 查询框组件

## Props

| Prop name        | Description                                            | Type    | Values | Default                          |
| ---------------- | ------------------------------------------------------ | ------- | ------ | -------------------------------- |
| initialForm      | 初始查询条件<br>点击重置，会重置成该条件               | object  | -      |                                  |
| options          | 表单参数<br>支持 el-form\|a-form 的属性                | object  | -      |                                  |
| columns          | 查询字段配置                                           | object  | -      |                                  |
| buttons          | 按钮配置<br>{search:{...FsButton},reset:{...FsButton}} | object  | -      |                                  |
| searchAfterReset | 点击重置后是否立即触发查询                             | boolean | -      | true                             |
| autoSearch       | 是否开启自动查询                                       | boolean | -      | true                             |
| debounce         | 自动查询，防抖设置                                     | object  | -      |                                  |
| slots            | 插槽                                                   |         | -      | function() {<br> return {};<br>} |
| show             | 是否显示查询框                                         | boolean | -      | true                             |
| validate         | 是否启用校验                                           | boolean | -      | false                            |

## Events

| Event name | Properties | Description |
| ---------- | ---------- | ----------- |
| search     |            | 查询事件    |
| reset      |            | 重置事件    |

---
