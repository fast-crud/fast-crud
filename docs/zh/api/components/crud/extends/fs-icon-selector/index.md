# fs-icon-selector

## Props

| Prop name   | Description | Type                | Values | Default                                                                                                                                                                                  |
| ----------- | ----------- | ------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| modelValue  |             | string              | -      | ""                                                                                                                                                                                       |
| dialog      |             | object              | -      | {}                                                                                                                                                                                       |
| tabs        |             | object              | -      | {}                                                                                                                                                                                       |
| limit       |             | number              | -      | 136                                                                                                                                                                                      |
| iconSets    |             | Array&lt;string&gt; | -      | () =&gt; [<br/> "logos",<br/> "fa-brands",<br/> "fa-solid",<br/> "fa-regular",<br/> "carbon",<br/> "ion",<br/> "ant-design",<br/> "mdi",<br/> "twemoji",<br/> "svg-spinners"<br/>]       |
| apiProvider |             | string              | -      | "https://api.iconify.design"                                                                                                                                                             |
| colors      |             | Array&lt;string&gt; | -      | () =&gt; [<br/> "",<br/> "#007AFF",<br/> "#34C759",<br/> "#FF9500",<br/> "#FF3B30",<br/> "#FFCC00",<br/> "#424242",<br/> "#8E8E93",<br/> "#AF52DE",<br/> "#5AC8FA",<br/> "#A2845E"<br/>] |

## Events

| Event name        | Properties | Description |
| ----------------- | ---------- | ----------- |
| update:modelValue |            |

---
