# fs-table-columns-filter

## Props

| Prop name       | Description                      | Type                                                                                                                                      | Values | Default                                                                  |
| --------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------ |
| container       | 布局容器组件配置                 | intersection                                                                                                                              | -      | () =&gt; {<br/> return { is: "fs-columns-filter-layout-default" };<br/>} |
| is              | 列配置组件名称                   | union                                                                                                                                     | -      |                                                                          |
| show            | 是否显示列设置抽屉               | boolean                                                                                                                                   | -      |                                                                          |
| mode            | 模式，default,simple             | string                                                                                                                                    | -      | "default"                                                                |
| columns         | 列数据                           | TableColumnsProps                                                                                                                         | -      |                                                                          |
| originalColumns | 原始列数据，还原成此列表         | TableColumnsProps                                                                                                                         | -      |                                                                          |
| storage         | 是否保存设置                     | union                                                                                                                                     | -      | true                                                                     |
| text            | 文本设置                         | {<br/> title?: string;<br/> fixed?: string;<br/> order?: string;<br/> reset?: string;<br/> confirm?: string;<br/> unnamed?: string;<br/>} | -      |                                                                          |
| onReset         | 重置事件                         | TSFunctionType                                                                                                                            | -      |                                                                          |
| onSubmit        | 保存事件<br/>`@params` undefined | TSFunctionType                                                                                                                            | -      |                                                                          |

## Events

| Event name     | Properties | Description |
| -------------- | ---------- | ----------- |
| update:columns |            |
| update:show    |            |
| reset          |            |
| submit         |            |

## Expose

### start

>

### save

>

### update

>

### original

>

### columns

>

---
