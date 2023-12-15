# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.19.3](https://github.com/fast-crud/fast-crud/compare/v1.19.2...v1.19.3) (2023-12-15)

### Bug Fixes

* antdv4 日期组件bug修复 ([a55b3e2](https://github.com/fast-crud/fast-crud/commit/a55b3e293a94396bbdfbd7d6dabb19d886cb8e16))

### Performance Improvements

* 检查records返回值是否是数组 ([6c3e496](https://github.com/fast-crud/fast-crud/commit/6c3e4968ca670d11fa9d1d360786f1123eb1de92))
* 优化merge ([dd0ca41](https://github.com/fast-crud/fast-crud/commit/dd0ca41d753fa90f6a3f550d395ca22ea17ef82d))
* 增加表单label=0px示例 ([500d793](https://github.com/fast-crud/fast-crud/commit/500d793d72d727e8945cf7bca47aee684856bd80))
* 增加formWatch示例 ([ca5910b](https://github.com/fast-crud/fast-crud/commit/ca5910b4839feb2891d2c23c157cbad77dd33722))
* 增加pageRequest返回提示 ([bee140a](https://github.com/fast-crud/fast-crud/commit/bee140a95c9efa04ced3da44b26f413d762b76b1))
* dict组件增加transformDictData配置 ([5efea35](https://github.com/fast-crud/fast-crud/commit/5efea35bf295d05caa4d394e669bf3f69c9bcdc0))
* **form:** 增加beforeValidate事件参数 ([e0bc312](https://github.com/fast-crud/fast-crud/commit/e0bc312643a403cb77aa579a14ad8456811806b6))
* fs-table-select支持插槽按钮 ([5f46ceb](https://github.com/fast-crud/fast-crud/commit/5f46ceb3a92c2b4598ac817f7d122799cc40ff17))
* search 增加loading ([dd14e3f](https://github.com/fast-crud/fast-crud/commit/dd14e3fcd972769aa82401c91567e8b4a0d28b16))

## [1.19.2](https://github.com/fast-crud/fast-crud/compare/v1.19.1...v1.19.2) (2023-11-22)

### Bug Fixes

* **editable:** 行编辑只能删除第一条数据的bug ([daf041f](https://github.com/fast-crud/fast-crud/commit/daf041f21cf531b4e32655248e522c96dd06f460))
* **editable:** 增加获取干净table数据的方法 ([1e1e487](https://github.com/fast-crud/fast-crud/commit/1e1e487d9e50f73d2fdd426d156bfd0138541404))

### Performance Improvements

* **editable:** 增加sub-crud示例 ([d2b67da](https://github.com/fast-crud/fast-crud/commit/d2b67dace06290ae9181b7d27903b9227ca8ce8b))

## [1.19.1](https://github.com/fast-crud/fast-crud/compare/v1.19.0...v1.19.1) (2023-11-20)

### Bug Fixes

* 修复一些错误的类型定义 ([e098f51](https://github.com/fast-crud/fast-crud/commit/e098f511160148a824a1950bf4e85325c2ac50f0))

# [1.19.0](https://github.com/fast-crud/fast-crud/compare/v1.18.5...v1.19.0) (2023-11-20)

### Bug Fixes

* **columnsFilter:** 修复列设置简单模式disabled和show无效的bug ([80fd97a](https://github.com/fast-crud/fast-crud/commit/80fd97abaca475a16de4354572c8f418f2505aa1))
* **editable:** 支持多级数据 ([89db59e](https://github.com/fast-crud/fast-crud/commit/89db59ea2b3dbe8227399086513e27aa7c2ab7aa))
* **form:** 修复form.wrapper.fullscreen无效的bug ([08e0493](https://github.com/fast-crud/fast-crud/commit/08e0493af8fb7ed93eca594c99d2cc2395b78689))

### Features

* **editable:** 行编辑支持表单校验 ([5cf8c91](https://github.com/fast-crud/fast-crud/commit/5cf8c91455d48d0080b8bb0ae7f3336d7bd6e941))
* **editable:** 子表格editable ([01fb2b2](https://github.com/fast-crud/fast-crud/commit/01fb2b245560aa5c6ef51630e20ead0e212ced26))
* **editable:** editable优化重构，分三种模式：free、row、cell，本次为破坏性更新，请谨慎升级 ([a592780](https://github.com/fast-crud/fast-crud/commit/a592780697dc723117bce8759b2c02223ed930c8))

### Performance Improvements

* **editable:** 增加示例 ([b0e2d84](https://github.com/fast-crud/fast-crud/commit/b0e2d840c1333a23b3270f84cb725c790510db50))

## [1.18.5](https://github.com/fast-crud/fast-crud/compare/v1.18.4...v1.18.5) (2023-11-08)

### Bug Fixes

* 修复form.value会覆盖初始值的bug ([050f889](https://github.com/fast-crud/fast-crud/commit/050f889dfbdfb38debcd7c8e4a455acf07198530))

## [1.18.4](https://github.com/fast-crud/fast-crud/compare/v1.18.3...v1.18.4) (2023-11-07)

### Bug Fixes

* 关闭antdv的默认分页 ([dc36caa](https://github.com/fast-crud/fast-crud/commit/dc36caaff1eb16d1769d2ed55cf465a01297475a))
* 修复afterSubmit返回false仍然关闭对话框的bug ([80337ff](https://github.com/fast-crud/fast-crud/commit/80337ffc46eda74d526562d9f27c43a2b6eb0534))

### Performance Improvements

* component.on.event配置 ，兼容事件名称不用on开头的写法 ([28ccfa5](https://github.com/fast-crud/fast-crud/commit/28ccfa57b7bb9481fbdaae60d891b2ba74b6a489))

## [1.18.3](https://github.com/fast-crud/fast-crud/compare/v1.18.2...v1.18.3) (2023-10-26)

### Bug Fixes

* 修复表单form.value默认值无法赋值的bug ([d40def3](https://github.com/fast-crud/fast-crud/commit/d40def3f1201484612df6a27faba214f6d7d9e4d))
* 修复局部组件报错的bug ([648fe0e](https://github.com/fast-crud/fast-crud/commit/648fe0e44b59db0c88304b6665221e560ecf6213))
* 修复dict ts报错 ([6cf2f44](https://github.com/fast-crud/fast-crud/commit/6cf2f441e282b4155373e970fb89f8a540be1290))
* 修复table-selectmodelValue变化，不会刷新dict的bug ([7eeb229](https://github.com/fast-crud/fast-crud/commit/7eeb229c5d0a57c987b977270344e21537fc6f9c))

### Performance Improvements

* component.name局部引用无需shallowRef包裹 ([96c56d8](https://github.com/fast-crud/fast-crud/commit/96c56d86607b27b6f2f4f3270dc828ac68fe4d8d))

## [1.18.2](https://github.com/fast-crud/fast-crud/compare/v1.18.1...v1.18.2) (2023-10-26)

### Bug Fixes

* 导出配置columns报错的bug ([d12f881](https://github.com/fast-crud/fast-crud/commit/d12f881f83e8c521673dc49d656e457a4fc67102))
* 修复动态切换component.name报 resolveComponent 只能在setup和render中使用的问题 ([8792962](https://github.com/fast-crud/fast-crud/commit/8792962156346dbf05445d8f143b23296d60c781))
* 修复editRequest 获取到row值的bug ([108c994](https://github.com/fast-crud/fast-crud/commit/108c994ea1026e9e27750c7e7bbf70b6d345e460))
* 修复element 独立使用表单 el-select宽度问题 ([7fd9ef5](https://github.com/fast-crud/fast-crud/commit/7fd9ef559da8365e0135f00598c2621718c52a3e))
* export columns重构 ([3252095](https://github.com/fast-crud/fast-crud/commit/32520950f8b92aea576450f0f4f9a43a515dd915))

## [1.18.1](https://github.com/fast-crud/fast-crud/compare/v1.18.0...v1.18.1) (2023-10-26)

### Bug Fixes

* 取消 searchCopyFormProps valueResolve配置 ([ae55fda](https://github.com/fast-crud/fast-crud/commit/ae55fda1f9aa206d644f2e3da654201f0831f0be))

# [1.18.0](https://github.com/fast-crud/fast-crud/compare/v1.17.5...v1.18.0) (2023-10-25)

### Bug Fixes

* 修复antdv4，drawer弹窗过时的api ([9514db6](https://github.com/fast-crud/fast-crud/commit/9514db6768b5a5e1bef283b961438a6671f7df79))
* 修复element下按钮图标异常问题 ([4959c2e](https://github.com/fast-crud/fast-crud/commit/4959c2e15b89f6d2fec50864f1453f2965a85159))
* 修复setSearchFormData 参数 mergeForm无效的bug ([5ada5c1](https://github.com/fast-crud/fast-crud/commit/5ada5c16f88f4f1c115b4a74339b94fbfe8674b4))
* 增加文档链接 ([2b9f525](https://github.com/fast-crud/fast-crud/commit/2b9f525988c34ea322695b1a40de0628a627e50a))
* afterSubmit 返回false 阻止管理窗口 ([c26a9e4](https://github.com/fast-crud/fast-crud/commit/c26a9e4ae9180f4db003793aa6129e89b6a4d575))
* **table-select:** 修复element版本中选中记录上点击删除按钮，清空所有value后，报异常的bug ([5d95b40](https://github.com/fast-crud/fast-crud/commit/5d95b4093b80852050e000d51e60f3c566d53d47))
* valueResolve默认复制到search里面 ([d32dc9d](https://github.com/fast-crud/fast-crud/commit/d32dc9d09daaf635ee730c0465b89f25826ec3c7))

### Features

* 新特性，CrudOptionsPlugin ([9e1ac6d](https://github.com/fast-crud/fast-crud/commit/9e1ac6df56622b3b75cd5a23ea565f5c722085de))
* ui-demo，ui-interface独立 ([d78f040](https://github.com/fast-crud/fast-crud/commit/d78f040cd666d072937b0350edb2da11871206e6))

### Performance Improvements

* 表单重置按钮 ([19c74e9](https://github.com/fast-crud/fast-crud/commit/19c74e92e85539f39083000b92a89d34a1321706))
* 导出增加loading ([6530c29](https://github.com/fast-crud/fast-crud/commit/6530c29615be9e1ff04029a962d521bed2df30a6))
* 服务端导出方法支持pageQuery参数 ([f9fbf4c](https://github.com/fast-crud/fast-crud/commit/f9fbf4c412a7b737086869362f9f3cecb2a357e6))
* 优化文档搜索 ([19fff41](https://github.com/fast-crud/fast-crud/commit/19fff41b3f431e2bd1c84274a7d17ad96a547b03))
* 优化values-format组件的dict性能 ([c67c18f](https://github.com/fast-crud/fast-crud/commit/c67c18fc0b48983bc675e1749ccf2833f307246e))

## [1.17.5](https://github.com/fast-crud/fast-crud/compare/v1.17.4...v1.17.5) (2023-09-26)

**Note:** Version bump only for package @fast-crud/fast-crud

## [1.17.4](https://github.com/fast-crud/fast-crud/compare/v1.17.3...v1.17.4) (2023-09-26)

**Note:** Version bump only for package @fast-crud/fast-crud

## [1.17.3](https://github.com/fast-crud/fast-crud/compare/v1.17.2...v1.17.3) (2023-09-23)

**Note:** Version bump only for package @fast-crud/fast-crud

## [1.17.2](https://github.com/fast-crud/fast-crud/compare/v1.17.1...v1.17.2) (2023-09-16)

### Bug Fixes

* 修复naive 时间示例无法修改的bug ([6ab9218](https://github.com/fast-crud/fast-crud/commit/6ab92188fc19d792de8bed0190853c444784b009))

## [1.17.1](https://github.com/fast-crud/fast-crud/compare/v1.17.0...v1.17.1) (2023-09-13)

### Bug Fixes

* 修复element 版 search label无法上置的问题 ([09ede7c](https://github.com/fast-crud/fast-crud/commit/09ede7c6be18029ec3cbdcb2d327c3017ee1290f))

### Performance Improvements

* table select 支持返回object对象 ([08c5d20](https://github.com/fast-crud/fast-crud/commit/08c5d20a2570e824b2698335ef23c806fc979788))

# [1.17.0](https://github.com/fast-crud/fast-crud/compare/v1.16.11...v1.17.0) (2023-09-12)

### Bug Fixes

* 修复row.gutter在分组模式下无效的bug ([b3568b4](https://github.com/fast-crud/fast-crud/commit/b3568b4c464bb9964e81a9d5518645280448b658))
* 修复wrapper.zIndex无效的bug ([695621c](https://github.com/fast-crud/fast-crud/commit/695621c561ba60cd3b5d761e46d0114e7982f83b))
* getNodesByValues传入参数必为数组格式，为破坏性变更，请全文搜索getNodesByValues，并修改成只接受数组格式。 ([d9583ef](https://github.com/fast-crud/fast-crud/commit/d9583eff6c394e96c65a5da1cd5d1ccc831cdac5))

### Features

* table-select支持 ([1c5b749](https://github.com/fast-crud/fast-crud/commit/1c5b7493a7782581a5f2a5bff843b135eb531f92))

### Performance Improvements

* 默认label宽度超出后省略+title提示 ([3953dee](https://github.com/fast-crud/fast-crud/commit/3953deeaf33e11ef2501ae99e54d15d62d2a5edb))
* 增加重置后清空排序设置演示 ([6a563ad](https://github.com/fast-crud/fast-crud/commit/6a563ad67b87f66e2765e47f72c5d4831cf06801))
* 增加form.formItem公共配置，可以统一配置表单下所有字段的一些配置 ([ad77c3c](https://github.com/fast-crud/fast-crud/commit/ad77c3cb9001ad4c1418d858aed9f118fcc185e8))
* 增加search.formItem公共配置，可以统一配置表单下所有字段的一些配置 ([af678c5](https://github.com/fast-crud/fast-crud/commit/af678c531f4ce1343fadd9b9217fe0197d196cb5))
* 重置后清空排序 ([8e7d958](https://github.com/fast-crud/fast-crud/commit/8e7d958e0cc33d6c1aa5e7f8a91964010c13865b))
* table-select支持跨页选择 ([ab89508](https://github.com/fast-crud/fast-crud/commit/ab8950857dccaf294f1ea2548d605a96d03d85fc))

## [1.16.11](https://github.com/fast-crud/fast-crud/compare/v1.16.10...v1.16.11) (2023-09-03)

**Note:** Version bump only for package @fast-crud/fast-crud

## [1.16.10](https://github.com/fast-crud/fast-crud/compare/v1.16.9...v1.16.10) (2023-09-03)

**Note:** Version bump only for package @fast-crud/fast-crud

## [1.16.9](https://github.com/fast-crud/fast-crud/compare/v1.16.8...v1.16.9) (2023-09-03)

### Bug Fixes

* 修复 useFs返回值里面没有context的bug ([b88fea7](https://github.com/fast-crud/fast-crud/commit/b88fea7b963c9d51565745447e47f7425b1f6363))

### Performance Improvements

* 表单下所有组件优化为宽度100% ([da38460](https://github.com/fast-crud/fast-crud/commit/da384605f9c6bfc26359a369613dce4f48a3ba64))

## [1.16.8](https://github.com/fast-crud/fast-crud/compare/v1.16.7...v1.16.8) (2023-09-03)

### Bug Fixes

* 修复树形表格子节点没有执行valueBuilder的bug ([56755a5](https://github.com/fast-crud/fast-crud/commit/56755a511eadfa8d528bd12c57c7d6e7f8aa5807))

### Performance Improvements

* 表单labelWidth演示 ([72f5372](https://github.com/fast-crud/fast-crud/commit/72f5372948f9aefebb0aba8671c277e8d80566bd))
* 导出增加 onlyShow 和 columnFilter配置 ([f5579a1](https://github.com/fast-crud/fast-crud/commit/f5579a11e396fd0e30f08621be801fc33f6181d8))
* 翻页后自动滚动到顶部 ([a6e5f67](https://github.com/fast-crud/fast-crud/commit/a6e5f6740a59780995283c7d787864fdd65f0d4b))

## [1.16.7](https://github.com/fast-crud/fast-crud/compare/v1.16.6...v1.16.7) (2023-08-21)

### Bug Fixes

* 修复查询不会重置page信息的bug ([bb0bd5a](https://github.com/fast-crud/fast-crud/commit/bb0bd5af4d9289cdbe99dc7a420ef191ff8ac411))
* 修复element table 字段排序无效的bug ([9a9aba9](https://github.com/fast-crud/fast-crud/commit/9a9aba91b131a4024256fab61325b6bd703670f7))

## [1.16.6](https://github.com/fast-crud/fast-crud/compare/v1.16.5...v1.16.6) (2023-08-21)

**Note:** Version bump only for package @fast-crud/fast-crud

## [1.16.5](https://github.com/fast-crud/fast-crud/compare/v1.16.4...v1.16.5) (2023-08-20)

### Bug Fixes

* 修复initialForm会覆盖editForm的bug ([c1d0d8a](https://github.com/fast-crud/fast-crud/commit/c1d0d8a3bef2586386a59c9211de7ca45be83f08))

## [1.16.4](https://github.com/fast-crud/fast-crud/compare/v1.16.3...v1.16.4) (2023-08-18)

**Note:** Version bump only for package @fast-crud/fast-crud

## [1.16.3](https://github.com/fast-crud/fast-crud/compare/v1.16.2...v1.16.3) (2023-08-18)

### Bug Fixes

* 修复服务端导出会继续执行本地导出的bug ([0a2df13](https://github.com/fast-crud/fast-crud/commit/0a2df13c592ad5c44280c3dae62e343923c9aa0b))
* 修复v-model模式删除无效的bug ([d177cba](https://github.com/fast-crud/fast-crud/commit/d177cbac0ef8a73aec36cf0cace84a957f5e44cd))
* **i18n:** 修复无法覆盖默认国际化配置的bug ([97f5870](https://github.com/fast-crud/fast-crud/commit/97f5870f4d5a186ac15023d8a490e91c84f7edc0))

### Performance Improvements

* 增加查看表单使用单元格组件示例 ([aeb4868](https://github.com/fast-crud/fast-crud/commit/aeb48685d4791b1e6f95e186a7eb094efc067b4b))
* columnsFilterContext增加submit和reset ([fb8b030](https://github.com/fast-crud/fast-crud/commit/fb8b03019360a3bc08006618f86ff7e3d251531d))
* columnsFilterContext增加submit和reset ([b65b62d](https://github.com/fast-crud/fast-crud/commit/b65b62de363335c3f311a6e094c74929d280da45))
* fs-button增加buttonProps参数，当fs-button的属性与x-button属性名重复时使用 ([5ca5333](https://github.com/fast-crud/fast-crud/commit/5ca53330f8bcf8d7acf4eb921aa92b83c41de52a))

## [1.16.2](https://github.com/fast-crud/fast-crud/compare/v1.16.1...v1.16.2) (2023-08-10)

**Note:** Version bump only for package @fast-crud/fast-crud

## [1.16.1](https://github.com/fast-crud/fast-crud/compare/v1.16.0...v1.16.1) (2023-08-09)

### Bug Fixes

* 修复第一次自动触发查询不带参数的bug ([484277f](https://github.com/fast-crud/fast-crud/commit/484277f81581756d3873758f2919cd174dcfd052))

### Performance Improvements

* text字段类型默认需要回车才能触发查询 ([394848e](https://github.com/fast-crud/fast-crud/commit/394848ee5dcafdee12970e922f9b576a8b1f4392))

# [1.16.0](https://github.com/fast-crud/fast-crud/compare/v1.15.1...v1.16.0) (2023-08-07)

### Features

* 列设置支持自定义样式 ([df86e04](https://github.com/fast-crud/fast-crud/commit/df86e04dcbc615f254e15abbe10758b934d69492))
* 列设置支持自定义样式 ([f4ca5c1](https://github.com/fast-crud/fast-crud/commit/f4ca5c1eb26700b719ddc84ec55d2149747986be))

## [1.15.1](https://github.com/fast-crud/fast-crud/compare/v1.15.0...v1.15.1) (2023-08-05)

**Note:** Version bump only for package @fast-crud/fast-crud

# [1.15.0](https://github.com/fast-crud/fast-crud/compare/v1.14.7...v1.15.0) (2023-08-05)

### Bug Fixes

* 修复升级xlxs之后加载XLXS错误 ([32b76fd](https://github.com/fast-crud/fast-crud/commit/32b76fd60c935d49d7d380d6a4571894b0cad54c))

### Features

* 重构search，支持search.validatedForm直接修改查询表单数据，修复tab变化后清空查询表单的bug ([8678f2f](https://github.com/fast-crud/fast-crud/commit/8678f2f4763f2c8b1ff6b0f6b8b9a7ee401a78ce))
* antdv4 支持 ([1935614](https://github.com/fast-crud/fast-crud/commit/19356142cda925d1248fe7c84c18cb8324ce5f70))

### Performance Improvements

* 升级依赖版本 ([1007384](https://github.com/fast-crud/fast-crud/commit/1007384e5e45f504b2106554c5411a3c50745ec6))
* **icon:** 找不到icon时，避免报错，显示error ([614c144](https://github.com/fast-crud/fast-crud/commit/614c1447440ad93bfb9790940d168da493471518))

## [1.14.7](https://github.com/fast-crud/fast-crud/compare/v1.14.6...v1.14.7) (2023-07-24)

### Bug Fixes

* 修复row会导致editForm不显示字段的bug ([0c337ef](https://github.com/fast-crud/fast-crud/commit/0c337efb656b804b02a73af72955978f76ee5691))

## [1.14.6](https://github.com/fast-crud/fast-crud/compare/v1.14.5...v1.14.6) (2023-07-23)

### Bug Fixes

* 修复element 版 search select组件右边超出显示的问题 ([ff11cf4](https://github.com/fast-crud/fast-crud/commit/ff11cf4f9c6ac63d997b5cad2067123c01cd299b))

## [1.14.5](https://github.com/fast-crud/fast-crud/compare/v1.14.4...v1.14.5) (2023-07-04)

### Bug Fixes

* 修复search.value第一次查询无效的bug ([d9a907a](https://github.com/fast-crud/fast-crud/commit/d9a907a477bae66662a8a8720a24ab3506772d30))
* 修复toolbar search按钮高亮问题 ([a677d97](https://github.com/fast-crud/fast-crud/commit/a677d97a800308c47a14a5e22a4c23df53464417))

### Performance Improvements

* 优化export,支持查询导出 ([181828e](https://github.com/fast-crud/fast-crud/commit/181828e65159f2643c40957f24157701017f1013))

## [1.14.4](https://github.com/fast-crud/fast-crud/compare/v1.14.3...v1.14.4) (2023-07-02)

**Note:** Version bump only for package @fast-crud/fast-crud

## [1.14.3](https://github.com/fast-crud/fast-crud/compare/v1.14.2...v1.14.3) (2023-07-02)

### Bug Fixes

* export lib ([b93f554](https://github.com/fast-crud/fast-crud/commit/b93f554e1586cb923ea0795fa11dd317d1118b45))

## [1.14.2](https://github.com/fast-crud/fast-crud/compare/v1.14.1...v1.14.2) (2023-07-02)

### Bug Fixes

* 修复多选导出csv，导致表格错位的bug ([4e0bf5b](https://github.com/fast-crud/fast-crud/commit/4e0bf5bae3bd39fd1654c5cf10991039eacf1acc))
* 修复某些情况下fs-icon spin失效的bug ([2499a33](https://github.com/fast-crud/fast-crud/commit/2499a338def7436356c91a9b547e570c4204286d))
* 修复行编辑模式下，render、conditionalRender无效的bug ([403fedc](https://github.com/fast-crud/fast-crud/commit/403fedc6e22817e33a1f4ac316a016e570127aa8))
* search 意外执行valueResolve的bug ([b2ba83d](https://github.com/fast-crud/fast-crud/commit/b2ba83d7d93e9dc5b5684eca03a90a3991afeae0))

### Performance Improvements

* 导出支持dict ([dbb60bf](https://github.com/fast-crud/fast-crud/commit/dbb60bf10efb11d7ec10aa9687a19d92dd9891e1))
* 导出重构 ([e99dc7b](https://github.com/fast-crud/fast-crud/commit/e99dc7bb6b24d4456fc524a04e8787e16b07511e))
* 导入支持 ([5d81372](https://github.com/fast-crud/fast-crud/commit/5d8137297e38976b472094c8cb41f9bcf318f3b5))
* currentPage 为空时报警告 ([fa25d08](https://github.com/fast-crud/fast-crud/commit/fa25d08d08f58ef86d75721e149216ec9a5faf03))
* export 功能 ([7a06d06](https://github.com/fast-crud/fast-crud/commit/7a06d06786c14f1d16bf7b6fc02f461972ceeabc))
* export 功能 ([2accdba](https://github.com/fast-crud/fast-crud/commit/2accdba5d087c01a87c6fd20b98c6510d0038f9d))
* naiveui 自定义组件支持change validation ([9e8b75d](https://github.com/fast-crud/fast-crud/commit/9e8b75d3a0d640f86d66f9b78ac5ec57f687c339))
* v-model editable-row示例 ([0304d51](https://github.com/fast-crud/fast-crud/commit/0304d517bb6552b23e33427c217910288a296218))

## [1.14.1](https://github.com/fast-crud/fast-crud/compare/v1.14.0...v1.14.1) (2023-06-16)

### Bug Fixes

* 修复 search initalForm初始化失效的bug ([0da1be9](https://github.com/fast-crud/fast-crud/commit/0da1be92f58c8e30e250c941806f3ed2c4c9561e))

# [1.14.0](https://github.com/fast-crud/fast-crud/compare/v1.13.12...v1.14.0) (2023-06-09)

### Features

* crudBinding.value.table.columns由array改成map ([8f89d2b](https://github.com/fast-crud/fast-crud/commit/8f89d2b26e12be0b3bcec2da8b4d7a2942395e8e))

## [1.13.12](https://github.com/fast-crud/fast-crud/compare/v1.13.11...v1.13.12) (2023-06-08)

**Note:** Version bump only for package @fast-crud/fast-crud

## [1.13.11](https://github.com/fast-crud/fast-crud/compare/v1.13.10...v1.13.11) (2023-06-08)

### Bug Fixes

* **search:** 修复多了一个search-middle插槽的问题 ([11809c8](https://github.com/fast-crud/fast-crud/commit/11809c8d15dbe1dc30b4c820f0c622b30dd260a9))
* **sort:** 修复取消sort不触发刷新的bug ([de43d7e](https://github.com/fast-crud/fast-crud/commit/de43d7eeb0f2af5ad81188bc164099da23670a13))

### Performance Improvements

* 支持settings.searchCopyFormProps配置，可以配置哪些属性从form复制 ([b80f748](https://github.com/fast-crud/fast-crud/commit/b80f7487eb74acfa763aa4216140666ece1a485d))
* crudBinding.value.sort转移到crudBinding.value.table.sort ([0dad531](https://github.com/fast-crud/fast-crud/commit/0dad531273b2719c1a9d1bea4100c5c59405d899))
* search校验失败后，refresh保持原来的formData ([632a0df](https://github.com/fast-crud/fast-crud/commit/632a0df66d1917d0a402e29d7e57417b2939b16d))
* **search:** validation支持 ([72b8164](https://github.com/fast-crud/fast-crud/commit/72b81640047904acb7a40048ad6dd036840633c5))

## [1.13.10](https://github.com/fast-crud/fast-crud/compare/v1.13.9...v1.13.10) (2023-05-31)

### Bug Fixes

* 修复search-middle插槽错位问题 ([6423c14](https://github.com/fast-crud/fast-crud/commit/6423c14b037c18f1aea87b975b8f323db2151fb3))

## [1.13.9](https://github.com/fast-crud/fast-crud/compare/v1.13.8...v1.13.9) (2023-05-31)

### Bug Fixes

* 恢复search插槽 ([12580ef](https://github.com/fast-crud/fast-crud/commit/12580ef18d30b69c6a995d6c16b03bfc44c411f1))

## [1.13.8](https://github.com/fast-crud/fast-crud/compare/v1.13.7...v1.13.8) (2023-05-22)

### Performance Improvements

* **form:** 支持conditionalRender ([270fd52](https://github.com/fast-crud/fast-crud/commit/270fd52e7ffeab605aa89f44dc1b1e8f132ce393))

## [1.13.7](https://github.com/fast-crud/fast-crud/compare/v1.13.6...v1.13.7) (2023-05-19)

### Bug Fixes

* 修复rowhandle 排列不整齐的问题 ([ff644b1](https://github.com/fast-crud/fast-crud/commit/ff644b11b91c58295692fc0874dc4a3d743eb6df))
* 修复useFormWrapper 报inject错误的bug ([fbaf8b8](https://github.com/fast-crud/fast-crud/commit/fbaf8b8e3f745cb00df40e270928bd8152a61e66))

## [1.13.6](https://github.com/fast-crud/fast-crud/compare/v1.13.5...v1.13.6) (2023-05-13)

**Note:** Version bump only for package @fast-crud/fast-crud

## [1.13.5](https://github.com/fast-crud/fast-crud/compare/v1.13.4...v1.13.5) (2023-05-13)

### Bug Fixes

* 修复本地字典切换列显隐时无法显示label的bug ([35327c8](https://github.com/fast-crud/fast-crud/commit/35327c8ed7bbffb1e51681e05732e0e9b46dfb04))

* 修复useFormWrapper丢失主题的bug ([35bbf94](https://github.com/fast-crud/fast-crud/commit/35bbf944d90caf14da6f776e93d97db686d77459))

### Performance Improvements

* 每个分组支持统一col配置 ([9ed3465](https://github.com/fast-crud/fast-crud/commit/9ed34658a1d56f544b046ecc500172335cdccf53))

* 优化对话框全屏按钮居中 ([8f83857](https://github.com/fast-crud/fast-crud/commit/8f83857b65770a6e58641dc52b7c65abcf202dcc))

## [1.13.4](https://github.com/fast-crud/fast-crud/compare/v1.13.3...v1.13.4) (2023-05-06)

### Bug Fixes

* 修复全屏模式错位问题 ([748838a](https://github.com/fast-crud/fast-crud/commit/748838ae85e722a4fe4cb30888420ec22c8ced2c))

### Performance Improvements

* 查询多行模式，行展开按钮支持显隐配置 ([a788977](https://github.com/fast-crud/fast-crud/commit/a788977b713454e0fe1fc10467afd7b9a65f5f41))

* 服务端过滤示例 ([006bfb2](https://github.com/fast-crud/fast-crud/commit/006bfb23f594eec683e09bb7c9631dd80fa87c83))

## [1.13.3](https://github.com/fast-crud/fast-crud/compare/v1.13.2...v1.13.3) (2023-05-04)

### Performance Improvements

* vModel支持trim、number ([e8ffb64](https://github.com/fast-crud/fast-crud/commit/e8ffb645cb14ffde0e51428d67ccdc731cbc4b6b))

## [1.13.2](https://github.com/fast-crud/fast-crud/compare/v1.13.1...v1.13.2) (2023-04-20)

### Bug Fixes

* 修复查询框多行模式下，select超出宽度的bug ([1861fc7](https://github.com/fast-crud/fast-crud/commit/1861fc782f0e81b77f1f4e4bee398185d43108da))

* 修复search.container的定义错误 ([45699c0](https://github.com/fast-crud/fast-crud/commit/45699c04a27d912b80c3bcdcb251a47b8234921d))

* dict ts缺少cloneable参数 ([ab9528d](https://github.com/fast-crud/fast-crud/commit/ab9528d7ae2ab782cccc89d7530a22faa981ee74))

### Performance Improvements

* 多行search 收起展开文字优化 ([b932f96](https://github.com/fast-crud/fast-crud/commit/b932f963128d630be413f6b5cc0466b8a1c471ae))

* 优化fs-images-format 加载失败时的显示 ([7df6eab](https://github.com/fast-crud/fast-crud/commit/7df6eab4d653409de442eeef933177906a2ffc70))

## [1.13.1](https://github.com/fast-crud/fast-crud/compare/v1.13.0...v1.13.1) (2023-04-10)

### Bug Fixes

* 修复getComponentRef获取错误的bug ([67ee58e](https://github.com/fast-crud/fast-crud/commit/67ee58e7a3b7ac5a8f28ee79cff835e5d8534bd7))

# [1.13.0](https://github.com/fast-crud/fast-crud/compare/v1.12.2...v1.13.0) (2023-04-07)

### Features

* FsComponentRender组件重构 ([fb6d77d](https://github.com/fast-crud/fast-crud/commit/fb6d77dd0113d57a7c69acc878a955b618b52342))

## [1.12.2](https://github.com/fast-crud/fast-crud/compare/v1.12.1...v1.12.2) (2023-04-06)

### Bug Fixes

* 修复layoutcard样式问题 ([02aca45](https://github.com/fast-crud/fast-crud/commit/02aca45932a90fba39d53ecd12c09aa423187065))

### Performance Improvements

* 新增table.conditionalRender配置,条件渲染 ([0273b91](https://github.com/fast-crud/fast-crud/commit/0273b9152dcf7dbb5d90b82619e6ef8b1191e5cc))

## [1.12.1](https://github.com/fast-crud/fast-crud/compare/v1.12.0...v1.12.1) (2023-04-04)

### Reverts

* Revert "refactor: 删除多余的umd配置" ([008a833](https://github.com/fast-crud/fast-crud/commit/008a8333c4b761cfcab8a2531614faafc10cb18c))

# [1.12.0](https://github.com/fast-crud/fast-crud/compare/v1.11.10...v1.12.0) (2023-03-31)

### Features

* **search:** search支持自定义布局 ([94c10cf](https://github.com/fast-crud/fast-crud/commit/94c10cfaee338798c0373d066bb98da9ca085d29))

### Performance Improvements

* 优化多行查询示例 ([95fa427](https://github.com/fast-crud/fast-crud/commit/95fa427043b29ef9590ce75fe91df9d5d686b196))

## [1.11.10](https://github.com/fast-crud/fast-crud/compare/v1.11.9...v1.11.10) (2023-03-29)

### Bug Fixes

* 修复列设置显隐和禁用无效的bug ([ab28857](https://github.com/fast-crud/fast-crud/commit/ab288574818709e0313f063614b46f46b96de0a3))

## [1.11.9](https://github.com/fast-crud/fast-crud/compare/v1.11.8...v1.11.9) (2023-03-28)

### Bug Fixes

* 修复某些情况下 column original 为空无法读取__show的bug ([c640c76](https://github.com/fast-crud/fast-crud/commit/c640c7600f81da0435cbb452e92f3d3cd7145b64))

* 修复form表单配置ref无效的bug ([97e8904](https://github.com/fast-crud/fast-crud/commit/97e8904bbffd4ec143c7430cd93568c277b5f1f3))

* 修复form表单render scope.form修改值不生效的bug ([47694c3](https://github.com/fast-crud/fast-crud/commit/47694c3f9e7218aef186ba72a93fe0030e385c5d))

## [1.11.8](https://github.com/fast-crud/fast-crud/compare/v1.11.7...v1.11.8) (2023-03-24)

### Bug Fixes

* 修复列设置非fixed字段越过fixed字段错乱的bug ([d944fb2](https://github.com/fast-crud/fast-crud/commit/d944fb228911d8d2afa24118bc2dd4ee13bb0026))

* 修复element 本地排序无效的bug ([bc64205](https://github.com/fast-crud/fast-crud/commit/bc64205d78d8a8316a666dbcf5431ee5545b797c))

### Performance Improvements

* 优化翻页性能 ([d0a1db7](https://github.com/fast-crud/fast-crud/commit/d0a1db7bda08b49226739bba38e28b38c60c2b65))

* 优化dict性能 ([39a5f1d](https://github.com/fast-crud/fast-crud/commit/39a5f1ddb1576e1eba5a160ab957212699907fb1))

## [1.11.7](https://github.com/fast-crud/fast-crud/compare/v1.11.6...v1.11.7) (2023-03-22)

**Note:** Version bump only for package @fast-crud/fast-crud

## [1.11.6](https://github.com/fast-crud/fast-crud/compare/v1.11.5...v1.11.6) (2023-03-22)

**Note:** Version bump only for package @fast-crud/fast-crud

## [1.11.5](https://github.com/fast-crud/fast-crud/compare/v1.11.4...v1.11.5) (2023-03-22)

**Note:** Version bump only for package @fast-crud/fast-crud

## [1.11.4](https://github.com/fast-crud/fast-crud/compare/v1.11.3...v1.11.4) (2023-03-22)

### Bug Fixes

* 多级表头列设置不显示bug ([f66afaf](https://github.com/fast-crud/fast-crud/commit/f66afaf55e3a8d86136484dd819622199bafc2c0))

* 修复 buttons丢失class配置的问题 ([40a885d](https://github.com/fast-crud/fast-crud/commit/40a885d632ecd88e9c3a0ab9b06119f7af2e952b))

* tabs，修复连续触发两次查询的bug ([52eab90](https://github.com/fast-crud/fast-crud/commit/52eab90ab01680c3b7a62289196b1674b53c30b0))

### Performance Improvements

* doRefresh增加参数 ([a585604](https://github.com/fast-crud/fast-crud/commit/a5856045380f4a3fe2e657fd2ace1aea3473c6d7))

## [1.11.3](https://github.com/fast-crud/fast-crud/compare/v1.11.2...v1.11.3) (2023-03-21)

**Note:** Version bump only for package @fast-crud/fast-crud

## [1.11.2](https://github.com/fast-crud/fast-crud/compare/v1.11.1...v1.11.2) (2023-03-21)

### Performance Improvements

* ui 支持render ([18b97a3](https://github.com/fast-crud/fast-crud/commit/18b97a3e67ee9410be5eb8ef7e757125a9160852))

* ui package移除对fast-crud的依赖 ([7a7b51f](https://github.com/fast-crud/fast-crud/commit/7a7b51fd9594b29a31e844b0fd2d31396e96a613))

## [1.11.1](https://github.com/fast-crud/fast-crud/compare/v1.11.0...v1.11.1) (2023-03-17)

### Performance Improvements

* useFs优化，增加context:UseFsContext ([c3d3080](https://github.com/fast-crud/fast-crud/commit/c3d3080300e05616ee37c581a8635f8679e0aa7a))

* useFs支持crudExposeRef ([c56e840](https://github.com/fast-crud/fast-crud/commit/c56e840bb909f4b33548701141168e97789ff367))

# [1.11.0](https://github.com/fast-crud/fast-crud/compare/v1.10.0...v1.11.0) (2023-03-16)

### Features

* 全面TS化 ([95200f0](https://github.com/fast-crud/fast-crud/commit/95200f0bf91fbcefe5e41c7863916fe8d8a24336))

### Performance Improvements

* 全面ts化 ([168d3a2](https://github.com/fast-crud/fast-crud/commit/168d3a240eb67548195c31a5fa4cb5aedb8a410c))

* DynamicallyCrudOptions 动态CrudOptions ([a739d59](https://github.com/fast-crud/fast-crud/commit/a739d595201be4228452b969eb5278c436551f00))

* ts定义优化 ([37bbca9](https://github.com/fast-crud/fast-crud/commit/37bbca9ffe10948f97588d0327e80bf77574879e))

# [1.10.0](https://github.com/fast-crud/fast-crud/compare/v1.9.2...v1.10.0) (2023-03-11)

### Bug Fixes

* 行编辑支持多级表头 ([a547c99](https://github.com/fast-crud/fast-crud/commit/a547c99250f2d00b9d91c326364ccb81415c2772))

* 修复误删draggable的import，导致列设置字段无法显示的bug ([f36c506](https://github.com/fast-crud/fast-crud/commit/f36c506373a38ec3681f9c0ca8ed248a19c4db0b))

* **values-format:** 修复defaultLabel无效的bug ([bb55591](https://github.com/fast-crud/fast-crud/commit/bb55591be7602810ced518d7d06b224771d0d243))

### Features

* fs-form-wrapper支持多实例 ([023cc1d](https://github.com/fast-crud/fast-crud/commit/023cc1d425d5b1fa618a3d13fe5c88c81671524d))

* resetCrudOptions 示例 ([67a6c63](https://github.com/fast-crud/fast-crud/commit/67a6c63dd6cd4c73bae0c65da1a30d4fe54726d5))

* tabs快捷查询组件 ([db88968](https://github.com/fast-crud/fast-crud/commit/db88968fc2b428e839c85c317483513719a6099c))

### Performance Improvements

* 表单下方按钮支持context ([583017f](https://github.com/fast-crud/fast-crud/commit/583017f0080dc9a244883c6fe89ce4068496f041))

* 日期增加week、month、year、quarter类型 ([6073b00](https://github.com/fast-crud/fast-crud/commit/6073b006f740072f5fa3e9ad54c109819963ec93))

* 完善文档，完善部分types ([8fff02d](https://github.com/fast-crud/fast-crud/commit/8fff02d758530bbb1212d7475dc94bc8b562ef97))

* 优化d.ts类型 ([7a51aac](https://github.com/fast-crud/fast-crud/commit/7a51aace532ed6692f28a53332a2103a74f5827a))

* 优化dict ([f2f9d6e](https://github.com/fast-crud/fast-crud/commit/f2f9d6e8f9061a30f88e5d0591de19c65273d912))

* 增加s3示例 ([9060b03](https://github.com/fast-crud/fast-crud/commit/9060b036ce9e36ef8f2ddc50b1362682c7d3aa7f))

* antdv 增加自定义表头示例 ([d5cc254](https://github.com/fast-crud/fast-crud/commit/d5cc254f003983afcf48403604782fde4eb2dfb2))

* upload sdk换成aws-s3 ([6814083](https://github.com/fast-crud/fast-crud/commit/681408321be32ce42245a4aa34e491694a7e3d0e))

## [1.9.2](https://github.com/fast-crud/fast-crud/compare/v1.9.1...v1.9.2) (2023-03-01)

### Bug Fixes

* dict没有的值，默认显示value ([268ea48](https://github.com/fast-crud/fast-crud/commit/268ea481995ddb1b45fc2a8851f6ac0ff7fe0acd))

## [1.9.1](https://github.com/fast-crud/fast-crud/compare/v1.9.0...v1.9.1) (2023-03-01)

### Performance Improvements

* getFormRef 增加需要打开对话框的警告提示 ([671f440](https://github.com/fast-crud/fast-crud/commit/671f4400d17ff17ec206ea717447df7e21347b39))

# [1.9.0](https://github.com/fast-crud/fast-crud/compare/v1.8.5...v1.9.0) (2023-02-09)

### Bug Fixes

* 列设置 n-drawer 丢失title的问题 ([dfcd31f](https://github.com/fast-crud/fast-crud/commit/dfcd31ff2872ce1ef47c40facd4b88796e434bd9))

* 修复 button 配置tooltip之后触发两次点击的bug ([f355031](https://github.com/fast-crud/fast-crud/commit/f3550311719c7ec3a4ea68aaf66f7fd1949663e4))

### Features

* noImplicitAny: true ([47c444b](https://github.com/fast-crud/fast-crud/commit/47c444b026cbd57a8edf53f50ce16e9074d87971))

### Performance Improvements

* dict 获取data格式错误时，添加警告 ([9092d1f](https://github.com/fast-crud/fast-crud/commit/9092d1f4f78691609e3bdcaf2022a931d71d4959))

## [1.8.5](https://github.com/fast-crud/fast-crud/compare/v1.8.4...v1.8.5) (2023-01-30)

**Note:** Version bump only for package @fast-crud/fast-crud

## [1.8.4](https://github.com/fast-crud/fast-crud/compare/v1.8.3...v1.8.4) (2023-01-19)

### Bug Fixes

* 表单label支持render ([1c039d6](https://github.com/fast-crud/fast-crud/commit/1c039d66ebefc357e823b5d37788df758ab01057))

* 修复表单第一次弹出生硬的问题 ([d8bf83d](https://github.com/fast-crud/fast-crud/commit/d8bf83d398450b547e5644706c94d24c99aa1634))

### Performance Improvements

* columnMergePlugin使用示例 ([8b626ce](https://github.com/fast-crud/fast-crud/commit/8b626ce76824b783fbed78cf1408d1e7d9be3e60))

* viewForm 支持使用cell组件显示， viewFormUseCellComponent ([82addf3](https://github.com/fast-crud/fast-crud/commit/82addf3262f5c4b5e6a91a3305ebe8de1e1572a5))

## [1.8.3](https://github.com/fast-crud/fast-crud/compare/v1.8.2...v1.8.3) (2023-01-11)

### Bug Fixes

* 修复search 重置失败的bug ([7aeeb10](https://github.com/fast-crud/fast-crud/commit/7aeeb10b5491604643477861bcef8df3b176fce7))

* 移除form.resetWrap 接口方法 ([f3fa08f](https://github.com/fast-crud/fast-crud/commit/f3fa08f24f4bcfdd6b433961cf8964b7b46884af))

## [1.8.2](https://github.com/fast-crud/fast-crud/compare/v1.8.1...v1.8.2) (2023-01-11)

### Bug Fixes

* 给search、pagination等默认值，避免空指针异常 ([b35067a](https://github.com/fast-crud/fast-crud/commit/b35067a6e17cd8f1bc343de82773e7a30a03baab))

* 列设置title显示错误的bug ([1d3b486](https://github.com/fast-crud/fast-crud/commit/1d3b486b2f25030d5898b5ec13f065cf71a88c57))

## [1.8.1](https://github.com/fast-crud/fast-crud/compare/v1.8.0...v1.8.1) (2023-01-03)

### Bug Fixes

* 修复查询框多行模式折叠配置无效的bug ([7a42cd0](https://github.com/fast-crud/fast-crud/commit/7a42cd095b0fd602756d339c1bccd2f411d475ce))

* 移除buttonsPosition参数 ([ccada57](https://github.com/fast-crud/fast-crud/commit/ccada57c5491e91ffbc6b1d8435254fe03a85d68))

# [1.8.0](https://github.com/fast-crud/fast-crud/compare/v1.7.2...v1.8.0) (2022-12-22)

### Features

* 对话框支持拖拽 ([1f41d13](https://github.com/fast-crud/fast-crud/commit/1f41d134268848d60b967caf25aa4d5add286b18))

* 优化uploader扩展组件，buildUrl支持异步方法 ([a09f05d](https://github.com/fast-crud/fast-crud/commit/a09f05deed495675cb9a5cc36bc9ea530a44da08))

### Performance Improvements

* image-format 的buildUrl支持异步 ([58229a2](https://github.com/fast-crud/fast-crud/commit/58229a28a6c0480e5f100cb8c66a35d0aa93026c))

## [1.7.1](https://github.com/fast-crud/fast-crud/compare/v1.7.0...v1.7.1) (2022-12-14)

### Performance Improvements

* 调整ui-*、extends的d.ts编译目录 ([4749dac](https://github.com/fast-crud/fast-crud/commit/4749dac48979f654143e6e8e3f0edf936e80311c))

# [1.7.0](https://github.com/fast-crud/fast-crud/compare/v1.6.1...v1.7.0) (2022-12-14)

### Bug Fixes

* 调整doRefresh中pageRequest判空的的时机 ([d2c7c90](https://github.com/fast-crud/fast-crud/commit/d2c7c901fef01284b00d2a935d289ff0b317d7b1))

* 修复文件上传的一些bug ([52cbfff](https://github.com/fast-crud/fast-crud/commit/52cbfff33d85e9e2ae9dc71346e8ade8837a1221))

* 修复search无法自定义按钮的bug ([e265f9b](https://github.com/fast-crud/fast-crud/commit/e265f9b45753b64fd367667f7f8d3402fffcab13))

* 优化列设置，修复勾选问题 ([f93d0ff](https://github.com/fast-crud/fast-crud/commit/f93d0ffdc488e79b651f55ae664e8281b35992be))

### Features

* button支持tooltip ([b40ee32](https://github.com/fast-crud/fast-crud/commit/b40ee321cc2d667392d38eb2384eda6fd82411f5))

### Performance Improvements

* 菜单增加操作列 ([4b328ce](https://github.com/fast-crud/fast-crud/commit/4b328cede397990308d94e6f91ba88597a7ac552))

* 通过useFs来简化fs-crud的初始化过程 ([76b3c80](https://github.com/fast-crud/fast-crud/commit/76b3c807f6586cc895323860893d1e8bf8c62ad1))

* image-format支持预览原图 ([5b94c17](https://github.com/fast-crud/fast-crud/commit/5b94c17a4ba60d7721cce44bfcf162d65dea535d))

## [1.6.1](https://github.com/fast-crud/fast-crud/compare/v1.6.0...v1.6.1) (2022-11-20)

**Note:** Version bump only for package @fast-crud/fast-crud

# [1.6.0](https://github.com/fast-crud/fast-crud/compare/v1.5.4...v1.6.0) (2022-11-20)

### Bug Fixes

* 修复刷新后compute失效的bug ([a9f4e1d](https://github.com/fast-crud/fast-crud/commit/a9f4e1db64e290d00bd4fe182b4c0a012005d724))

* 修复local模式下调用pageRequest报错的bug ([8ed92bf](https://github.com/fast-crud/fast-crud/commit/8ed92bffc70da38d3fbb59bf2435770d3e09d5b7))

* helper换行 ([053c355](https://github.com/fast-crud/fast-crud/commit/053c3553a43d586d0b934d26e9b3189048a4ec19))

* search的valueChange支持object模式 ([133da11](https://github.com/fast-crud/fast-crud/commit/133da1130583417205c86e93bc03ce021ba82234))

### Features

* 支持配置表单字段不提交后台key.form.submit ([0b77875](https://github.com/fast-crud/fast-crud/commit/0b77875eed96d7894d40bdcbd59b05d43f5d7da8))

* 支持自定义布局，支持Card布局 ([879e212](https://github.com/fast-crud/fast-crud/commit/879e2125f3125433f3cd3ef7a50dddb2381a7450))

### Performance Improvements

* form 增加row配置 ([1305207](https://github.com/fast-crud/fast-crud/commit/130520755745e4fb4c60994104a43b4fb5879390))

## [1.5.4](https://github.com/fast-crud/fast-crud/compare/v1.5.3...v1.5.4) (2022-11-05)

### Bug Fixes

* 修复自动查询失效的bug ([9640150](https://github.com/fast-crud/fast-crud/commit/96401509ef447c2d14c65d65e2a5e5bd9f59cf83))

* dict 动态添加data选项，value-format无法动态监听变化的问题 ([5346d57](https://github.com/fast-crud/fast-crud/commit/5346d5737627702fc2e821db173a5dbdb65e226c))

### Performance Improvements

* tab分组表单校验失败后在tab签上显示错误 ([bc673fb](https://github.com/fast-crud/fast-crud/commit/bc673fbbe79ff3d851133dbab2118db3deeb00d8))

## [1.5.3](https://github.com/fast-crud/fast-crud/compare/v1.5.2...v1.5.3) (2022-11-03)

### Bug Fixes

* 修复值为0时表单不能赋值的bug ([50715aa](https://github.com/fast-crud/fast-crud/commit/50715aaa89091173ef1fb2c7342d799d27d9cf07))

## [1.5.2](https://github.com/fast-crud/fast-crud/compare/v1.5.1...v1.5.2) (2022-11-03)

### Bug Fixes

* 修复buttons click options报错的问题 ([5169ca9](https://github.com/fast-crud/fast-crud/commit/5169ca9dcd1b6ab084a22baee2719ccbf165a243))

* helper icon调整 ([1e011ae](https://github.com/fast-crud/fast-crud/commit/1e011ae54515631234c32b9dfdf931e8afd9127d))

### Performance Improvements

* 优化antdv的labelWidth设置，优化grid布局示例 ([3516af6](https://github.com/fast-crud/fast-crud/commit/3516af67315b9169d1379e924aafe59f88cff225))

* 优化grid布局示例 ([8998e60](https://github.com/fast-crud/fast-crud/commit/8998e60abcd2788e05402278d9975a9488b488a4))

* actionbar 支持order ([c950997](https://github.com/fast-crud/fast-crud/commit/c950997d285c44064f4b2606612fbb4d97a0d083))

## [1.5.1](https://github.com/fast-crud/fast-crud/compare/v1.5.0...v1.5.1) (2022-10-28)

### Bug Fixes

* 修复d.ts某些地方飘红的问题 ([17f5503](https://github.com/fast-crud/fast-crud/commit/17f55033eb2dec2e2404ebef9115858211b1c412))

# [1.5.0](https://github.com/fast-crud/fast-crud/compare/v1.4.2...v1.5.0) (2022-10-25)

### Bug Fixes

* 修复报错后影响其他页面加载的问题 ([589ecb9](https://github.com/fast-crud/fast-crud/commit/589ecb97b660121ba8d276e485dbb48e5c1b829c))

* 修复多级表头不显示列表内容的bug ([51f7234](https://github.com/fast-crud/fast-crud/commit/51f7234ab830f042670219423802e4affc625397))

* 修复setFormData错误 ([ad07021](https://github.com/fast-crud/fast-crud/commit/ad0702154e85e72fcdab90c3a0f2a78c3c5988fe))

### Features

* 支持深度数据 ([3ca871e](https://github.com/fast-crud/fast-crud/commit/3ca871e2c3a16e76cb1c526fdbf4b77a4c06b342))

* fs-page组件外层增加fs-page-container包裹，防止出现样式错乱 ([72766a5](https://github.com/fast-crud/fast-crud/commit/72766a5d7c7306f18f57a86d0f84439522648b0c))

### Performance Improvements

* 表单提交成功后，将返回值放到afterSubmit的context中 ([9023be0](https://github.com/fast-crud/fast-crud/commit/9023be01aec6aa3d5c87ef92443ad795e6d202ff))

* 优化value change ([91a6cc2](https://github.com/fast-crud/fast-crud/commit/91a6cc214e9a70910d41b229f7666f3f9dc71c68))

* 自定义删除示例 ([7d4413c](https://github.com/fast-crud/fast-crud/commit/7d4413cceb709767f715b300ff6b93ef000dee89))

* column showTitle ([53c9617](https://github.com/fast-crud/fast-crud/commit/53c9617b75b49b9fb6f5a5b2e6c0b821d21886c6))

* compute参数增加类型定义 ([494f349](https://github.com/fast-crud/fast-crud/commit/494f349b59c3cc4de9ef1a4308cd3936532f744e))

* fs-page恢复回absolute ([d38f5ad](https://github.com/fast-crud/fast-crud/commit/d38f5ade13761ffdef76cb44a8acc1ffa4c478d2))

## [1.4.2](https://github.com/fast-crud/fast-crud/compare/v1.4.1...v1.4.2) (2022-10-03)

**Note:** Version bump only for package @fast-crud/fast-crud

## [1.4.1](https://github.com/fast-crud/fast-crud/compare/v1.4.0...v1.4.1) (2022-10-03)

**Note:** Version bump only for package @fast-crud/fast-crud

# [1.4.0](https://github.com/fast-crud/fast-crud/compare/v1.3.0...v1.4.0) (2022-10-03)

### Bug Fixes

* 修复fs-container的body被内部元素撑大的bug ([ad24ef8](https://github.com/fast-crud/fast-crud/commit/ad24ef82a3bfbb30e5436222f70b253a126c7801))

### Features

* 升级依赖版本 ([876272e](https://github.com/fast-crud/fast-crud/commit/876272e3f7ac56a05913b2f97625f5e83995a250))

* 升级fs依赖版本 ([ace6c7d](https://github.com/fast-crud/fast-crud/commit/ace6c7d76350da618761c6bcef4ac34a13ff5548))

* 行编辑支持禁止某列编辑 ([35324b5](https://github.com/fast-crud/fast-crud/commit/35324b51559f95072daeb1f282c0944a5d2004d5))

# [1.3.0](https://github.com/fast-crud/fast-crud/compare/v1.2.10...v1.3.0) (2022-08-30)

### Features

* 增加onRefreshed事件 ([9cb0a12](https://github.com/fast-crud/fast-crud/commit/9cb0a1210a8a29d6f2125dab674c75e29e742cd6))

## [1.2.10](https://github.com/fast-crud/fast-crud/compare/v1.2.9...v1.2.10) (2022-08-25)

### Bug Fixes

* 修复group配置没有的字段报空指针异常的问题 ([438d0ad](https://github.com/fast-crud/fast-crud/commit/438d0ad741172b77884c712381952c06147c6e77))

* 修复group配置没有的字段报空指针异常的问题 ([96dcc2d](https://github.com/fast-crud/fast-crud/commit/96dcc2d1d2ccf00d7414602d18e2ae095bed5d8b))

### Performance Improvements

* **表单分组:** 当分组下所有的字段都配置了隐藏时，整个分组直接隐藏 ([76b20d3](https://github.com/fast-crud/fast-crud/commit/76b20d3a7e3233d4c483cd862e3a77b88c2546fc))

## [1.2.9](https://github.com/fast-crud/fast-crud/compare/v1.2.8...v1.2.9) (2022-08-08)

### Bug Fixes

* 修复rowHandle的更多按钮没有对齐的问题 ([f59bca1](https://github.com/fast-crud/fast-crud/commit/f59bca176eacd5aae6d544aa101e2e82f0324d8b))

### Performance Improvements

* 移除多余的log ([75c2881](https://github.com/fast-crud/fast-crud/commit/75c28810bd1cd7c0b2e567c4bfb7fc6ce1db445f))

## [1.2.8](https://github.com/fast-crud/fast-crud/compare/v1.2.7...v1.2.8) (2022-07-28)

### Bug Fixes

* 修复列设置后，单元格配置无效的bug ([9aae340](https://github.com/fast-crud/fast-crud/commit/9aae340c89ac3517104b4bf98b8c7517bb4db840))

## [1.2.7](https://github.com/fast-crud/fast-crud/compare/v1.2.6...v1.2.7) (2022-07-27)

### Bug Fixes

* 修复rowhandler 无法配置居中的问题 ([7811ffd](https://github.com/fast-crud/fast-crud/commit/7811ffd0c42e2cad9ba3992806885c0efac8d329))

## [1.2.6](https://github.com/fast-crud/fast-crud/compare/v1.2.5...v1.2.6) (2022-07-27)

**Note:** Version bump only for package @fast-crud/fast-crud

## [1.2.5](https://github.com/fast-crud/fast-crud/compare/v1.2.4...v1.2.5) (2022-07-27)

**Note:** Version bump only for package @fast-crud/fast-crud

## [1.2.4](https://github.com/fast-crud/fast-crud/compare/v1.2.3...v1.2.4) (2022-07-27)

### Bug Fixes

* 修复自定义type不支持valueResolve、valueBuilder的bug ([74294b2](https://github.com/fast-crud/fast-crud/commit/74294b262ec8cb597c60a3a0795c86e660dfa4ad))

### Performance Improvements

* dict组件增加dict-change事件 ([ab4416c](https://github.com/fast-crud/fast-crud/commit/ab4416ccbfba99fdb771bbfd3f36c5fa7d67727b))

* dict组件增加dict-change事件 ([4bf8cc4](https://github.com/fast-crud/fast-crud/commit/4bf8cc425d89a17e01c8150139b1c04f5443cd6e))

## [1.2.3](https://github.com/fast-crud/fast-crud/compare/v1.2.2...v1.2.3) (2022-07-05)

### Bug Fixes

* 修复配置esbuild.pure =['console.log'] 报...异常的问题 ([fad8a57](https://github.com/fast-crud/fast-crud/commit/fad8a577b5121e151bb9946e4ccde155e8f63e2e))

### Performance Improvements

* 新增表单字段空白占位配置：key.form.blank ([4b47258](https://github.com/fast-crud/fast-crud/commit/4b4725828bdb083a4b82ffa066aab3b7fa26fedc))

## [1.2.2](https://github.com/fast-crud/fast-crud/compare/v1.2.1...v1.2.2) (2022-06-11)

**Note:** Version bump only for package @fast-crud/fast-crud

## [1.2.1](https://github.com/fast-crud/fast-crud/compare/v1.2.0...v1.2.1) (2022-06-11)

**Note:** Version bump only for package @fast-crud/fast-crud

# [1.2.0](https://github.com/fast-crud/fast-crud/compare/v1.1.2...v1.2.0) (2022-05-24)

### Bug Fixes

* 给fs-form增加doReset参数 ([6e991d2](https://github.com/fast-crud/fast-crud/commit/6e991d272d9e33add023ed869d8e40bbfd9cf55b))

* 修复列设置无法打开的问题 ([db1bff0](https://github.com/fast-crud/fast-crud/commit/db1bff096975bf70a22530eb514153304e4018f0))

* 修复console.log被drop之后报错的问题 ([74305a2](https://github.com/fast-crud/fast-crud/commit/74305a2cdbe08bfc1cfb362088afe60a4b404149))

* 修复element弹出窗口close错位问题 ([d58a4da](https://github.com/fast-crud/fast-crud/commit/d58a4da8261f790b36e2a2c826b2490255b47c1e))

* 增加重置示例 ([ecbde2e](https://github.com/fast-crud/fast-crud/commit/ecbde2ec8d96104d5e25e046b0951ec35c298044))

* 增加buttonsPosition=[default,bottom]配置 ([734ef99](https://github.com/fast-crud/fast-crud/commit/734ef99bd441f575d184dee2d14950688b732793))

### Features

* CrudProps与CrudExpose完善 ([78c27ce](https://github.com/fast-crud/fast-crud/commit/78c27ce6fa9737bfe5139db4d817c1dbdf3de150))

## [1.1.2](https://github.com/fast-crud/fast-crud/compare/v1.1.1...v1.1.2) (2022-04-26)

**Note:** Version bump only for package @fast-crud/fast-crud

## [1.1.1](https://github.com/fast-crud/fast-crud/compare/v1.1.0...v1.1.1) (2022-04-23)

### Bug Fixes

* 紧急修复dayjs引入错误的问题 ([f371444](https://github.com/fast-crud/fast-crud/commit/f3714446e2652aeba4c09c217dec553aa35dfabc))

# [1.1.0](https://github.com/fast-crud/fast-crud/compare/v1.0.7...v1.1.0) (2022-04-22)

### Features

* antdv，element都升级到最新版，element支持tree-select ([644a217](https://github.com/fast-crud/fast-crud/commit/644a2172dd7d0c649f096ba074ec67aad70e0748))

## [1.0.7](https://github.com/fast-crud/fast-crud/compare/v1.0.6...v1.0.7) (2022-03-30)

### Bug Fixes

* 去除意外的滚动条 ([b8fa2c7](https://github.com/fast-crud/fast-crud/commit/b8fa2c75ae4839e02ebd48354f69ef4f6e26660a))

* 修复antdv 固定表头失效的问题 ([f2d0fa2](https://github.com/fast-crud/fast-crud/commit/f2d0fa2e53ed84b28bdd799a4c49915d67f2c402))

* 修复antdv 列配置错位问题 ([18d1e82](https://github.com/fast-crud/fast-crud/commit/18d1e8285d0c729a3f65df79fd4d4856e944ff2c))

## [1.0.6](https://github.com/fast-crud/fast-crud/compare/v1.0.5...v1.0.6) (2022-03-23)

### Bug Fixes

* 修复element button 图标错乱问题 ([347694f](https://github.com/fast-crud/fast-crud/commit/347694fa305dc645be908d4ad6b5358792f52cd8))

* 修复getSearchFormData无法获取默认值的问题 ([cd05002](https://github.com/fast-crud/fast-crud/commit/cd05002cbd204f822c1dae55a954009270450a1f))

* 修复naive button 图标错乱问题 ([be28c9c](https://github.com/fast-crud/fast-crud/commit/be28c9c948188a704c8e886b7c82f405037948c1))

* 优化第一次打开是iconfiy需要再次分析依赖的问题 ([1b941fb](https://github.com/fast-crud/fast-crud/commit/1b941fbd106fc2eb9283e0332f7516c5522f1c62))

## [1.0.5](https://github.com/fast-crud/fast-crud/compare/v1.0.4...v1.0.5) (2022-03-22)

### Bug Fixes

* 修复antdv图标错位问题 ([887c876](https://github.com/fast-crud/fast-crud/commit/887c8763a0242d24632d038bc9fe410bb89c9830))

* 修复button icon 报性能警告的问题 ([78240e9](https://github.com/fast-crud/fast-crud/commit/78240e99dd5b8e18fc3417c5390d7659047f2d02))

* 修复element错位 ([35e46ea](https://github.com/fast-crud/fast-crud/commit/35e46ea507b085b937e83ee290d447191c1a11af))

## [1.0.4](https://github.com/fast-crud/fast-crud/compare/v1.0.3...v1.0.4) (2022-03-14)

### Bug Fixes

* 去除无用代码 ([93d4b90](https://github.com/fast-crud/fast-crud/commit/93d4b9032d2af3d697088b194c92810c3a82570d))

* 修复antdv菜单和按钮图标错位的问题 ([0610534](https://github.com/fast-crud/fast-crud/commit/06105343a6bc284bed042342f499e4b796ac7db9))

## [1.0.3](https://github.com/fast-crud/fast-crud/compare/v1.0.2...v1.0.3) (2022-03-10)

### Bug Fixes

* 1.解决naive ui与列设置冲突的问题 ([3897b4f](https://github.com/fast-crud/fast-crud/commit/3897b4ff74f3f4c166565ef4dd42e881dfd2bd5c))

## [1.0.2](https://github.com/fast-crud/fast-crud/compare/v1.0.1...v1.0.2) (2022-03-09)

**Note:** Version bump only for package @fast-crud/fast-crud

## [1.0.1](https://github.com/fast-crud/fast-crud/compare/v1.0.0...v1.0.1) (2022-03-02)

**Note:** Version bump only for package @fast-crud/fast-crud

# [1.0.0-alpha.7](https://github.com/fast-crud/fast-crud/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2022-02-10)

### Features

* 本地编辑 ([ac80dbf](https://github.com/fast-crud/fast-crud/commit/ac80dbff3438fe3ef6a5503f631fb59419935ae8))

* 本地编辑示例 ([5a96c34](https://github.com/fast-crud/fast-crud/commit/5a96c34080efec61a4e9e55f477e292df4b206eb))

# [1.0.0-alpha.6](https://github.com/fast-crud/fast-crud/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2022-01-22)

### Features

* 增加列设置简化模式示例及文档 ([0633cc5](https://github.com/fast-crud/fast-crud/commit/0633cc5b9e5787c6631346d9979b112110536214))

* values-format支持iconify icon ([d1be55e](https://github.com/fast-crud/fast-crud/commit/d1be55e46eea715f8a36fdd9c6b1eb8f33daab35))

# [1.0.0-alpha.5](https://github.com/fast-crud/fast-crud/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2022-01-17)

### Bug Fixes

* 修复服务端排序无效的bug ([a693746](https://github.com/fast-crud/fast-crud/commit/a693746d809f941a429af9bc33eb9c85bcfbafe1))

* 修复rowHandle无法隐藏的bug ([f9786f7](https://github.com/fast-crud/fast-crud/commit/f9786f7c8489a3df8bf44ef34ff466acd83ca3fd))

# [1.0.0-alpha.4](https://github.com/fast-crud/fast-crud/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2022-01-10)

### Bug Fixes

* 修复valueBuilder失效的bug ([d413278](https://github.com/fast-crud/fast-crud/commit/d4132783280d8d69cdf4bb453a1f1abd3322d370))

# [1.0.0-alpha.3](https://github.com/fast-crud/fast-crud/compare/v1.0.0-alpha.3...v1.0.0-alpha.3) (2022-01-07)

### Bug Fixes

* 修复table不显示的问题 ([ffd4b1c](https://github.com/fast-crud/fast-crud/commit/ffd4b1c11a826661c2a0e7f50bb6a345d6afc965))

### Features

* 新增一些组件的文档生成 ([9892016](https://github.com/fast-crud/fast-crud/commit/9892016e11b9e3214c08d30aefbe6a692fe0b7ee))

* 页面内打开表单对话框 ([2f34260](https://github.com/fast-crud/fast-crud/commit/2f342609201fe4dc30de9458a58e65a8cf414e46))

* form 增加beforeSubmit，和afterSubmit配置 ([aadc77d](https://github.com/fast-crud/fast-crud/commit/aadc77d473c6275578e58347892ac0328cf9698e))

* search支持valueResolve ([6743580](https://github.com/fast-crud/fast-crud/commit/674358017310854d79e870beaa6a50041d55afc0))

# [1.0.0-alpha.3](https://github.com/fast-crud/fast-crud/compare/v1.0.0-alpha.1...v1.0.0-alpha.3) (2022-01-06)

### Bug Fixes

* 修复对话框全屏的问题 ([bcc5161](https://github.com/fast-crud/fast-crud/commit/bcc516164770ae83c9540d3aad40907ac7af7a10))

# [1.0.0-alpha.1](https://github.com/fast-crud/fast-crud/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2022-01-06)

### Performance Improvements

* naive-ui 改成本地mock ([710bfc7](https://github.com/fast-crud/fast-crud/commit/710bfc7d915b629000e0c23d65bafabee0553cfe))

## [0.22.1](https://github.com/fast-crud/fast-crud/compare/v0.22.0...v0.22.1) (2021-11-29)

### Bug Fixes

* setFormData支持valueBuilder ([95dcb5d](https://github.com/fast-crud/fast-crud/commit/95dcb5ddc6cf7dc712a668b3ad15e26b4e19f93f))

### Performance Improvements

* 升级依赖版本 ([48531ac](https://github.com/fast-crud/fast-crud/commit/48531ac4d989a83d6e94fa4b086755149afca108))

# [0.22.0](https://github.com/fast-crud/fast-crud/compare/v0.21.0...v0.22.0) (2021-11-09)

### Features

* 查询框展开，新页面打开表单 ([eebd6a3](https://github.com/fast-crud/fast-crud/commit/eebd6a3af256061e6075fa6b41c6893e1b767066))

* 升级element最新版，采用新版element-plus/icon ([bb7ea32](https://github.com/fast-crud/fast-crud/commit/bb7ea326f23020d930f70929e06b03f6d176bb9d))

### Performance Improvements

* search collaspe ([b459a04](https://github.com/fast-crud/fast-crud/commit/b459a04a9916586fcb7a17b4eec49149c98a7957))

# [0.21.0](https://github.com/fast-crud/fast-crud/compare/v0.20.1...v0.21.0) (2021-11-02)

### Bug Fixes

* 日期示例、checkbox radio 支持按钮样式、边框样式 ([b2905eb](https://github.com/fast-crud/fast-crud/commit/b2905eb6ba19537cd7e0ac71c59170b20eed18b9))

* 修复auto search不触发的bug ([9d929da](https://github.com/fast-crud/fast-crud/commit/9d929daec11a064af0133bde1994b823eabd7224))

### Features

* 查询框多行模式 ([f01a92e](https://github.com/fast-crud/fast-crud/commit/f01a92e7eb3362427b470f416f045f6102ccd591))

* rowHandle按钮根据dropdown的配置来判断是否折叠 ([242530a](https://github.com/fast-crud/fast-crud/commit/242530a55eac766cf231104397637c3cf7a08ded))

## [0.20.1](https://github.com/fast-crud/fast-crud/compare/v0.20.0...v0.20.1) (2021-10-25)

### Bug Fixes

* 修复autoSearch.value判断错误的bug ([481ecff](https://github.com/fast-crud/fast-crud/commit/481ecffb7607cff2bcc8b39068d084974acf1d8d))

# [0.20.0](https://github.com/fast-crud/fast-crud/compare/v0.18.1...v0.20.0) (2021-10-19)

### Features

* 统一字段排序，【破坏性变更】所有字段排序号默认都为1 ([e09b17f](https://github.com/fast-crud/fast-crud/commit/e09b17f535283dd24e1c0ff8a6e296e4b0a2faa3))

### Performance Improvements

* 优化排序 ([2577698](https://github.com/fast-crud/fast-crud/commit/25776987296129518d5c49a8dcbbc5ac798a9318))

# [0.19.0](https://github.com/fast-crud/fast-crud/compare/v0.18.1...v0.19.0) (2021-10-18)

### Features

* 统一字段排序，【破坏性变更】所有字段排序号默认都为1 ([e09b17f](https://github.com/fast-crud/fast-crud/commit/e09b17f535283dd24e1c0ff8a6e296e4b0a2faa3))

### Performance Improvements

* 优化排序 ([2577698](https://github.com/fast-crud/fast-crud/commit/25776987296129518d5c49a8dcbbc5ac798a9318))

## [0.18.1](https://github.com/fast-crud/fast-crud/compare/v0.18.0...v0.18.1) (2021-09-24)

### Performance Improvements

* 增加自定义布局示例 ([615ca18](https://github.com/fast-crud/fast-crud/commit/615ca180fd05fca41ebdfa5c0325c376e3f9d431))

# [0.18.0](https://github.com/fast-crud/fast-crud/compare/v0.17.6...v0.18.0) (2021-09-24)

### Features

* 升级vue到3.2.11 ([0fdd615](https://github.com/fast-crud/fast-crud/commit/0fdd61550fde70310dd17efec46cd91c4f65158b))

* dict-select支持select的插槽配置，支持页面内打开对话框，支持路由缓存 ([e5c0fc0](https://github.com/fast-crud/fast-crud/commit/e5c0fc008c473ed7dd2e75fb1348141184ca4979))

## [0.17.6](https://github.com/fast-crud/fast-crud/compare/v0.17.5...v0.17.6) (2021-09-07)

### Bug Fixes

* vue转移到devDependencies ([9af76bc](https://github.com/fast-crud/fast-crud/commit/9af76bc3b667a89026c9d2a3e31f103ffab9489f))

* 修复作为子组件时翻页组件错乱的bug，https://github.com/fast-crud/fast-crud/issues/17 ([48289be](https://github.com/fast-crud/fast-crud/commit/48289bec1df00a2d3d8a8fc0acac712b1d14ef41))

## [0.17.5](https://github.com/fast-crud/fast-crud/compare/v0.17.4...v0.17.5) (2021-08-28)

### Bug Fixes

* https://github.com/fast-crud/fast-crud/issues/19 ([7781000](https://github.com/fast-crud/fast-crud/commit/77810001678d08da5094926533a9e65e27aa4b9a))

* 修复文件上传数量限制错误的bug ([2db661c](https://github.com/fast-crud/fast-crud/commit/2db661c356dffd1cf6c5cca8d21246f1d60aabd7))

### Performance Improvements

* 列排序 ([7c0b019](https://github.com/fast-crud/fast-crud/commit/7c0b0198b240aa68523563ee8f39a172a2f79fcb))

## [0.17.4](https://github.com/fast-crud/fast-crud/compare/v0.17.3...v0.17.4) (2021-08-17)

### Bug Fixes

* form group 里面某个字段没有配置时提示readproperty show undefined的bug ([ccede90](https://github.com/fast-crud/fast-crud/commit/ccede903bb994621cede9028ba98d69a9055909f))

* 修复日期组件显示问题，修复上传组件校验报错的问题 ([1580c9b](https://github.com/fast-crud/fast-crud/commit/1580c9bb978a14bf152ce391feda578f768ace24))

## [0.17.3](https://github.com/fast-crud/fast-crud/compare/v0.17.2...v0.17.3) (2021-08-06)

### Bug Fixes

* 修复默认值的bug ([f8de8f6](https://github.com/fast-crud/fast-crud/commit/f8de8f601935580c8806a5d92eadf36d5b2fca55))

* 第一次获取异步组件为空的bug ([9eb7a05](https://github.com/fast-crud/fast-crud/commit/9eb7a05d9ed98be2f27e9df050a2cc6731dac987))

## [0.17.2](https://github.com/fast-crud/fast-crud/compare/v0.17.1...v0.17.2) (2021-08-05)

### Performance Improvements

* 优化cascader，fieldNames跟随dict配置走 ([c35029e](https://github.com/fast-crud/fast-crud/commit/c35029e0420c3570341a7bc9b300cb6f1681efb3))

## [0.17.1](https://github.com/fast-crud/fast-crud/compare/v0.17.0...v0.17.1) (2021-08-04)

### Bug Fixes

* https://github.com/fast-crud/fast-crud/issues/11 ([3e95b39](https://github.com/fast-crud/fast-crud/commit/3e95b394bb25fbba3813e71318d75438893e5989))

* 修复group无法显示表单slot的bug ([72fd641](https://github.com/fast-crud/fast-crud/commit/72fd641588814ca293bd43b14c7faf54282dd36f))

* 修复动态getData缓存的bug ([86cd495](https://github.com/fast-crud/fast-crud/commit/86cd495f003b6cd177bb403f7b6e619caee15604))

* 懒加载不反显的bug ([62dcc0e](https://github.com/fast-crud/fast-crud/commit/62dcc0e6fba78c8e8b8713033da7515509bb238e))

# [0.17.0](https://github.com/fast-crud/fast-crud/compare/v0.16.0...v0.17.0) (2021-07-16)

### Bug Fixes

* 修复form a-row的警告 ([1ec74b3](https://github.com/fast-crud/fast-crud/commit/1ec74b39a60a5cc90b5d4d3af85e081148d5aef8))

### Features

* 升级依赖版本 ([ded1213](https://github.com/fast-crud/fast-crud/commit/ded121378f878fd4960fb3722fa7bc42987ace91))

* form-helper ([dc749ae](https://github.com/fast-crud/fast-crud/commit/dc749ae82e6cdd0bedef27ebc5d21b9c452f36c7))

# [0.16.0](https://github.com/fast-crud/fast-crud/compare/v0.15.1...v0.16.0) (2021-07-14)

### Bug Fixes

* 修复行编辑对勾无效的bug，修复a-button的danger type警告 ([4d48447](https://github.com/fast-crud/fast-crud/commit/4d48447e6b1430663fdf5eca8c03aae531651b74))

### Features

* valueChange 支持 immediate ([f72f87e](https://github.com/fast-crud/fast-crud/commit/f72f87ed6c934b116f8d9b224408575017cc3174))

### Performance Improvements

* 添加select本地过滤示例 ([660dc5f](https://github.com/fast-crud/fast-crud/commit/660dc5fe0d290102c8df54c2b1a813ed13cd1d2d))

## [0.15.1](https://github.com/fast-crud/fast-crud/compare/v0.15.0...v0.15.1) (2021-07-09)

**Note:** Version bump only for package @fast-crud/fast-crud

# [0.15.0](https://github.com/fast-crud/fast-crud/compare/v0.14.0...v0.15.0) (2021-07-06)

### Bug Fixes

* 1 ([a0766a2](https://github.com/fast-crud/fast-crud/commit/a0766a282a52067c5c1b8d687481a84ccf0d3126))

* 修复全屏按钮不显示的bug ([c211564](https://github.com/fast-crud/fast-crud/commit/c21156498d77c5f4e5a6c315c602a2267f9eaa9f))

### Features

* util to ts ([7b79e04](https://github.com/fast-crud/fast-crud/commit/7b79e047c6a4cc4ab87b9135c5610d9dac27fc0c))

### Performance Improvements

* rowHandle动态显隐示例 ([0ad8205](https://github.com/fast-crud/fast-crud/commit/0ad8205ca494b38dcbbe13ccadfe65d4d00a59e0))

# [0.14.0](https://github.com/fast-crud/fast-crud/compare/v0.13.0...v0.14.0) (2021-07-05)

### Bug Fixes

* 修复antdv pagination current没有设置成功的bug ([d236e15](https://github.com/fast-crud/fast-crud/commit/d236e15304e73bc30ba6651677539734fa36fadb))

### Features

* fast-extends,包含uploader、editors ([1b1becc](https://github.com/fast-crud/fast-crud/commit/1b1beccb59727f698d458fa725182ddd6cd7daca))

* 增加edtior-quill ([73566e4](https://github.com/fast-crud/fast-crud/commit/73566e4492779008011d4bacbc3c1adcfcfef1ac))

### Performance Improvements

* fs-button引用fs-icon ([44b9120](https://github.com/fast-crud/fast-crud/commit/44b91201a3681e0921a0a42e5f1ca80ccb1f5542))

# [0.13.0](https://github.com/fast-crud/fast-crud/compare/v0.12.0...v0.13.0) (2021-07-04)

### Features

* icon支持iconify ([72caa05](https://github.com/fast-crud/fast-crud/commit/72caa05d0e14a16b59d98c6f50056674729b9fa1))

# [0.12.0](https://github.com/fast-crud/fast-crud/compare/v0.11.0...v0.12.0) (2021-07-03)

### Features

* 动态计算支持ref和compImpl ([757edde](https://github.com/fast-crud/fast-crud/commit/757edde12c60b1e3722b02318fa6a82822cbce1d))

### Performance Improvements

* select 远程搜索演示 ([6c8b2cf](https://github.com/fast-crud/fast-crud/commit/6c8b2cf91bae18c50c8953be067e3b85b1cb042e))

# [0.11.0](https://github.com/fast-crud/fast-crud/compare/v0.10.4...v0.11.0) (2021-07-02)

### Bug Fixes

* 头像与搜索框冲突的bug https://github.com/fast-crud/fast-crud/issues/2 ([a118b91](https://github.com/fast-crud/fast-crud/commit/a118b91f8327980fe22b7254e11a30fce138b867))

* https://github.com/fast-crud/fast-crud/issues/3 ([b617668](https://github.com/fast-crud/fast-crud/commit/b617668cf77d1d8ceab24a93c14821e75f085a97))

### Features

* radio 支持 button样式 ([60ee9c6](https://github.com/fast-crud/fast-crud/commit/60ee9c6103ba6e64e270deb0e94937e2a70552bb))

### Performance Improvements

* fs-admin 与crud demo ([4e6b20f](https://github.com/fast-crud/fast-crud/commit/4e6b20fe19434460853841f371b9fd5f16e5e2d3))

## [0.10.5](https://github.com/fast-crud/fast-crud/compare/v0.10.4...v0.10.5) (2021-07-01)

### Bug Fixes

* 头像与搜索框冲突的bug https://github.com/fast-crud/fast-crud/issues/2 ([a118b91](https://github.com/fast-crud/fast-crud/commit/a118b91f8327980fe22b7254e11a30fce138b867))

* https://github.com/fast-crud/fast-crud/issues/3 ([b617668](https://github.com/fast-crud/fast-crud/commit/b617668cf77d1d8ceab24a93c14821e75f085a97))

### Performance Improvements

* fs-admin 与crud demo ([4e6b20f](https://github.com/fast-crud/fast-crud/commit/4e6b20fe19434460853841f371b9fd5f16e5e2d3))

## [0.10.4](https://github.com/fast-crud/fast-crud/compare/v0.10.3...v0.10.4) (2021-06-20)

### Bug Fixes

* 修复element expand不显示的bug ([0394626](https://github.com/fast-crud/fast-crud/commit/0394626ee9ccde0a0c981f4d494f0dfa8b82983c))

### Performance Improvements

* 优化logger ([97a0ca9](https://github.com/fast-crud/fast-crud/commit/97a0ca95732a14eef7d91b10f46acd994d0bce87))

* 禁止在列设置中选择配置属性名称修改为columnSetDisabled ([8d6420a](https://github.com/fast-crud/fast-crud/commit/8d6420a23b9ae08fee769ce6d8ad65fb4d3dd55b))

## [0.10.3](https://github.com/fast-crud/fast-crud/compare/v0.10.2...v0.10.3) (2021-06-19)

### Bug Fixes

* table hide error ([fb9c04f](https://github.com/fast-crud/fast-crud/commit/fb9c04f14b7c2321989e017ff429ae49b7a472bf))

### Performance Improvements

* 优化expose ([f1d75b5](https://github.com/fast-crud/fast-crud/commit/f1d75b5c5a2d0a3e88f517f5fdc01bd6d99a7914))

## [0.10.2](https://github.com/fast-crud/fast-crud/compare/v0.10.1...v0.10.2) (2021-06-15)

### Performance Improvements

* 增加固定列示例 ([90d73b3](https://github.com/fast-crud/fast-crud/commit/90d73b35e8566f69d400a5902f29f222b046750b))

## [0.10.1](https://github.com/fast-crud/fast-crud/compare/v0.10.0...v0.10.1) (2021-06-14)

### Bug Fixes

* search增加默认值，columns[x].search.value ([3ce9d23](https://github.com/fast-crud/fast-crud/commit/3ce9d235762036097736cc23ce325ea8e25b7f79))

* 修复a-table宽度拖动问题 ([944f4a5](https://github.com/fast-crud/fast-crud/commit/944f4a51af91016b2eb83f58bc787765f90ff512))

# [0.10.0](https://github.com/fast-crud/fast-crud/compare/v0.9.3...v0.10.0) (2021-06-14)

### Bug Fixes

* switch search ([4615fe2](https://github.com/fast-crud/fast-crud/commit/4615fe295c52240f69a07f444c982cdf97c5bb69))

### Features

* 将ui-interface单独抽出来 ([6bcc22a](https://github.com/fast-crud/fast-crud/commit/6bcc22a25b31e9644b1dd00badf2e5b01785b4aa))

## [0.9.3](https://github.com/fast-crud/fast-crud/compare/v0.9.2...v0.9.3) (2021-05-30)

### Bug Fixes

* sort change ui ([cdd754e](https://github.com/fast-crud/fast-crud/commit/cdd754ebbbfe673ab683b83a773aca8feedd6dfb))

* 修复element pagination 触发antdv的onChange事件的bug ([8915732](https://github.com/fast-crud/fast-crud/commit/8915732f9f083f4d54b5cb7ef76beb5fe28b57ab))

## [0.9.2](https://github.com/fast-crud/fast-crud/compare/v0.9.1...v0.9.2) (2021-05-30)

**Note:** Version bump only for package @fast-crud/fast-crud

## [0.9.1](https://github.com/fast-crud/fast-crud/compare/v0.9.0...v0.9.1) (2021-05-27)

**Note:** Version bump only for package @fast-crud/fast-crud

# [0.9.0](https://github.com/fast-crud/fast-crud/compare/v0.8.5...v0.9.0) (2021-05-23)

### Features

* 修改locale单词 ([dc6e7e8](https://github.com/fast-crud/fast-crud/commit/dc6e7e82eb3f7e92dd2d658a2d773feaa996bc50))

## [0.8.3](https://github.com/fast-crud/fast-crud/compare/v0.8.2...v0.8.3) (2021-05-22)

**Note:** Version bump only for package @fast-crud/fast-crud

## [0.8.2](https://github.com/fast-crud/fast-crud/compare/v0.8.1...v0.8.2) (2021-05-22)

### Bug Fixes

* editable add ([14f3aa9](https://github.com/fast-crud/fast-crud/commit/14f3aa9c06ccec9e5d83a6c72d83024a0505caa0))

## [0.8.1](https://github.com/fast-crud/fast-crud/compare/v0.8.0...v0.8.1) (2021-05-22)

**Note:** Version bump only for package @fast-crud/fast-crud

# [0.8.0](https://github.com/fast-crud/fast-crud/compare/v0.7.1...v0.8.0) (2021-05-09)

### Features

* type支持数组，可以多个继承合并 ([7f75a39](https://github.com/fast-crud/fast-crud/commit/7f75a395a1fc2a4855c008ff2aed9b75506a0682))
