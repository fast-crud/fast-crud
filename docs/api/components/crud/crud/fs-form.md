# FsForm

## Props

| Prop name   | Description                                                                                  | Type      | Values | Default                          |
| ----------- | -------------------------------------------------------------------------------------------- | --------- | ------ | -------------------------------- |
| initialForm |                                                                                              |           | -      | function() {<br> return {};<br>} |
| columns     |                                                                                              |           | -      |                                  |
| group       | 字段分组<br>{<br> type:'xxx',<br> groups:{<br> groupKey:{ title:'xxx',columns:[]}<br> }<br>} |           | -      |                                  |
| doSubmit    |                                                                                              | func      | -      |                                  |
| slots       |                                                                                              | undefined | -      | {}                               |
| display     |                                                                                              | string    | -      | "grid"                           |
| index       |                                                                                              |           | -      |                                  |
| mode        |                                                                                              |           | -      |                                  |
| row         |                                                                                              |           | -      |                                  |
| col         |                                                                                              |           | -      |                                  |

## Events

| Event name      | Properties | Description |
| --------------- | ---------- | ----------- |
| reset           |            |
| submit          |            |
| validationError |            |
| value-change    |            |

---
