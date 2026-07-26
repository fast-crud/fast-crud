# CRUD 脚手架模式

创建新的 CRUD 模块时使用这些模式。

## 推荐的真实项目结构

在应用的 `src/views` 区域下创建目录：

```text
src/views/system/user/
  index.vue
  crud.tsx
  api.ts
  mock.ts
```

`index.vue` 挂载 `<fs-crud>` 并调用 `useFs`。

`crud.tsx` 导出 `createCrudOptions`，并把接口方法映射到 `crudOptions.request`。

`api.ts` 封装项目请求客户端。

`mock.ts` 只用于演示项目或本地开发。

## 最小 index.vue

```vue
<template>
  <fs-page>
    <fs-crud ref="crudRef" v-bind="crudBinding" />
  </fs-page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useFs } from "@fast-crud/fast-crud";
import createCrudOptions from "./crud";

export default defineComponent({
  name: "SystemUser",
  setup() {
    const { crudBinding, crudRef, crudExpose, context } = useFs({ createCrudOptions });

    onMounted(() => {
      crudExpose.doRefresh();
    });

    return {
      crudBinding,
      crudRef,
      ...context
    };
  }
});
</script>
```

## 最小 crud.tsx

```tsx
import * as api from "./api";
import {
  AddReq,
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  DelReq,
  EditReq,
  UserPageQuery,
  UserPageRes,
  dict
} from "@fast-crud/fast-crud";

export default function createCrudOptions({}: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const pageRequest = async (query: UserPageQuery): Promise<UserPageRes> => api.GetList(query);
  const addRequest = async ({ form }: AddReq) => api.AddObj(form);
  const editRequest = async ({ form, row }: EditReq) => api.UpdateObj({ ...form, id: form.id ?? row.id });
  const delRequest = async ({ row }: DelReq) => api.DelObj(row.id);

  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest
      },
      columns: {
        id: {
          title: "ID",
          type: "number",
          column: { width: 80 },
          form: { show: false }
        },
        name: {
          title: "名称",
          type: "text",
          search: { show: true },
          form: {
            rules: [{ required: true, message: "请输入名称" }]
          }
        },
        status: {
          title: "状态",
          type: "dict-select",
          search: { show: true },
          dict: dict({
            data: [
              { value: 1, label: "启用", color: "success" },
              { value: 0, label: "停用", color: "danger" }
            ]
          })
        }
      }
    }
  };
}
```

## 路由接入

Element 和 Antdv4 示例的资源路由常用对象写法：

```ts
{
  title: "用户管理",
  name: "SystemUser",
  path: "/system/user",
  component: "/system/user/index.vue"
}
```

Naive UI 路由通常使用懒加载：

```ts
{
  name: "SystemUser",
  path: "user",
  meta: { title: "用户管理", keepAlive: true },
  component: () => import("@/views/system/user/index.vue")
}
```

不要盲目插入路由。先匹配目标项目已有的路由风格和命名习惯。

## 脚手架脚本

在 skill 目录运行，或传入绝对目标路径：

```bash
node scripts/scaffold-crud.mjs --root C:/path/to/src/views/system/user --name SystemUser --title 用户管理 --api-prefix /system/user
```

脚本会根据 `assets/basic-crud` 创建文件。提交前要按项目本地风格再检查和调整。
