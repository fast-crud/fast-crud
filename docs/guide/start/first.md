# 第一个CRUD
接下来介绍如何开发你的第一个CRUD     
强烈建议先从运行demo开始，在demo里面写一个crud来感受一下
## 在demo里面开发一个crud


进入到demo目录下`packages/fast-crud-antdv` 或 `packages/fast-crud-element`

一个crud主要分为3个部分
* crud.js：     crud配置
* index.vue：   页面组件
* api.js：      接口

### 1. crud.js
crud配置，每个crud最大的不同就在于此文件。     
将如下代码保存为`views/test/myFirstCrud/crud.js`

```js
// crud.js
import * as api from "./api";
import { dict } from "@fast-crud/fast-crud";
export default function ({ expose }) {
    const pageRequest = async (query) => {
        return await api.GetList(query);
    };
    const editRequest = async ({ form, row }) => {
        form.id = row.id;
        return await api.UpdateObj(form);
    };
    const delRequest = async (id) => {
        return await api.DelObj(id);
    };

    const addRequest = async ({ form }) => {
        return await api.AddObj(form);
    };
    return {
        crudOptions: {
            request: {
                pageRequest,
                addRequest,
                editRequest,
                delRequest,
            },
            columns: {
                radio: {
                    title: "状态",
                    search: { show: true },
                    type: "dict-radio",
                    dict: dict({
                        url: "/dicts/OpenStatusEnum",
                    }),
                },
                text: {
                    title: "测试",
                    search: { show: true },
                    type: "text"
                },
                // 你可以尝试在此处增加更多字段
            },
        },
    };
}

``` 
::: tip    
你可以尝试在 `crudOptions.columns`下添加更多字段
:::

### 2. index.vue
页面组件内容都一样，实际开发中，直接复制，修改一下name即可      
将如下代码保存为`views/test/myFirstCrud/index.vue`
```html
<template>
    <fs-crud ref="crudRef" v-bind="crudBinding" />
</template>

<script>
    import { defineComponent, ref, onMounted } from "vue";
    import createCrudOptions from "./crud";
    import { useExpose, useCrud } from "@fast-crud/fast-crud";
    export default defineComponent({
        name: "MyFirstCrud", // 实际开发中可以修改一下name
        setup() {
            // crud组件的ref
            const crudRef = ref();
            // crud 配置的ref
            const crudBinding = ref();
            // 暴露的方法
            const expose = useExpose({ crudRef, crudBinding });
            // 你的crud配置
            const { crudOptions } = createCrudOptions({ expose });
            // 初始化crud配置
            // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
            const { resetCrudOptions } = useCrud({ expose, crudOptions });
            // 你可以调用此方法，重新初始化crud配置
            // resetCrudOptions(options)
            // 页面打开后获取列表数据
            onMounted(() => {
                expose.doRefresh();
            });
            return {
                crudBinding,
                crudRef,
            };
        },
    });
</script>
``` 
### 3.  api.js
实现添删改查请求接口，实际开发中，复制后修改url即可，你也可以根据实际业务需求增加和修改方法     
将如下代码保存为`views/test/myFirstCrud/api.js`
```javascript
// api.js

// 如下为mock请求，实际开发中需要替换为你的真实后端请求方法
import { requestForMock } from "../../../api/service";

const request = requestForMock;
const apiPrefix = "/MyFirstCrud";

export function GetList(query) {
    return request({
        url: apiPrefix + "/page",
        method: "get",
        data: query,
    });
}

export function AddObj(obj) {
    return request({
        url: apiPrefix + "/add",
        method: "post",
        data: obj,
    });
}

export function UpdateObj(obj) {
    return request({
        url: apiPrefix + "/update",
        method: "post",
        data: obj,
    });
}

export function DelObj(id) {
    return request({
        url: apiPrefix + "/delete",
        method: "post",
        params: { id },
    });
}

export function GetObj(id) {
    return request({
        url: apiPrefix + "/info",
        method: "get",
        params: { id },
    });
}

```  
### 4. mock数据
如下为mock数据，实际开发中需要替换为你的真实后端接口    
将如下代码保存为`views/test/myFirstCrud/mock.js`
```js
// mock.js
import mockUtil from "/src/mock/base";
const options = {
  name: "MyFirstCrud",
  idGenerator: 0,
};
const list = [
  {
    radio: "1",
  },
  {
    radio: "2",
  },
  {
    radio: "0",
  },
];
options.list = list;
const mock = mockUtil.buildMock(options);
export default mock;

```

### 5.  添加路由和菜单
在`src/router/resources.js`中增加路由菜单配置
```js
// src/router/resources.js
const resources = [
  {
    title: "myFirstCrud",
    name: "myFirstCrud",
    path: "/test/myFirstCrud",
    component: "/test/myFirstCrud.vue"
  }
]
```

### 6. 看看效果

启动demo，访问`myFirstCrud`查看效果 

恭喜你，你已经完成了第一个crud功能的开发


## 实际项目中开发CRUD

在实际项目开发中，通常在`示例`的`views`中找一个合适的crud复制到你的项目的`views`，然后再根据需求修改即可    
::: warning
需要修改api.js的`requestForMock`为`request`，这样才会去调用你的真实后端接口
:::
