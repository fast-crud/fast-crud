# FsCopyable

> fs-copyable
> 可以点击复制文本
> 通过默认插槽可以自定义文本主体

## Props

| Prop name      | Description                                                                        | Type                    | Values | Default                            |
| -------------- | ---------------------------------------------------------------------------------- | ----------------------- | ------ | ---------------------------------- |
| modelValue     |                                                                                    | string\|number\|boolean | -      | undefined                          |
| button         | 复制按钮<br/>show: 是否显示，默认 true<br/>text: 按钮文字<br/>...其他 tag 组件参数 | CopyButton              | -      | function() {<br/> return {};<br/>} |
| successMessage | 成功信息                                                                           | boolean\|string         | -      | true                               |
| errorMessage   | 错误时的信息                                                                       | boolean\|string         | -      | true                               |
| inline         |                                                                                    | boolean                 | -      | false                              |

## Events

| Event name        | Properties | Description |
| ----------------- | ---------- | ----------- |
| update:modelValue |            |
| success           |            | 成功事件    |
| error             |            | 失败事件    |

## Slots

| Name    | Description | Bindings |
| ------- | ----------- | -------- |
| default |             |          |

---
