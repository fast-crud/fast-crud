# FsCropperUploader

> 图片裁剪上传组件,封装了 fs-cropper
> fs-cropper 内部封装了[cropperjs](https://github.com/fengyuanchen/cropperjs)

## Props

| Prop name       | Description                                                   | Type                  | Values | Default                                                                                        |
| --------------- | ------------------------------------------------------------- | --------------------- | ------ | ---------------------------------------------------------------------------------------------- |
| modelValue      | 初始图片 url,或者是数组                                       | string\|object\|array | -      |                                                                                                |
| img             |                                                               | -                     | -      |                                                                                                |
| type            | 上传后端类型，[form, cos, qiniu , alioss]                     | string                | -      |                                                                                                |
| uploadTip       | 上传提示                                                      | string                | -      |                                                                                                |
| title           | 对话框标题                                                    | string                | -      |                                                                                                |
| cropperHeight   | cropper 的高度，默认为浏览器可视窗口高度的 40%，最小 270      | string\|number        | -      |                                                                                                |
| dialogWidth     | 对话框宽度，默认 50%                                          | string\|number        | -      | "50%"                                                                                          |
| maxSize         | 图片大小限制，单位 MB                                         | number                | -      | 5                                                                                              |
| limit           | 图片数量限制,0 为不限制                                       | number                | -      | 1                                                                                              |
| accept          | 可接收的文件后缀                                              | string                | -      | ".jpg, .jpeg, .png, .gif, .webp"                                                               |
| cropper         | [cropperjs 的参数](https://github.com/fengyuanchen/cropperjs) | object                | -      |                                                                                                |
| uploader        | FsUploaderXXX 的配置，会临时覆盖全局上传配置参数              | object                | -      |                                                                                                |
| compressQuality | 压缩质量                                                      | number                | -      | 0.8                                                                                            |
| buildUrl        | 构建下载 url 方法,不影响提交的 value                          | func                  | -      | async function (value: any) {<br/> return typeof value === "object" ? value.url : value;<br/>} |
| valueType       | 返回值类型<br/>支持：`[url,key,object]`                       | string                | -      | "url"                                                                                          |
| disabled        | 是否禁用                                                      | -                     | -      |                                                                                                |

## Events

| Event name        | Properties | Description |
| ----------------- | ---------- | ----------- |
| update:modelValue |            |
| change            |            |
| ready             |            |

---
