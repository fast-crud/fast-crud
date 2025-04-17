# FsFileUploader

> 文件上传组件
> 支持对应 ui 库的[x]-file-uploader 组件的配置

## Props

| Prop name           | Description                                                                                                                                                          | Type           | Values | Default                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------ | ------------------------------------------------------------------------------ |
| modelValue          | value                                                                                                                                                                | -              | -      |                                                                                |
| limit               | 限制文件数量<br/>当限制数量&gt;1 时，返回值为数组                                                                                                                    | number         | -      |                                                                                |
| sizeLimit           | 文件大小限制，单位：字节<br/>可以直接传一个数字，也可以传 `{limit:number,tip:'自定义提示文本'}`                                                                      | number\|object | -      |                                                                                |
| pixelLimit          | 限制上传图片的像素尺寸<br/>可以传数组会对象{ width?: number, height?: number, tip?: string } \| [number, number?, string?]                                           | PixelLimit     | -      |                                                                                |
| showLimitTip        | 是否显示限制提示                                                                                                                                                     | boolean        | -      | true                                                                           |
| buildUrl            | 构建 url 的方法<br/>后台返回 key 之后，将其 build 成一个可访问的 url，用于反显<br/>如果 successHandle 返回的 object 中已包含 url，此配置将不会执行                   | -              | -      | function() {<br/> return (value: any) =&gt; {<br/> return value;<br/> };<br/>} |
| buildUrls           | 多个 value 值构建多个 url<br/>如果 successHandle 返回的 object 中已包含 url，此方法将不会执行                                                                        | -              | -      |                                                                                |
| button              | 上传按钮配置，参考 FsButton 参数                                                                                                                                     | object         | -      |                                                                                |
| listType            | 展示模式，对应[x]-uploader 组件的 listType 参数                                                                                                                      | string         | -      |                                                                                |
| beforeUpload        | 上传前的判断操作                                                                                                                                                     | func           | -      |                                                                                |
| beforeUploadRequest | 上传请求前的操作，可以压缩图片等，替换掉 context 中的 file<br/>type: `async (context)=&gt;void`                                                                      | func           | -      |                                                                                |
| uploader            | FsUploaderXXX 的配置<br/>可以覆盖全局配置里各个上传类型对应的配置<br/>例如: `{action:'xxx',bucket:'xxx',...}`                                                        | object         | -      |                                                                                |
| preview             | 预览配置                                                                                                                                                             | object         | -      |                                                                                |
| valueType           | 上传成功后从结果中取值类型<br/>支持：`[object,url,key,其他（successHandle返回的object内要有该字段，不要用'id'）]`<br/>如果配置了非 url，则需要配置 buildUrl 用于反显 | string         | -      | "url"                                                                          |
| getFileName         | 根据 value 获取文件名，用于显示在 fileList 里面                                                                                                                      | -              | -      |                                                                                |

## Events

| Event name        | Properties | Description |
| ----------------- | ---------- | ----------- |
| change            |            |
| update:modelValue |            |
| success           |            |
| exceed            |            |
| remove            |            |

---
