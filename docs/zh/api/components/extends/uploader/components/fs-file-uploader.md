# FsFileUploader

## Props

| Prop name    | Description                      | Type   | Values | Default                                                                |
| ------------ | -------------------------------- | ------ | ------ | ---------------------------------------------------------------------- |
| modelValue   |                                  |        | -      |                                                                        |
| limit        |                                  |        | -      |                                                                        |
| sizeLimit    |                                  |        | -      |                                                                        |
| buildUrl     |                                  |        | -      | function() {<br/> return (value) => {<br/> return value;<br/> };<br/>} |
| button       | 上传按钮配置，参考 FsButton 参数 |        | -      |                                                                        |
| listType     |                                  |        | -      |                                                                        |
| beforeUpload |                                  |        | -      |                                                                        |
| uploader     |                                  |        | -      |                                                                        |
| preview      |                                  |        | -      |                                                                        |
| valueType    | 返回值类型                       | string | -      | "url"                                                                  |

## Events

| Event name        | Properties | Description |
| ----------------- | ---------- | ----------- |
| change            |            |
| update:modelValue |            |
| success           |            |
| exceed            |            |

---
