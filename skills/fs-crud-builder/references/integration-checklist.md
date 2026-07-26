# 集成检查清单

当应用里还没有可用的 fast-crud 集成时，使用这份清单。

## 依赖

安装核心包和一个 UI 适配包：

- 核心包：`@fast-crud/fast-crud`
- 可选扩展：`@fast-crud/fast-extends`、`@fast-crud/editor-code`
- UI 适配包：`@fast-crud/ui-element`、`@fast-crud/ui-antdv`、`@fast-crud/ui-antdv4`、`@fast-crud/ui-naive` 四选一
- 基础 UI 库：`element-plus`、`ant-design-vue` 或 `naive-ui`
- 示例项目常见运行依赖：`lodash-es`、`dayjs`、`@iconify/vue`、`vue-i18n`、`vue-router`

## 应用注册顺序

先注册基础 UI 库，再注册 fast-crud UI 适配包，最后注册 `FastCrud`。

```ts
import { FastCrud } from "@fast-crud/fast-crud";
import "@fast-crud/fast-crud/dist/style.css";
import ui from "@fast-crud/ui-element";

app.use(ui);
app.use(FastCrud, {
  i18n,
  async dictRequest({ url }) {
    return await request({ url, method: "post" });
  },
  commonOptions() {
    return {
      request: {
        transformQuery: ({ page, form, sort }) => ({ page, form, sort }),
        transformRes: ({ res }) => res
      }
    };
  }
});
```

## 全局请求转换

使用 `transformQuery` 把 fast-crud 传入的 `{ page, form, sort }` 转换成后端需要的请求结构。

使用 `transformRes` 把后端结果转换成：

```ts
{
  records: [],
  currentPage: 1,
  pageSize: 20,
  total: 0
}
```

示例项目经常使用 `offset/limit` 结构：

```ts
transformQuery: ({ page, form, sort }) => {
  const limit = page.pageSize;
  const currentPage = page.currentPage ?? 1;
  return {
    page: {
      limit,
      offset: limit * (currentPage - 1)
    },
    query: form,
    sort: sort ?? {}
  };
}
```

## Naive UI 额外要求

Naive UI 需要在 provider 下面包一层 `<fs-ui-context>`，这样 fast-crud 才能使用消息、通知和弹窗能力。

```vue
<n-dialog-provider>
  <n-notification-provider>
    <n-message-provider>
      <fs-ui-context>
        <RouterView />
      </fs-ui-context>
    </n-message-provider>
  </n-notification-provider>
</n-dialog-provider>
```

## 表格空白排查

- 确认已引入 fast-crud 样式。
- 确认 UI 适配包在 `FastCrud` 之前安装。
- 确认 `<fs-crud>` 的父容器有高度，或临时设置一个明确高度。
- 确认 `pageRequest` 有返回数据，且 `transformRes` 输出了 `records`、`currentPage`、`pageSize` 和 `total`。
