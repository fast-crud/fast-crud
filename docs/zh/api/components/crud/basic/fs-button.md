# FsButton

> 按钮，支持 el-button/a-button 的配置

## Props

| Prop name   | Description                                                                                             | Type                 | Values | Default   |
| ----------- | ------------------------------------------------------------------------------------------------------- | -------------------- | ------ | --------- |
| text        | 文字                                                                                                    | string               | -      | ""        |
| icon        | 图标                                                                                                    | string\|object\|func | -      | ""        |
| iconRight   | 右边的图标                                                                                              | string\|object\|func | -      | ""        |
| circle      | 是否圆形按钮，text 需配置为 null                                                                        | boolean              | -      | false     |
| tooltip     | tooltip 配置，为空不显示 tooltip                                                                        | object               | -      | undefined |
| buttonProps | x-button 的配置，当 x-button 的配置与 fs-button 的配置有冲突时可以配置在此处<br/>比如：n-button 的 text | object               | -      | undefined |
| className   |                                                                                                         | -                    | -      |           |

---
