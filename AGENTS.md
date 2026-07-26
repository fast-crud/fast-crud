# AGENTS.md

本文件是给 AI 开发代理使用的项目级规范。修改本仓库时，以本文件为优先上下文；若子目录以后出现更近的 `AGENTS.md`，以更近文件为准。

## 项目定位

fast-crud 是一个基于 Vue 3、Vite、TypeScript 的面向配置 CRUD 框架，可作为低代码或管理后台 CRUD 能力的基础框架。仓库采用 pnpm workspace + lerna 管理多包：

- `packages/fast-crud`：核心 `@fast-crud/fast-crud` 包，包含 CRUD 运行时、类型、use hooks、字段类型、导出等核心能力。
- `packages/ui/ui-interface`：UI 抽象层。
- `packages/ui/ui-antdv`、`ui-antdv4`、`ui-element`、`ui-naive`：不同 UI 组件库适配器。
- `packages/ui/ui-demo`：多 UI 适配演示项目。
- `packages/fast-extends`：扩展组件，如 uploader、input、time 等。
- `packages/fast-ecology/editor-code`：代码编辑器生态组件。
- `packages/fast-admin/*`：示例管理后台，包含 Ant Design Vue、Antdv4、Element Plus、Naive UI 版本。
- `docs/zh`：VitePress 中文文档与生成后的 API 文档。
- `docgen`：组件文档生成配置。
- `skills/fs-crud-builder`：面向 fast-crud CRUD 页面开发的本地 AI skill。

本项目重点是 `fs-crud` 组件与 CRUD 配置框架，admin 脚手架主要是示例与集成参考。

## 基础环境

- 使用 `pnpm` 作为包管理器，根 `package.json` 要求 Node `>=20.10.0`、pnpm `>=8.15.7`。
- workspace 范围来自 `pnpm-workspace.yaml`：`packages/**`，排除 `**/test/**`。
- 根目录 TypeScript 配置开启 `strict: true`，但 `noImplicitAny: false`。
- 编辑器规范来自 `.editorconfig`：UTF-8、LF、文件末尾换行、2 空格缩进、建议行宽 100。
- Windows PowerShell 读写中文文件时必须显式指定 UTF-8，例如：
  - 读取：`Get-Content -Raw -Encoding UTF8 AGENTS.md`
  - 写入或追加时也要保证 UTF-8，避免中文乱码。

## 工作原则

- 先阅读相关包的 `package.json`、邻近实现和现有示例，再改代码。
- 优先复用项目已有模式，不为局部需求引入新框架、新目录风格或大范围重构。
- 控制改动范围，只修改完成任务必须触及的文件。
- 不要回滚、覆盖或格式化用户已有改动；发现无关 dirty 文件时忽略即可。
- 修改公共 API、类型定义、UI 适配器、请求转换、字典逻辑时，要同步考虑文档、demo 和向后兼容。
- 不要随意改版本号、CHANGELOG、构建产物、生成文档或发布配置，除非任务明确要求。
- 涉及中文文档、示例标题、注释时保持简体中文表达自然，并注意 UTF-8。

## 常用命令

根目录常用命令：

```bash
pnpm install
pnpm run docs:dev
pnpm run docs:build
pnpm run docgen:all
pnpm run init
```

核心包检查（**注意：`pnpm run tsc` 目前存在问题，AI 不应执行，由用户按需执行**）：

```bash
cd packages/fast-crud
pnpm run test
pnpm run build
pnpm run typedoc
```

扩展包和生态组件（**注意：`pnpm run tsc` 目前存在问题，AI 不应执行**）：

```bash
cd packages/fast-extends
pnpm run build

cd packages/fast-ecology/editor-code
pnpm run build
```

UI 适配器（**注意：`pnpm run tsc` 目前存在问题，AI 不应执行**）：

```bash
cd packages/ui/ui-interface
pnpm run build

cd packages/ui/ui-antdv
pnpm run build

cd packages/ui/ui-antdv4
pnpm run build

cd packages/ui/ui-element
pnpm run build

cd packages/ui/ui-naive
pnpm run build
```

demo 与 admin（**注意：`pnpm run tsc` 目前存在问题，AI 不应执行**）：

```bash
cd packages/ui/ui-demo
pnpm run dev
pnpm run type-check
pnpm run test:unit
pnpm run build-only

cd packages/fast-admin/fs-admin-antdv
pnpm run dev
pnpm run build

cd packages/fast-admin/fs-admin-antdv4
pnpm run dev
pnpm run build

cd packages/fast-admin/fs-admin-element
pnpm run dev
pnpm run build

cd packages/fast-admin/fs-admin-naive-ui
pnpm run dev
pnpm run build
```

优先运行与改动包最相关的最小验证。跨核心包、UI 适配器或示例联动时，再扩大到相关包构建或 demo 手动检查。**所有 tsc / 类型检查均由用户按需执行，AI 不主动运行。**

## 高风险命令

以下命令可能发布、提交、推送或大规模改动文件，AI 未经明确要求不得执行：

