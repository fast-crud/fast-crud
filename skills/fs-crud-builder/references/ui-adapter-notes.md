# UI 适配说明

在 Element Plus、Ant Design Vue、Antdv4、Naive UI 之间迁移或改造代码时使用这份说明。

## 包导入

- Element Plus：`@fast-crud/ui-element`，基础库是 `element-plus`
- Ant Design Vue 3：`@fast-crud/ui-antdv`，基础库是 `ant-design-vue`
- Ant Design Vue 4：`@fast-crud/ui-antdv4`，还需要引入 `@fast-crud/ui-antdv4/dist/style.css`
- Naive UI：`@fast-crud/ui-naive`，基础库是 `naive-ui`

## 表单布局差异

Element 示例常用：

```ts
form: {
  display: "flex",
  labelWidth: "100px",
  row: { gutter: 20 }
}
```

Antdv4 示例常用：

```ts
form: {
  display: "flex",
  labelCol: {
    span: null,
    style: { width: "120px" }
  },
  wrapperCol: { span: null }
}
```

Naive 示例常用：

```ts
form: {
  display: "flex",
  labelWidth: "100px"
}
```

## 表格滚动差异

Element 和 Antdv4 通常配置：

```ts
table: {
  scroll: { x: 1400 }
}
```

Naive UI 通常使用：

```ts
table: {
  scrollX: 1600
}
```

## 按钮和颜色

按钮属性与适配器相关。跨 UI 迁移示例时，优先保留目标项目现有 `commonOptions` 中的按钮结构。

- Element 危险按钮通常使用 `type: "danger"`。
- Antdv4 链接按钮通常使用 `type: "link"`，删除按钮再配红色样式。
- Naive 危险按钮通常使用 `type: "error"`。

## 图标

示例项目的图标名称会随 UI 适配器和后台壳层变化。保持本地约定：

- Element 和 Antdv4 示例常用 Iconify 名称，例如 `ion:create-outline`。
- Naive 示例常用 VIcon 名称，例如 `EditOutlined`、`DeleteOutlined`，路由图标通常通过 `renderIcon`。

## Naive UI provider 要求

Naive UI 需要在 Naive provider 下放置 `<fs-ui-context>`。如果通知或弹窗不可用，先检查 `App.vue`，不要急着改 CRUD 代码。

## TSX 渲染回调

如果 `crud.tsx` 使用 JSX，确认目标包已经配置 Vue JSX 支持。fast-crud 示例项目默认支持。
