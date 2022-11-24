# FsCrud

> fs-crud

## Props

| Prop name   | Description                                    | Type  | Values | Default |
| ----------- | ---------------------------------------------- | ----- | ------ | ------- |
| table       | 表格配置，见 FsTable                           |       | -      |         |
| data        | 表格数据                                       | array | -      |         |
| rowHandle   | 操作列配置，见 FsRowHandle                     |       | -      |         |
| search      | 查询框配置，见 FsSearch                        |       | -      |         |
| toolbar     | 工具条配置，见 FsToolbar                       |       | -      |         |
| actionbar   | 动作条配置，见 FsActionbar                     |       | -      |         |
| addForm     | 添加表单对话框配置，见 FsFormWrapper           |       | -      |         |
| editForm    | 编辑表单对话框配置，见 FsFormWrapper           |       | -      |         |
| viewForm    | 查看表单对话框配置，见 FsFormWrapper           |       | -      |         |
| pagination  | 翻页配置,支持 el-pagination\|a-pagination 配置 |       | -      |         |
| container   | 容器配置，见 FsContainer                       |       | -      |         |
| customClass | crud 包裹容器的 class                          |       | -      |         |
| form        | 不要传到 fs-table 去                           |       | -      |         |

## Events

| Event name        | Properties | Description |
| ----------------- | ---------- | ----------- |
| update:search     |            |
| update:compact    |            |
| update:columns    |            |
| refresh           |            |
| form-value-change |            |
| search-submit     |            |
| search-reset      |            |
| update:modelValue |            |

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
