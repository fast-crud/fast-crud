# fs-table-columns-filter

## Props

| Prop name       | Description          | Type                                                                                                                                                                                                                 | Values | Default   |
| --------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --------- |
| show            | 是否显示列设置抽屉   | boolean                                                                                                                                                                                                              | -      |           |
| mode            | 模式，default,simple | string                                                                                                                                                                                                               | -      | "default" |
| columns         | 列数据               | Array                                                                                                                                                                                                                | -      |           |
| originalColumns | 原始列数据           | Array                                                                                                                                                                                                                | -      |           |
| storage         | 是否保存设置         | union                                                                                                                                                                                                                | -      | true      |
| text            | 文本设置             | {<br/> //标题<br/> title?: string;<br/> //固定<br/> fixed?: string;<br/> //排序<br/> order?: string;<br/> // 重置<br/> reset?: string;<br/> //确认<br/> confirm?: string;<br/> //未命名<br/> unnamed?: string;<br/>} | -      |           |

## Events

| Event name     | Properties | Description |
| -------------- | ---------- | ----------- |
| update:columns |            |
| update:show    |            |

## Expose

### start

>

### original

>

### columns

>

---
