---
name: fs-crud-builder
description: 使用 @fast-crud/fast-crud 构建、改造和排查 Vue 3 CRUD 页面。适用于 Codex 需要新增或修改 fast-crud CRUD 模块，创建 index.vue、crud.tsx 或 crud.ts、api.ts、可选 mock.ts，接入路由菜单，配置 columns、search、form、table、request、dict、valueBuilder、valueResolve，集成 Element Plus、Ant Design Vue、Antdv4、Naive UI 管理后台，或诊断表格空白、分页转换、字典和 UI 适配问题。
---

# FS CRUD 构建器

## 工作流程

使用这个 skill 在 Vue 3 管理后台项目中创建或修改 fast-crud CRUD 页面。

1. 编辑前先识别项目形态：
   - 查看 `package.json`，确认 `@fast-crud/fast-crud`、`@fast-crud/ui-*`、`@fast-crud/fast-extends` 和基础 UI 库。
   - 搜索现有代码中的 `app.use(FastCrud`、`useFs`、`useFsRef`、`useCrud`、`crudOptions` 和邻近 CRUD 示例。
   - 优先复用目标项目已有 CRUD 写法，不要先套用内置模板。

2. 如果 fast-crud 还没集成，或应用壳层不清楚，读取 `references/integration-checklist.md`。

3. 新建 CRUD 页面时，读取 `references/crud-scaffold-patterns.md`，然后选择：
   - 复制相似的现有模块并改造。
   - 运行 `scripts/scaffold-crud.mjs`，基于 `assets/basic-crud` 创建基础模块。

4. 处理字段配置时，读取 `references/crud-options-cheatsheet.md`。

5. 处理后端分页、非标准返回结构、查询参数、排序参数或数据字典时，读取 `references/request-and-dict.md`。

6. 处理 Element Plus、Ant Design Vue、Antdv4、Naive UI 差异时，读取 `references/ui-adapter-notes.md`。

7. 需要在 fast-crud 仓库中寻找源码示例时，读取 `references/example-index.md`。

## 实现规则

- 保持 CRUD 模块职责清晰：`index.vue` 负责页面挂载，`crud.tsx` 或 `crud.ts` 负责 `createCrudOptions`，`api.ts` 负责接口请求，`mock.ts` 只在需要 mock 时存在。
- 默认使用 `useFs({ createCrudOptions })`，或使用 `useFsRef()` 配合 `await useFs(...)`；只有目标项目仍沿用底层写法时，才使用 `useCrud` 加 `useExpose`。
- 后端结构转换如果是全项目通用逻辑，放到全局 `commonOptions().request.transformQuery/transformRes`；只有单页接口特殊时，才放在页面里。
- 页面挂载后默认调用 `crudExpose.doRefresh()`，除非目标项目已有不同加载约定。
- 确认 `<fs-crud>` 的父容器有可用高度。表格空白时，先检查容器高度，再改请求逻辑。
- `requestForMock` 只适合演示项目。真实后端项目要切换成项目里的真实请求封装。
- 小型本地字典使用 `dict({ data })`，远程字典使用 `dict({ url })` 并走全局 `dictRequest`。
- 使用 `valueBuilder` 把后端行数据转换为组件值，使用 `valueResolve` 在提交前转换回后端需要的表单值。

## 验证

修改后尽量运行目标包已有检查：

- `pnpm tsc` 或目标包的 `pnpm run tsc`
- 路由或集成改动较大时运行 `pnpm run build`
- UI 行为重要时启动本地开发服务并用浏览器检查

如果依赖缺失、包体太大或检查无法运行，要明确说明原因，并至少手动检查导入、路由路径和请求绑定。
