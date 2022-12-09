# FsTimeHumanize

> 日期人性化格式展示组件
> 例如几天前，几分钟前，几个小时前

## Props

| Prop name        | Description                                                               | Type                            | Values | Default                            |
| ---------------- | ------------------------------------------------------------------------- | ------------------------------- | ------ | ---------------------------------- |
| modelValue       | 日期时间值，支持 long,string,date 等，由 dayjs 转化                       | undefined                       | -      | undefined                          |
| valueFormat      | 输入格式化，不传则由 dayjs 自动转化                                       | string                          | -      | undefined                          |
| format           | 日期输出格式化                                                            | string                          | -      | "YYYY-MM-DD HH:mm:ss"              |
| useFormatGreater | 距离时间超过多少毫秒时，直接使用 format 格式，默认大于 3 天后             | number                          | -      | 1000 _ 60 _ 60 _ 24 _ 3            |
| options          | HumanizeDuration 参数<br/>https://github.com/EvanHahn/HumanizeDuration.js | HumanizerOptions                | -      | function() {<br/> return {};<br/>} |
| text             | 前后文本                                                                  | { prev: string; after: string } | -      | function() {<br/> return {};<br/>} |

---
