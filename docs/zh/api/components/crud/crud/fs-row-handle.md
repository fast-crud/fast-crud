# FsRowHandle

> 操作列配置

## Props

| Prop name | Description                                                                                                                                                                     | Type   | Values | Default   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------ | --------- |
| dropdown  | 按钮折叠                                                                                                                                                                        |        | -      |           |
| buttons   | 按钮配置<br>{<br> view:{...FsButton,click:Function,order:1},<br> edit:{...FsButton,click:Function,order:2},<br> remove:{...FsButton,click:Function,order:3},<br> ...自定义<br>} |        | -      |           |
| group     | 按钮分组,上面的 buttons 为默认分组<br> {<br> groupKey:{buttonKey:{},buttonKey2:{}}<br> }                                                                                        |        | -      |           |
| active    | 当前激活分组                                                                                                                                                                    | string | -      | "default" |
| scope     | scope                                                                                                                                                                           |        | -      |           |

## Events

| Event name | Properties | Description |
| ---------- | ---------- | ----------- |
| handle     |            |

---
