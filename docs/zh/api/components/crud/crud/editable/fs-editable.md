# fs-editable

## Props

| Prop name      | Description | Type    | Values | Default                          |
| -------------- | ----------- | ------- | ------ | -------------------------------- |
| disabled       |             | boolean | -      | false                            |
| editing        |             | boolean | -      | false                            |
| dirty          |             | boolean | -      | false                            |
| trigger        |             | union   | -      | "onClick"                        |
| loading        |             | boolean | -      | false                            |
| showAction     |             | boolean | -      | true                             |
| validateErrors |             | Array   | -      | () =&gt; {<br/> return [];<br/>} |

## Events

| Event name     | Properties | Description |
| -------------- | ---------- | ----------- |
| update:editing |            |
| submit         |            |
| cancel         |            |

## Slots

| Name    | Description | Bindings |
| ------- | ----------- | -------- |
| default |             |          |
| edit    |             |          |

---
