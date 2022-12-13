# fs-table-columns-filter

## Props

| Prop name | Description          | Type                                                                                                                                                                                                                                                                                                                      | Values | Default   |
| --------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --------- |
| show      | 是否显示列设置抽屉   | boolean                                                                                                                                                                                                                                                                                                                   | -      |           |
| mode      | 模式，default,simple | string                                                                                                                                                                                                                                                                                                                    | -      | "default" |
| columns   | 列数据               | Array                                                                                                                                                                                                                                                                                                                     | -      |           |
| storage   | 是否保存设置         | union                                                                                                                                                                                                                                                                                                                     | -      | true      |
| text      | 文本设置             | {<br/> /**<br/> _ 标题<br/> _/<br/> title?: string;<br/> /**<br/> _ 固定<br/> _/<br/> fixed?: string;<br/> /**<br/> _ 排序<br/> _/<br/> order?: string;<br/> /**<br/> _ 重置<br/> _/<br/> reset?: string;<br/> /**<br/> _ 确认<br/> _/<br/> confirm?: string;<br/> /**<br/> _ 未命名<br/> _/<br/> unnamed?: string;<br/>} | -      |           |

## Events

| Event name     | Properties | Description |
| -------------- | ---------- | ----------- |
| update:columns |            |
| update:show    |            |

---
