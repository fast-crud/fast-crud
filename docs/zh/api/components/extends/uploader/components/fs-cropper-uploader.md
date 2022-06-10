# FsCropperUploader

> 图片裁剪上传组件,封装了 fs-cropper, fs-cropper 内部封装了 cropperjs

## Props

| Prop name     | Description | Type           | Values | Default                                                                                  |
| ------------- | ----------- | -------------- | ------ | ---------------------------------------------------------------------------------------- |
| disabled      |             |                | -      |                                                                                          |
| modelValue    |             | string\|array  | -      |                                                                                          |
| img           |             |                | -      |                                                                                          |
| type          |             | string         | -      |                                                                                          |
| uploadTip     |             | string         | -      |                                                                                          |
| title         |             | string         | -      |                                                                                          |
| cropperHeight |             | string\|number | -      |                                                                                          |
| dialogWidth   |             | string\|number | -      | "50%"                                                                                    |
| maxSize       |             | number         | -      | 5                                                                                        |
| limit         |             | number         | -      | 1                                                                                        |
| accept        |             | string         | -      | ".jpg, .jpeg, .png, .gif, .webp"                                                         |
| cropper       |             | object         | -      |                                                                                          |
| uploader      |             | object         | -      |                                                                                          |
| buildUrl      |             | func           | -      | function (value, item) {<br/> return typeof value === "object" ? item.url : value;<br/>} |

## Events

| Event name        | Properties | Description |
| ----------------- | ---------- | ----------- |
| update:modelValue |            |
| change            |            |

---
