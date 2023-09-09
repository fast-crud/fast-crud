# FsToolbar

> 工具条

## Props

| Prop name     | Description                                                                                                                           | Type              | Values | Default   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------ | --------- |
| buttons       | 按钮配置<br/>{<br/> search:{}, 查询<br/> refresh:{}, 刷新<br/> compact:{}, 紧凑模式<br/> export:{}, 导出<br/> columns:{} 列设置<br/>} | object            | -      |           |
| compact       | 当前是否紧凑模式                                                                                                                      | boolean           | -      | true      |
| columns       | 列配置                                                                                                                                | TableColumnsProps | -      | undefined |
| storage       | 是否保存用户列设置<br/>传 string 则表示传入缓存的主 key                                                                               | string\|boolean   | -      | true      |
| slots         | 插槽                                                                                                                                  | -                 | -      |           |
| columnsFilter | 列设置配置                                                                                                                            | any               | -      |           |

## Events

| Event name     | Properties | Description |
| -------------- | ---------- | ----------- |
| update:columns |            |

---
