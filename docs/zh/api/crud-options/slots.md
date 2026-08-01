# crudOptions.slots

`slots` 用于为 `fs-crud` 配置插槽函数。适合在 TSX/JSX 或 `crud.tsx` 等配置式页面中使用，无需在页面模板内编写 `<template #xxx>`。

## 基本用法

将插槽函数配置在 `crudOptions.slots` 中。使用 JSX 时，文件后缀需要为 `.tsx`。

```tsx
export default function createCrudOptions() {
  return {
    slots: {
      paginationLeft: () => <span>共 100 条</span>,
      toolbarLeft: () => <button>批量操作</button>,
      cell_name: ({ row }) => <span>{row.name}</span>
    }
  };
}
```

也可以直接作为 `fs-crud` 的 props 传入：

```tsx
<fs-crud
  {...crudBinding}
  slots={{
    headerTop: () => <div>自定义头部</div>
  }}
/>
```

## 布局插槽

布局插槽推荐使用驼峰格式。为兼容已有页面，短横线格式也可以使用。

| 推荐名称 | 兼容名称 | 位置 |
| --- | --- | --- |
| `default` | - | CRUD 容器默认内容 |
| `headerTop` | `header-top` | 头部顶部 |
| `headerMiddle` | `header-middle` | 头部中间 |
| `headerBottom` | `header-bottom` | 头部底部 |
| `actionbarLeft` | `actionbar-left` | 动作条左侧 |
| `actionbarRight` | `actionbar-right` | 动作条右侧 |
| `toolbarLeft` | `toolbar-left` | 工具条左侧 |
| `toolbarRight` | `toolbar-right` | 工具条右侧 |
| `paginationLeft` | `pagination-left` | 分页区域左侧 |
| `paginationRight` | `pagination-right` | 分页区域右侧 |
| `footerTop` | `footer-top` | 底部顶部 |
| `footerBottom` | `footer-bottom` | 底部底部 |

```tsx
const crudOptions = {
  slots: {
    paginationLeft: () => <span>推荐写法</span>,
    "pagination-right": () => <button>兼容短横线写法</button>
  }
};
```

同一来源同时传入两种名称时，驼峰格式优先。例如同时传入 `paginationLeft` 和 `pagination-left` 时，会渲染 `paginationLeft`。

## 子组件插槽

以下前缀的插槽会透传到对应子组件，名称保持原样：

| 前缀 | 目标组件 | 示例 |
| --- | --- | --- |
| `cell_*` | 表格单元格 | `cell_name` |
| `form_*` | 表单字段 | `form_name` |
| `search_*` | 查询字段或查询区域 | `search_name`、`search-left` |
| `toolbar_*` | 工具条 | `toolbar_export` |

子组件插槽函数会收到对应组件提供的 `scope`。例如 `cell_name` 通常可从参数中获取 `row`：

```tsx
const crudOptions = {
  slots: {
    cell_name: ({ row }) => <span>{row.name}</span>,
    form_name: ({ form }) => <span>{form.name}</span>
  }
};
```

## 与模板插槽共同使用

配置式插槽和模板插槽可同时存在。模板中显式声明的同名插槽优先：

```vue
<fs-crud v-bind="crudBinding">
  <template #pagination-left>
    模板插槽内容
  </template>
</fs-crud>
```

上例会覆盖 `crudOptions.slots.paginationLeft` 或 `crudOptions.slots['pagination-left']` 的内容。
