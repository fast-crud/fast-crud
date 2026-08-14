# slots【插槽】

插槽用于在不替换 CRUD 整体结构的前提下，自定义页面区域、表格单元格和表单字段。通常优先使用模板插槽；当页面本身使用 TSX/JSX 或需要把页面完全配置化时，再使用 `crudOptions.slots`。

完整的插槽列表、驼峰与短横线命名兼容规则请查看 [slots 配置 API](/api/crud-options/slots.md)。

## 页面区域插槽

页面区域插槽适合在工具条、动作条、分页区等位置增加业务内容。模板中使用短横线名称：

```vue
<template>
  <fs-crud ref="crudRef" v-bind="crudBinding">
    <template #toolbar-left>
      <button type="button">批量导入</button>
    </template>

    <template #pagination-left>
      <span>当前列表由部门筛选</span>
    </template>
  </fs-crud>
</template>
```

常用页面区域如下：

| 区域 | 插槽名称 |
| --- | --- |
| 头部 | `header-top`、`header-middle`、`header-bottom` |
| 动作条 | `actionbar-left`、`actionbar-right` |
| 工具条 | `toolbar-left`、`toolbar-right` |
| 分页 | `pagination-left`、`pagination-right` |
| 底部 | `footer-top`、`footer-bottom` |

`default` 插槽会渲染在 CRUD 容器中，适合完全自定义容器内容的场景。

## 表格单元格插槽

单元格插槽名为 `cell_字段名`。插槽参数中包含当前行 `row`，可用于组合多个字段或渲染自定义操作。

```vue
<fs-crud ref="crudRef" v-bind="crudBinding">
  <template #cell_name="{ row }">
    <a :href="`/users/${row.id}`">{{ row.firstName }} {{ row.lastName }}</a>
  </template>
</fs-crud>
```

例如字段 key 为 `name` 时，对应插槽就是 `cell_name`。

## 查询与表单字段插槽

查询字段使用 `search_字段名`，表单字段使用 `form_字段名`。它们可以替换指定字段的默认输入或展示内容。

```vue
<fs-crud ref="crudRef" v-bind="crudBinding">
  <template #search_status="{ form }">
    <input v-model="form.status" />
  </template>

  <template #form_name="{ form, mode }">
    <input v-model="form.name" :disabled="mode === 'view'" />
  </template>
</fs-crud>
```

表单区域还提供以下占位插槽，可用于放置说明、辅助操作或汇总内容：

| 区域 | 插槽名称 |
| --- | --- |
| 表单头部 | `form-header-left`、`form-header-right` |
| 表单头部操作区 | `form-header-action-left`、`form-header-action-right` |
| 表单主体 | `form-body-top`、`form-body-bottom` |
| 表单底部 | `form-footer-left`、`form-footer-right` |

这些表单区域插槽的 `scope` 包含当前模式 `mode`、表单数据获取方法 `getFormData` 和表单包装器实例 `_self`。

## 配置式插槽

在 `crud.tsx` 等 TSX/JSX 文件中，可以把插槽写进 `crudOptions`，不需要额外的 `<template>`：

```tsx
const crudOptions = {
  slots: {
    paginationLeft: () => <span>共 100 条</span>,
    cell_name: ({ row }) => <span>{row.name}</span>
  }
};
```

配置式页面区域插槽推荐使用驼峰命名，例如 `paginationLeft`、`toolbarLeft`；短横线写法也兼容。字段插槽仍使用下划线命名，例如 `cell_name`、`form_name`。

当配置式插槽和模板中同名插槽同时存在时，模板插槽优先。这允许在公共配置中提供默认插槽，再由某个页面按需覆盖。

## 选择方式

- 页面是 `.vue` 文件，或需要直接使用当前页面状态：使用模板插槽。
- 页面是 `.tsx` 文件，或插槽需要作为 CRUD 配置的一部分复用：使用 `crudOptions.slots`。
- 需要了解所有可用插槽及其命名：查看 [slots 配置 API](/api/crud-options/slots.md)。
