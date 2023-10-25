# FsValuesFormat

> value 格式化展示组件

## Props

| Prop name      | Description                                                                                                                                                                  | Type    | Values | Default |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------ | ------- |
| modelValue     | 值                                                                                                                                                                           | -       | -      |         |
| dict           | 字典配置                                                                                                                                                                     | -       | -      |         |
| multiple       | 是否多选                                                                                                                                                                     | boolean | -      | true    |
| separator      | 分隔符&lt;br/&gt;<br/>多选时，如果 value 为 string，则以该分隔符分割成多个展示&lt;br/&gt;<br/>传入空字符串，表示不分割&lt;br/&gt;                                            | string  | -      | ","     |
| color          | 颜色<br/>element=【auto, primary, success, warning, danger ,info】<br/>antdv=【auto, primary, success, blue,red,...】<br/>配置 auto，则自动根据 value 值 hashcode 分配颜色值 | -       | -      |         |
| effect         | 效果（仅 element）                                                                                                                                                           | -       | -      |         |
| autoColors     | 自动染色颜色值列表                                                                                                                                                           | array   | -      |         |
| autoEffects    | 自动主题列表（仅 element）<br/>【 light, plain 】                                                                                                                            | array   | -      |         |
| type           | 显示类型：【text, tag】                                                                                                                                                      | string  | -      | "tag"   |
| valueType      | 值的类型，【 value \| object】                                                                                                                                               | string  | -      |         |
| defaultLabel   | 当 value 值不在字典中时默认显示的文本                                                                                                                                        | -       | -      |         |
| labelFormatter | label 自定义 render                                                                                                                                                          | func    | -      |         |
| itemRender     | 自定义选项 render                                                                                                                                                            | func    | -      |         |
| closable       |                                                                                                                                                                              | boolean | -      | false   |

## Events

| Event name        | Properties | Description |
| ----------------- | ---------- | ----------- |
| click             |            |
| dict-change       |            |
| close             |            |
| update:modelValue |            |

---
