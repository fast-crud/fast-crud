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
| slots       | 配置式插槽，支持以对象传入插槽函数             | Record&lt;string, Slot&gt; | -      | {}                                              |
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

### 配置式插槽

可通过 `slots` 属性传入插槽函数，适用于 TSX/JSX 或配置式页面，无需在 `fs-crud` 内部编写 `<template #xxx>`。

```tsx
<fs-crud
  {...crudBinding}
  slots={{
    headerTop: () => <div>自定义头部</div>,
    toolbarLeft: () => <button>批量操作</button>,
    cell_name: ({ row }) => <span>{row.name}</span>
  }}
/>
```

布局插槽统一使用驼峰格式，如 `paginationLeft`、`headerTop`；同时兼容短横线格式，如 `pagination-left`、`header-top`。`cell_*`、`form_*`、`search_*`、`toolbar_*` 会分别传递到表格、表单、查询和工具栏组件。配置式插槽与模板插槽同名时，显式声明的模板插槽优先。

---
