# FsTable

> fs-table,表格封装
> 支持 el-table/a-table 的参数

## Props

| Prop name         | Description                                       | Type                   | Values | Default                            |
| ----------------- | ------------------------------------------------- | ---------------------- | ------ | ---------------------------------- |
| tableVersion      |                                                   | string                 | -      |                                    |
| slots             | table 插槽                                        | any                    | -      |                                    |
| cellSlots         | 单元格插槽                                        | any                    | -      |                                    |
| columns           | 列配置，支持 el-table-column\|a-table-column 配置 | TableColumnsProps      | -      | undefined                          |
| rowHandle         | 操作列                                            | any                    | -      |                                    |
| show              | 是否显示表格                                      | boolean                | -      | true                               |
| data              | 表格数据                                          | array                  | -      | []                                 |
| conditionalRender |                                                   | ConditionalRenderProps | -      |                                    |
| editable          | 行编辑，批量编辑                                  | EditableProps          | -      | function() {<br/> return {};<br/>} |
| loading           |                                                   | boolean                | -      | false                              |
| sort              | 当前 sort 状态                                    | any                    | -      |                                    |
| request           |                                                   | any                    | -      |                                    |
| rowKey            |                                                   | string\|func           | -      | "id"                               |

## Events

| Event name        | Properties | Description |
| ----------------- | ---------- | ----------- |
| row-handle        |            |
| value-change      |            |
| pagination-change |            |
| filter-change     |            |
| sort-change       |            |
| data-change       |            |

---