- `pnpm run publish`
- `pnpm run patch`
- `pnpm run minor`
- `pnpm run publish:canary`
- `pnpm run prepublishOnly`
- `pnpm run afterpublishOnly`
- `pnpm run afterPubPush`
- `pnpm run before-build`
- `pnpm run no-push`
- 各包中的 `afterPubPush`
- `git push`
- `git reset --hard`
- `git checkout -- <path>`
- 删除 `node_modules`、`dist`、生成文档或大目录的命令，除非任务明确要求且路径已确认。

注意：根目录和部分 admin 包脚本中存在自动 `git add`、`git commit`、`git push` 的发布流程，普通开发验证不要触发。

## 代码风格

- Vue 代码以 Vue 3、Composition API、Vite 生态为主，优先沿用邻近文件写法。
- TypeScript/TSX 文件保持现有导入风格和类型组织方式，不随意扩大 `any` 或关闭类型检查。
- `.vue`、`.ts`、`.tsx`、`.js`、`.jsx` 混用时，以目标目录已有文件类型为准。
- 样式主要使用 Less/CSS/Tailwind/Windi 等既有配置；不要无故切换方案。
- 仅在复杂逻辑前添加有价值的短注释，不添加解释显而易见代码的注释。
- 公共类型和导出变更要检查 `packages/fast-crud/src/d`、`index.ts`、对应 `index.d.ts` 或文档生成入口。

## fast-crud CRUD 开发约定

创建或修改 CRUD 页面时，优先使用仓库内的 `skills/fs-crud-builder` 作为参考。常规约定：

- 页面模块通常由 `index.vue`、`crud.tsx` 或 `crud.ts`、`api.ts`、可选 `mock.ts` 组成。
- `index.vue` 负责页面挂载和调用 `useFs`，CRUD 配置放在 `createCrudOptions`。
- 默认使用 `useFs({ createCrudOptions })` 或目标项目已有等价写法。
- 页面加载后通常调用 `crudExpose.doRefresh()`，除非邻近示例有其他约定。
- 接口请求放在 `api.ts`，mock 只用于演示项目或明确的本地示例。
- 本地字典使用 `dict({ data })`，远程字典使用 `dict({ url })` 并遵循全局 `dictRequest`。
- 后端分页、查询参数、排序参数、返回结构转换，若是全局规则应放到全局 common options；单页特殊情况才放页面内。
- 使用 `valueBuilder` 处理后端行数据到组件值的转换，使用 `valueResolve` 处理提交前转换。
- 表格空白时先检查 `<fs-crud>` 父容器高度，再排查请求和数据转换。
- UI 适配差异要同时关注 Antdv 3、Antdv 4、Element Plus、Naive UI 的组件名、props、事件和插槽差别。

## 测试与验证策略

- **重要说明：`pnpm run tsc` 目前存在问题，AI 不应执行任何 tsc 相关命令。tsc 类型检查和测试验证统一由用户按需执行，AI 只做代码逻辑与运行时验证。**
- 核心逻辑改动：可在 `packages/fast-crud` 运行 `pnpm run test` 和 `pnpm run build`（tsc 由用户执行）。
- UI 适配器改动：在对应 `packages/ui/ui-*` 运行 `pnpm run build`（tsc 由用户执行）。
- 扩展组件改动：在 `packages/fast-extends` 或 `packages/fast-ecology/editor-code` 运行 `pnpm run build`（tsc 由用户执行）。
- admin 示例改动：在对应 `packages/fast-admin/*` 必要时运行 `pnpm run build`，UI 行为重要时启动 `pnpm run dev` 手动检查（tsc 由用户执行）。
- 文档改动：运行 `pnpm run docs:build`；涉及组件 API 文档时再运行 `pnpm run docgen:all`。
- 若依赖未安装、检查耗时过长或脚本本身不可用，需要在最终说明中明确未运行的验证和原因。

### TDD 与单元测试约定

- 实现新功能或修复行为缺陷前，优先补对应单元测试并确认红灯（测试失败），再实现代码并跑聚焦验证。确实不适合先写测试时，在回复中说明原因和替代验证方式。
- 后补单元测试时，先按正确行为写预期；如果红灯需要修改既有实现，先向用户确认这是 bug 还是既有需求，避免未经确认改变行为。

## 文档与生成文件

- `docs/zh` 是中文文档主体，改 API 或行为时优先查找相邻文档同步更新。
- `docs/zh/public/d.ts`、部分 changelog、typedoc/docgen 产物可能是生成文件，不要手改大段生成内容；优先运行对应生成命令。
- README 中包含中文介绍、示例和图片引用，改动时注意 Markdown 图片路径和中英文 README 是否需要同步。

## Git 协作

- 开始修改前用 `git status --short` 了解工作区状态。
- 不要还原用户未要求还原的修改。
- 不要自行提交或推送，除非任务明确要求。
- 如果必须新增文件，确认不会覆盖已有文件；如果同名文件已存在，先完整读取再编辑。
- 最终回复要说明改了哪些文件、运行了哪些验证，以及未验证项。

