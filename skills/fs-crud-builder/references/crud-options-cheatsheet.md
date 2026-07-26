# CrudOptions 速查

处理高频 `crudOptions` 配置时使用这份速查。

## 顶层结构

```ts
return {
  crudOptions: {
    request: {},
    columns: {},
    table: {},
    search: {},
    form: {},
    rowHandle: {},
    toolbar: {},
    actionbar: {}
  }
};
```

## 字段配置

`columns` 下的每个 key 对应一个行字段。嵌套数据可以使用 `"user.name"` 这样的点路径。

```ts
name: {
  title: "名称",
  type: "text",
  search: { show: true },
  column: { width: 180, resizable: true },
  form: {
    rules: [{ required: true, message: "请输入名称" }]
  }
}
```

## 常用字段类型

- 文本：`text`、`password`、`textarea`
- 数字：`number`
- 字典组件：`dict-select`、`dict-radio`、`dict-checkbox`、`dict-switch`、`dict-cascader`
- 日期时间：`date`、`datetime`、`time`、`daterange`、`datetimerange`
- 已安装扩展时可用：`file-uploader`、`image-uploader`、`avatar-uploader`、`cropper-uploader`、`editor-wang5`、`editor-code`、`json`、`copyable`、`time-humanize`

## 字段位置

- `column`：表格列和单元格展示配置。
- `form`：添加、编辑、查看表单的公共配置。
- `addForm`、`editForm`、`viewForm`：覆盖某个模式下的 `form` 配置。
- `search`：查询表单配置。

## 显隐和提交

```ts
id: {
  title: "ID",
  type: "number",
  form: { show: false },
  column: { width: 80 }
}

computedName: {
  title: "计算名称",
  type: "text",
  form: { submit: false }
}
```

## 自定义渲染

在 `.tsx` 文件中使用 TSX 渲染回调。

```tsx
status: {
  title: "状态",
  type: "text",
  column: {
    cellRender({ value }) {
      return <span>{value}</span>;
    }
  }
}
```

## 值转换

列表或详情数据从后端返回后，使用 `valueBuilder` 转成组件需要的值。

表单提交前，使用 `valueResolve` 转回后端需要的值。

```ts
imageUrls: {
  title: "图片",
  type: "image-uploader",
  valueBuilder({ row }) {
    row.imageUrls = row.imageUrls ? row.imageUrls.split(",") : [];
  },
  valueResolve({ form }) {
    form.imageUrls = Array.isArray(form.imageUrls) ? form.imageUrls.join(",") : form.imageUrls;
  }
}
```

## 按钮区域

常见按钮位置包括 `actionbar.buttons.add`、`rowHandle.buttons.view/edit/remove/copy` 和 `toolbar.buttons.refresh/search/export/columns`。

隐藏默认按钮使用 `show: false`。如果项目有权限封装，优先复用现有权限合并逻辑。
