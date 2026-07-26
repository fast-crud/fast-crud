# 项目地图

在 fast-crud 仓库内工作，或处理从该仓库复制出去的项目时，使用这份地图快速定位关键文件。

## 核心包

- `packages/fast-crud`：核心库。重点文件包括 `src/use/use-crud.ts`、`src/use/use-columns.tsx`、`src/use/default-crud-options.ts`、`src/d/crud.ts`、`src/d/fs.ts` 和 `src/types/list/*`。
- `packages/fast-extends`：可选扩展字段类型和组件，例如上传、富文本、JSON、复制和时间展示。
- `packages/ui/ui-element`、`packages/ui/ui-antdv`、`packages/ui/ui-antdv4`、`packages/ui/ui-naive`：不同 UI 框架的适配包。
- `packages/ui/ui-interface`：UI 适配层共用接口。

## 示例管理后台

- `packages/fast-admin/fs-admin-element`：Element Plus 示例后台。
- `packages/fast-admin/fs-admin-antdv`：Ant Design Vue 3 示例后台。
- `packages/fast-admin/fs-admin-antdv4`：Ant Design Vue 4 示例后台。
- `packages/fast-admin/fs-admin-naive-ui`：Naive UI 示例后台。

## 集成位置

- Element 和 Antdv4 示例通常在 `src/plugin/fast-crud/index.tsx` 中安装 fast-crud。
- Naive UI 示例通常在 `src/plugins/fast_crud/index.tsx` 中安装 fast-crud。
- Element 和 Antdv4 的路由资源通常在 `src/router/source/modules/*.ts` 下。
- Naive UI 的路由通常在 `src/router/modules/*.ts` 下。

## 文档位置

- `docs/zh/guide/start/first.md`：第一个 CRUD 教程。
- `docs/zh/guide/start/integration.md`：集成教程。
- `docs/zh/api/crud-options/request.md`：请求生命周期和转换函数。
- `docs/zh/api/crud-options/columns.md`：字段复合配置。
- `docs/zh/api/dict.md`：数据字典配置。
- `docs/zh/api/types.md`：官方字段类型列表。
