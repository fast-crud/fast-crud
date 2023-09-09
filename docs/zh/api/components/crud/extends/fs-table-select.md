# fs-table-select

## Props

| Prop name           | Description                              | Type                   | Values | Default |
| ------------------- | ---------------------------------------- | ---------------------- | ------ | ------- |
| modelValue          | modelValue                               | any                    | -      |         |
| createCrudOptions   | crudOptions 创建方法                     | CreateCrudOptions      | -      |         |
| crudOptionsOverride | crudOptions 覆盖配置                     | DynamicallyCrudOptions | -      |         |
| dict                | 数据字典, 必須配置 getNodesByValues 参数 | Dict                   | -      |         |
| select              | 选择框配置                               | any                    | -      |         |
| dialog              | 对话框配置                               | any                    | -      |         |
| height              | crud 高度                                | string                 | -      |         |
| multiple            | 是否多选                                 | boolean                | -      |         |
| crossPage           | 跨页选中                                 | boolean                | -      |         |
| rowKey              | element plus 必传                        | string                 | -      |         |

## Events

| Event name        | Properties | Description |
| ----------------- | ---------- | ----------- |
| change            |            |
| update:modelValue |            |

---
