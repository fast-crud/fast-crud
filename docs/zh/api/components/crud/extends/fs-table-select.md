# fs-table-select

## Props

| Prop name           | Description                                                                                                                         | Type                   | Values | Default   |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------ | --------- |
| modelValue          | modelValue                                                                                                                          | any                    | -      |           |
| createCrudOptions   | crudOptions 创建方法                                                                                                                | CreateCrudOptions      | -      |           |
| crudOptionsOverride | crudOptions 覆盖配置                                                                                                                | DynamicallyCrudOptions | -      | undefined |
| dict                | 数据字典<br/>必須配置`getNodesByValues`参数,你需要实现：根据 id 列表向后台请求多行数据并返回<br/>`dict.value必须与table.rowKey一致` | Dict                   | -      |           |
| select              | 选择框 fs-dict-select 配置                                                                                                          | any                    | -      | undefined |
| dialog              | 对话框配置                                                                                                                          | any                    | -      | undefined |
| valuesFormat        | 当前选中值 fs-values-format 组件 配置                                                                                               | any                    | -      | undefined |
| height              | crud 高度                                                                                                                           | string                 | -      | undefined |
| multiple            | 是否多选                                                                                                                            | boolean                | -      |           |
| crossPage           | 跨页选中                                                                                                                            | boolean                | -      | true      |
| rowKey              | 可选,element-plus 必传                                                                                                              | string                 | -      | undefined |
| disabled            |                                                                                                                                     | boolean                | -      | false     |
| readonly            |                                                                                                                                     | boolean                | -      | false     |
| valueType           | 值类型                                                                                                                              | union                  | -      | "value"   |

## Events

| Event name        | Properties | Description |
| ----------------- | ---------- | ----------- |
| change            |            |
| update:modelValue |            |

---
