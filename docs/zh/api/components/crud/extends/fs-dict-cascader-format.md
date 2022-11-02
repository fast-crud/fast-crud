# FsDictCascaderFormat

> 级联数据格式化展示组件

## Props

| Prop name  | Description                                                                                                               | Type          | Values | Default   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------- | ------------- | ------ | --------- |
| modelValue | 值<br/><br/> 单选时 '1,2,3' 或 [1,2,3]<br/><br/> 多选[[1,2,3],[4,5,6]]<br/>                                               | string\|array | -      | undefined |
| separator  | value 的分隔符<br/><br/> 多选时，如果 value 为 string，则以该分隔符分割成多个展示<br/><br/> 传入空字符串，表示不分割<br/> | string        | -      | ","       |
| multiple   | 是否多选                                                                                                                  | boolean       | -      | false     |
| dict       | 数据字典                                                                                                                  | object        | -      | undefined |

## Events

| Event name  | Properties | Description |
| ----------- | ---------- | ----------- |
| dict-change |            |

---
