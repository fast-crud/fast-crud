# FsToolbar

## Props

| Prop name | Description                                            | Type            | Values | Default   |
| --------- | ------------------------------------------------------ | --------------- | ------ | --------- |
| buttons   |                                                        | object          | -      |           |
| search    | 是否显示查询<br>传 null，则不显示按钮                  | boolean         | -      |           |
| compact   | 紧凑模式按钮<br>传 null，则不显示按钮                  | boolean         | -      | true      |
| columns   | 列配置                                                 | array           | -      | undefined |
| storage   | 是否保存用户列设置<br>传 string 则表示传入缓存的主 key | string\|boolean | -      | true      |
| slots     |                                                        |                 | -      |           |

## Events

| Event name     | Properties | Description |
| -------------- | ---------- | ----------- |
| update:columns |            |
| refresh        |            |
| update:search  |            |
| update:compact |            |
| export         |            |

---
