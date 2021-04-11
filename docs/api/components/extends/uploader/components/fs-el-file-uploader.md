# FsElFileUploader

## Props

| Prop name  | Description | Type                  | Values | Default                                                                                |
| ---------- | ----------- | --------------------- | ------ | -------------------------------------------------------------------------------------- |
| btnSize    |             | string                | -      | "small"                                                                                |
| btnName    |             | string                | -      | "选择文件"                                                                             |
| accept     |             |                       | -      |                                                                                        |
| type       |             | string                | -      | undefined                                                                              |
| modelValue |             | string\|array\|object | -      |                                                                                        |
| suffix     |             | string                | -      |                                                                                        |
| returnType |             | string                | -      | "url"                                                                                  |
| custom     |             | object                | -      |                                                                                        |
| elProps    |             | object                | -      |                                                                                        |
| preview    |             | object                | -      |                                                                                        |
| sizeLimit  |             | number                | -      |                                                                                        |
| buildUrl   |             | func                  | -      | function (value, item) {<br> return typeof value === "object" ? item.url : value;<br>} |
| uploader   |             | object                | -      | {}                                                                                     |

## Events

| Event name | Properties                               | Description |
| ---------- | ---------------------------------------- | ----------- |
| change     |                                          |
| success    | **<anonymous1>** `undefined` - undefined |
| input      |                                          |

---
