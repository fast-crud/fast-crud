# 基于配置

本章主要介绍`fast-crud`的初始化过程（将简单配置初始化为fs-crud组件所需要的配置）

## fs-crud组件

在开发CRUD时，我们页面里面用的组件是`fs-crud`，`crudBinding`就是传入的全部参数

```html

<template>
    <fs-crud ref="crudRef" v-bind="crudBinding"/>
</template>
```

具体`fs-crud`需要哪些参数，请查看[fs-crud组件的参数](/api/components/crud/fs-crud)

所以我们主要看怎么由`crudOptions`转变成`crudBinding`的

### 1.crudBinding 包含哪些配置

下面以仅有一个`status`字段的`crud`举例    
如下是`fs-crud`需要的最终配置，将如下配置传入`fs-crud`就可以渲染出一套crud页面来

```js
const crudBinding = {
    columns: { //单元格的配置
        status: {//配置单元格用values-format显示
            title: '状态',
            key: 'status',
            component: {
                name: 'fs-values-format',
                dict: dict({url: 'dicts/statusEnums'})
            }
        }
    },
    addForm: {
        columns: {
            status: {
                title: '状态', //【与单元格的title重复，可简化】
                compnent: {
                    name: 'fs-dict-select', //添加时使用选择框
                    dict: dict({url: 'dicts/statusEnums'})
                }
            }
        },
        rules: {...}
    },
    editForm: {
        columns: {
            status: {...}
        },
        rules: {status: {...}}
    },
    viewForm: {
        columns: {
            status: {...}
        },
        rules: {status: {...}}
    },
    search: {
        columns: {
            status: {...}
        },
    },
    
}
```
