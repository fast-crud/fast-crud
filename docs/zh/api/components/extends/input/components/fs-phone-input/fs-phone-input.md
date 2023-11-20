# fs-phone-input

## Props

| Prop name         | Description  | Type                                                                             | Values | Default |
| ----------------- | ------------ | -------------------------------------------------------------------------------- | ------ | ------- |
| select            | 选择框参数   | {<br/> width?: string;<br/> placeholder?: string;<br/> [key: string]: any;<br/>} | -      |         |
| input             | 号码框参数   | {<br/> placeholder?: string;<br/> [key: string]: any;<br/>}                      | -      |         |
| modelValue        | 输入输出值   | PhoneInputValue                                                                  | -      |         |
| onlyCountries     | 仅限哪些国家 | Array                                                                            | -      |         |
| ignoredCountries  | 忽略哪些国家 | Array                                                                            | -      |         |
| priorityCountries | 优先哪些国家 | Array                                                                            | -      |         |
| clearable         |              | boolean                                                                          | -      |         |
| filterable        |              | boolean                                                                          | -      |         |
| defaultCountry    | 默认国家     | string                                                                           | -      | "CN"    |
| disabled          |              | boolean                                                                          | -      |         |
| readonly          |              | boolean                                                                          | -      |         |

## Events

| Event name        | Properties | Description |
| ----------------- | ---------- | ----------- |
| change            |            |
| input             |            |
| update:modelValue |            |

---
