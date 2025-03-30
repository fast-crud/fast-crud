# fs-table-select

## Props

| Prop name           | Description                                                                                                                         | Type                   | Values | Default   |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------ | --------- |
| modelValue          | modelValue                                                                                                                          | any                    | -      |           |
| createCrudOptions   | crudOptions 创建方法                                                                                                                | CreateCrudOptions      | -      |           |
| crudOptionsOverride | crudOptions 覆盖配置                                                                                                                | DynamicallyCrudOptions | -      | undefined |
| beforeOpen          | 打开对话框前，可以修改配置<br/>`@params` undefined                                                                                  | TSFunctionType         | -      |           |
| dict                | 数据字典<br/>必須配置`getNodesByValues`参数,你需要实现：根据 id 列表向后台请求多行数据并返回<br/>`dict.value必须与table.rowKey一致` | Dict                   | -      |           |
| select              | 选择框 fs-dict-select 配置                                                                                                          | any                    | -      | undefined |
| showSelect          | 是否显示选择框<br/>有时候你只是想要那个选择的 Dialog，那么你可以隐藏 select，然后自定义激活方式                                     | boolean                | -      | true      |
| dialog              | 对话框配置                                                                                                                          | any                    | -      | undefined |
| showCurrent         | 对话框中是否显示当前选中值                                                                                                          | boolean                | -      | true      |
| valuesFormat        | 当前选中值 fs-values-format 组件 配置                                                                                               | any                    | -      | undefined |
| height              | crud 高度                                                                                                                           | string                 | -      | undefined |
| multiple            | 是否多选                                                                                                                            | boolean                | -      |           |
| crossPage           | 跨页选中                                                                                                                            | boolean                | -      | true      |
| rowKey              | 可选,element-plus 必传                                                                                                              | string                 | -      | undefined |
| disabled            |                                                                                                                                     | boolean                | -      | false     |
| readonly            |                                                                                                                                     | boolean                | -      | false     |
| valueType           | 值类型                                                                                                                              | union                  | -      | "value"   |
| viewMode            | 是否查看模式                                                                                                                        | boolean                | -      | false     |
| emitOnViewModel     | 查看模式下是否触发 change 事件                                                                                                      | boolean                | -      | true      |
| destroyOnClose      | table 是否跟随窗口关闭而销毁                                                                                                        | boolean                | -      | true      |

## Events

| Event name        | Properties | Description |
| ----------------- | ---------- | ----------- |
| change            |            |
| update:modelValue |            |
| selected-change   |            |
| dialog-close      |            |
| dialog-closed     |            |

## Slots

| Name    | Description | Bindings |
| ------- | ----------- | -------- |
| default |             |          |

---
