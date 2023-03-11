# FsFileUploader

> 文件上传组件
> 支持对应 ui 库的[x]-file-uploader 组件的配置

## Props

| Prop name           | Description                                                                                   | Type           | Values | Default                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------- | -------------- | ------ | ------------------------------------------------------------------------- |
| modelValue          | value                                                                                         |                | -      |                                                                           |
| limit               | 限制文件数量<br/>当限制数量&gt;1 时，返回值为数组                                             | number         | -      |                                                                           |
| sizeLimit           | 文件大小限制，单位：字节<br/>可以直接传一个数字，也可以传 {limit:number,tip:'自定义提示文本'} | number\|object | -      |                                                                           |
| buildUrl            | 构建 url 的方法<br/>后台返回 key 之后，将其 build 成一个可访问的 url，用于反显                |                | -      | function() {<br/> return (value) =&gt; {<br/> return value;<br/> };<br/>} |
| button              | 上传按钮配置，参考 FsButton 参数                                                              | object         | -      |                                                                           |
| listType            | 展示模式，对应[x]-uploader 组件的 listType 参数                                               | string         | -      |                                                                           |
| beforeUpload        | 上传前的判断操作                                                                              | func           | -      |                                                                           |
| beforeUploadRequest | 上传请求前的操作，可以压缩图片等<br/>type: `async (context)=&gt;{}`                           | func           | -      |                                                                           |
| uploader            | fs-uploader 的配置                                                                            | object         | -      |                                                                           |
| preview             | 预览配置                                                                                      | object         | -      |                                                                           |
| valueType           | 返回值类型<br/>支持：`[url,key,object]`                                                       | string         | -      | "url"                                                                     |

## Events

| Event name        | Properties | Description |
| ----------------- | ---------- | ----------- |
| change            |            |
| update:modelValue |            |
| success           |            |
| exceed            |            |

---
