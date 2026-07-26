# 请求与字典

处理后端集成、分页、数据字典和值转换时使用这份参考。

## CRUD 请求方法

```ts
request: {
  pageRequest,
  addRequest,
  editRequest,
  delRequest,
  infoRequest
}
```

- `pageRequest(query)`：接收 `transformQuery` 的结果，或原始 `{ page, form, sort }`。
- `addRequest({ form })`：提交新增表单数据。
- `editRequest({ form, row })`：提交编辑数据；如果后端需要 id，要确保提交参数里带上 id。
- `delRequest({ row })`：根据行 id 或其他主键删除。
- `infoRequest({ mode, row })`：编辑或查看前可选加载最新详情。

## 后端返回结构

fast-crud 列表结果需要转换为：

```ts
{
  records: [],
  currentPage: 1,
  pageSize: 20,
  total: 0
}
```

如果后端返回 `{ records, offset, limit, total }`，这样转换：

```ts
transformRes: ({ res }) => {
  const pageSize = res.limit;
  const currentPage = res.offset % pageSize === 0 ? res.offset / pageSize + 1 : 1;
  return { ...res, currentPage, pageSize, records: res.records, total: res.total };
}
```

如果后端返回 `{ list, pageNum, pageSize, total }`，这样转换：

```ts
transformRes: ({ res }) => ({
  records: res.list,
  currentPage: res.pageNum,
  pageSize: res.pageSize,
  total: res.total
})
```

## 查询和排序参数

fast-crud 的常见输入：

```ts
{
  page: { currentPage, pageSize },
  form: {},
  sort: { prop, order, asc }
}
```

常见后端转换：

```ts
transformQuery: ({ page, form, sort }) => ({
  current: page.currentPage,
  size: page.pageSize,
  ...form,
  orderProp: sort?.prop,
  orderAsc: sort?.asc
})
```

## 本地字典

```ts
status: {
  title: "状态",
  type: "dict-select",
  dict: dict({
    data: [
      { value: 1, label: "启用", color: "success" },
      { value: 0, label: "停用", color: "danger" }
    ]
  })
}
```

## 远程字典

```ts
status: {
  title: "状态",
  type: "dict-select",
  dict: dict({
    url: "/dict/status",
    value: "code",
    label: "name"
  })
}
```

远程字典会调用全局 `dictRequest`。如果目标项目区分 mock 地址，要保留项目已有约定。

## 多值字段

当选择或上传组件需要数组，而后端存储逗号分隔字符串时，使用值转换：

```ts
roles: {
  title: "角色",
  type: "dict-select",
  form: {
    component: { multiple: true }
  },
  valueBuilder({ row }) {
    row.roles = row.roles ? row.roles.split(",") : [];
  },
  valueResolve({ form }) {
    form.roles = Array.isArray(form.roles) ? form.roles.join(",") : form.roles;
  }
}
```

## Mock 请求与真实请求

demo 的 `api.ts` 经常这样写：

```ts
import { requestForMock } from "/src/api/service";
const request = requestForMock;
```

真实项目要切换为真实请求客户端：

```ts
import { request } from "/src/api/service";
```
