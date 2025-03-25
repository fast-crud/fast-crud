# FsCrud

> fs-crud

## Props

| Prop name   | Description                                    | Type              | Values | Default                                         |
| ----------- | ---------------------------------------------- | ----------------- | ------ | ----------------------------------------------- |
| id          | 表格 id                                        | string            | -      | ""                                              |
| table       | 表格配置，见 FsTable                           | object            | -      | {}                                              |
| data        | 表格数据                                       | array             | -      |                                                 |
| rowHandle   | 操作列配置，见 FsRowHandle                     | object            | -      | {}                                              |
| search      | 查询框配置，见 FsSearch                        | object            | -      | {}                                              |
| toolbar     | 工具条配置，见 FsToolbar                       | object            | -      | {}                                              |
| actionbar   | 动作条配置，见 FsActionbar                     | object            | -      | {}                                              |
| tabs        | tabs filter                                    | object            | -      | {}                                              |
| addForm     | 添加表单对话框配置，见 FsFormWrapper           | object            | -      | {}                                              |
| editForm    | 编辑表单对话框配置，见 FsFormWrapper           | object            | -      | {}                                              |
| viewForm    | 查看表单对话框配置，见 FsFormWrapper           | object            | -      | {}                                              |
| pagination  | 翻页配置,支持 el-pagination\|a-pagination 配置 | object            | -      | { show: false }                                 |
| container   | 容器配置，见 FsContainer                       | object            | -      | {}                                              |
| customClass | crud 包裹容器的 class                          | -                 | -      |                                                 |
| form        | 不要传到 fs-table 去                           | object            | -      | {}                                              |
| selection   | 可选择                                         | RowSelectionProps | -      | function() {<br/> return { show: false };<br/>} |

## Events

| Event name        | Properties | Description |
| ----------------- | ---------- | ----------- |
| form-value-change |            |
| update:search     |            |
| update:compact    |            |
| update:columns    |            |
| update:modelValue |            |
| tab-change        |            |

## Slots

| Name             | Description | Bindings |
| ---------------- | ----------- | -------- |
| default          |             |          |
| header-top       |             |          |
| header-bottom    |             |          |
| header-middle    |             |          |
| actionbar-left   |             |          |
| actionbar-right  |             |          |
| toolbar-left     |             |          |
| toolbar-right    |             |          |
| pagination-left  |             |          |
| pagination-right |             |          |
| footer-top       |             |          |
| footer-bottom    |             |          |

---
