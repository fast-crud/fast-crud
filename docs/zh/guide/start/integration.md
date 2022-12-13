# 集成到你的项目中

接下来介绍如何将`fast-crud`集成到你的`vue3`项目中

## 集成步骤

::: tip

在开始着手集成之前，如果你还没有运行过demo，建议您先运行demo项目，在里面[开发一个crud](./first)感受一下

:::

### 1.准备vue3项目
如果你还没有vue3项目，可以根据[vitejs的教程创建一个](http://www.vitejs.net/guide/#scaffolding-your-first-vite-project)

```shell
npm install -g pnpm
pnpm create vite my-vue-app -- --template vue
```

### 2.安装依赖

```shell script
#安装fast-crud
cd my-vue-app
pnpm i  @fast-crud/fast-crud
pnpm i  @fast-crud/fast-extends

#安装ui，根据你选择的基础组件 三选一
# element-plus
pnpm i  element-plus
pnpm i  @fast-crud/ui-element
# or antdv
pnpm i  ant-design-vue
pnpm i  @fast-crud/ui-antdv
# or naive-ui
pnpm i  naive-ui
pnpm i  @fast-crud/ui-naive


```
### 3.安装基础组件
此部分的安装需要参考对应的ui库文档    

```js
//安装基础组件,三选一
// element 
import ElementPlus from 'element-plus'
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
import "dayjs/locale/zh-cn";
app.use(ElementPlus,{size:"small",locale: zhCn})
// 或者 antdv 
import Antdv from 'ant-design-vue'
import "ant-design-vue/dist/antd.less";
app.use(Antdv)
// 或者 naive
import Naive from 'naive-ui'
app.use(Naive)
```
### 4.引入

 ```javascript
// 引入fast-crud
import {FastCrud} from "@fast-crud/fast-crud";
import "@fast-crud/fast-crud/dist/style.css";

// 请选择ui: element/ antdv /naive。三选一，不支持动态切换
// element 
import ui from "@fast-crud/ui-element";
// antdv 
import ui from "@fast-crud/ui-antdv";
// naive 
import ui from "@fast-crud/ui-naive";

// 先安装ui
app.use(ui); 
// 然后安装FastCrud
app.use(FastCrud, {
    i18n, //i18n配置，可选，默认使用中文，具体用法请看demo里的 src/i18n/index.js 文件
    // 此处配置公共的dictRequest（字典请求）
    async dictRequest({ dict }) {
        return await request({ url: dict.url }); //根据dict的url，异步返回一个字典数组
    },
    //公共crud配置
    commonOptions() {
        return {
            request:{
                //接口请求配置
                //你项目后台接口大概率与fast-crud所需要的返回结构不一致，所以需要配置此项
                //请参考文档http://fast-crud.docmirror.cn/api/crud-options/request.html
                transformQuery: ({ page, form, sort }) => {
                    //转换为你pageRequest所需要的请求参数结构
                    return {page, form, sort};
                },
                transformRes: ({ res }) => {
                    //将pageRequest的返回数据，转换为fast-crud所需要的格式
                    //return {records,currentPage,pageSize,total};
                    return  {...res}
                }
            },
            ... //你可以在此处配置你的其他crudOptions公共配置
        };
    },
});
 ```


:::warning
你后台接口返回的数据大概率与fast-crud所需要的数据结构是不一致的，所以你需要配置公共的`request`       
具体请参考[request配置](/api/crud-options/request.html)    
:::

### 5. NaiveUi的额外操作
如果你不使用naiveui，可以跳过此步骤    
NaiveUI需要在合适的位置（比如App.vue）使用`<fs-ui-context>`,`fs-ui-context`必须处于`message、notification、dialog等provider`之下。        
主要是让fs-crud拥有`message、notification、dialog`的能力    

```js
// App.vue
 <n-dialog-provider>
    <n-notification-provider>
        <n-message-provider>
            <fs-ui-context>   《《《《---------------这里
                <RouterView />
            </fs-ui-context>
        </n-message-provider>
    </n-notification-provider>
</n-dialog-provider>
```


### 6. 安装扩展组件

如果你还需要文件上传、图片裁剪等组件   
那么你还需要安装对应的扩展插件。

以下为文件上传、图片裁剪、富文本编辑器等扩展组件安装示例
```
npm install @fast-crud/fast-extends
```
```js
import { FsExtendsUploader,FsExtendsEditor } from "@fast-crud/fast-extends";
import "@fast-crud/fast-extends/dist/style.css";
//文件上传
app.use(FsExtendsUploader, {
    defaultType: "cos",
    // 上传实现的配置，你使用哪一个就配置哪一个即可
    cos: {},
    alioss: {},
    qiniu: {},
    form: {},
});
//富文本编辑器
app.use(FsExtendsEditor, {
    //富文本编辑器的公共配置
    wangEditor:{}
});
```
扩展组件文档请参考[fast-extends](../advance/extends.md)

### 7. 完成
现在`fast-crud`已经集成到你的项目中，你可以按照上一节学习的，在你的实际项目里开始你的crud开发了。

::: warning
注意:你必须让`<fs-crud></fs-crud>`外部容器具备高度，如果看不到表格你可以先给`fs-crud`设置一个`height="800px"`看看效果。
:::

### 8. 写一个 hello world
以下是一个简单的示例页面，你可以直接复制粘贴到`HelloWorld.vue`，将其添加到路由中打开，即可看到测试效果
```vue
<template>
  <fs-page>
    <fs-crud ref="crudRef" v-bind="crudBinding" />
  </fs-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useCrud } from "@fast-crud/fast-crud";
import { useExpose } from "@fast-crud/fast-crud";
import _ from 'lodash-es'

//此处为crudOptions配置
const createCrudOptions = function ({ expose }) {
  const records = [{id:1,name:'Hello World'}]
  const pageRequest = async (query) => {
    return {
      records, currentPage:1,pageSize:20,total:records.length
    }
  };
  const editRequest = async ({ form, row }) => {
    const target = _.find(records,item=>{return row.id === item.id})
    _.merge(target,form)
    return target;
  };
  const delRequest = async ({ row }) => {
    _.remove(records,item=>{return item.id === row.id})
  };

  const addRequest = async ({ form }) => {
    const maxRecord = _.maxBy(records,item=>{return item.id})
    form.id = (maxRecord?.id||0)+1
    records.push(form)
    return form
  };
  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest
      },
      columns: {
        name: {
          title: "姓名",
          type: "text",
          search: {show: true},
          form: {
            component: {
              maxlength: 20
            }
          }
        },
      }
    }
  };
}

//此处为组件定义
export default defineComponent({
  name: "HelloWorld",
  setup() {
    // crud组件的ref
    const crudRef = ref();
    // crud 配置的ref
    const crudBinding = ref();
    // 暴露的方法
    const { expose } = useExpose({ crudRef, crudBinding });
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
      crudRef
    };
  }
});
</script>
```


## starter
自己手动集成挺麻烦的？以下提供了当下流行的`admin`框架与`fast-crud`集成好的`starter`，开箱即用

* [脚手架项目列表](http://fast-crud.docmirror.cn/demo/#二、admin脚手架starter)  
