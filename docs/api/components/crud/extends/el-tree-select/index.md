# ElTreeSelect

## Props

| Prop name        | Description | Type                  | Values | Default                                                                                                                                                                                                                                                 |
| ---------------- | ----------- | --------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| value            |             | string\|array\|number | -      | function() {<br> return "";<br>}                                                                                                                                                                                                                        |
| styles           |             | object                | -      | {}                                                                                                                                                                                                                                                      |
| selectClass      |             | string                | -      | function() {<br> return "";<br>}                                                                                                                                                                                                                        |
| popoverClass     |             | string                | -      | function() {<br> return "";<br>}                                                                                                                                                                                                                        |
| disabled         |             | boolean               | -      | function() {<br> return false;<br>}                                                                                                                                                                                                                     |
| placement        |             | string                | -      | function() {<br> return "bottom";<br>}                                                                                                                                                                                                                  |
| treeRenderFun    |             | func                  | -      |                                                                                                                                                                                                                                                         |
| filterNodeMethod |             | func                  | -      |                                                                                                                                                                                                                                                         |
| selectParams     |             | object                | -      | {<br> clearable: true,<br> disabled: false,<br> placeholder: "请选择"<br>}                                                                                                                                                                              |
| treeParams       |             | object                | -      | {<br> clickParent: false,<br> filterable: false,<br> leafOnly: false,<br> includeHalfChecked: false,<br> data: [],<br> props: {<br> children: "children",<br> label: "name",<br> code: "code",<br> value: "flowId",<br> disabled: "disabled"<br> }<br>} |

## Events

| Event name   | Properties                                                                           | Description |
| ------------ | ------------------------------------------------------------------------------------ | ----------- |
| searchFun    |                                                                                      |
| node-click   | **<anonymous1>** `undefined` - undefined<br>**<anonymous2>** `undefined` - undefined |
| check        | **<anonymous1>** `undefined` - undefined<br>**<anonymous2>** `undefined` - undefined |
| removeTag    | **<anonymous1>** `undefined` - undefined                                             |
| input        |                                                                                      |
| select-clear |                                                                                      |

---
