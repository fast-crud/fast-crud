# 示例索引

需要找源码示例时，优先查这里，不要凭空重写。

## 基础页面结构

- `packages/fast-admin/fs-admin-element/src/views/crud/basis/first/index.vue`：单文件入门示例，本地数据模拟。
- `packages/fast-admin/fs-admin-element/src/views/crud/basis/custom`：拆分后的 `index.vue`、`crud.tsx`、`api.ts`、`mock.ts`。

## 字段和表单

- `views/crud/component/text`：文本字段。
- `views/crud/component/select`：选择器和 `dict-select`。
- `views/crud/component/date`：日期和日期范围。
- `views/crud/component/number`：数字字段。
- `views/crud/form/base`：基础表单配置。
- `views/crud/form/validation`：校验规则。
- `views/crud/form/layout`、`layout-grid`、`layout-flex`：表单布局。
- `views/crud/form/drawer`：抽屉表单。
- `views/crud/form/new-page`：独立页面编辑流程。

## 数据字典

- `views/crud/dict/single`：单例字典。
- `views/crud/dict/cloneable`：分发复制字典。
- `views/crud/dict/prototype`：原型模式。
- `views/crud/dict/shared`：共享字典数据。

## 表格行为

- `views/crud/feature/search`：查询表单。
- `views/crud/feature/selection`：行选择和批量操作。
- `views/crud/feature/tree`：树形表格。
- `views/crud/feature/export`：导出。
- `views/crud/feature/value-builder`：`valueBuilder` 和 `valueResolve`。
- `views/crud/feature/columns-set`：列设置。
- `views/crud/feature/column-resize`：Antdv4 列宽调整。

## 编辑模式

- `views/crud/editable/free`：自由编辑。
- `views/crud/editable/row`：行编辑。
- `views/crud/editable/cell`：单元格编辑。
- `views/crud/editable/sub-crud`：子 CRUD。

## 扩展组件

- `views/crud/component/uploader/*`：各种上传组件。
- `views/crud/component/editor`：富文本编辑器。
- `views/crud/component/code`：代码编辑器。
- `views/crud/component/json`：JSON 编辑器。
- `views/crud/component/phone`：手机号输入。

## 高级场景

- `views/crud/advanced/from-backend`：从后端加载 `crudOptions`。
- `views/crud/advanced/local-pagination`：本地分页。
- `views/crud/advanced/nest`：嵌套表格。
- `views/crud/advanced/in-dialog`：弹窗中显示 CRUD。
- `views/crud/advanced/in-drawer`：Antdv4 抽屉中显示 CRUD。
