# FsCropper

> 图片裁剪对话框
> 内部封装了[cropperjs](https://github.com/fengyuanchen/cropperjs)

## Props

| Prop name       | Description | Type           | Values | Default                          |
| --------------- | ----------- | -------------- | ------ | -------------------------------- |
| title           |             | string         | -      |                                  |
| cropperHeight   |             | string\|number | -      |                                  |
| dialogWidth     |             | string\|number | -      | "50%"                            |
| maxSize         |             | number         | -      | 5                                |
| uploadTip       |             | string         | -      |                                  |
| cropper         |             | object         | -      |                                  |
| accept          |             | string         | -      | ".jpg, .jpeg, .png, .gif, .webp" |
| output          |             | string         | -      | "blob"                           |
| compressQuality |             | number         | -      | 0.8                              |

## Events

| Event name | Properties | Description |
| ---------- | ---------- | ----------- |
| cancel     |            |
| done       |            |
| ready      |            |

---
