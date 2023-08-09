
# FsAdmin

本项目核心为`fast-crud`，需要与`admin`项目结合使用。官方的示例项目就是一个简单的`admin`项目。



## 一、 各版本源码地址
[FsAdminAntdv](https://github.com/fast-crud/fs-admin-antdv)   

[FsAdminElement](https://github.com/fast-crud/fs-admin-element)

[FsAdminNaiveUi](https://github.com/fast-crud/fs-admin-naive-ui)


::: tip    
以下帮助说明仅针对`FsAdminAntdv` 和`FsAdminElement`     
`FsAdminNaiveUi`的使用文档请参考原项目文档：[naive-admin](https://www.naiveadmin.com/home)   
::: 

## 二、启动运行方法

请前往 [start](../guide/start/demo.md)

## 三、路由与菜单
`/src/router/source/modules` 目录下配置，每一项具备路由和菜单的双重功能

```js
const routeItem = {
    title: "基本特性",//路由或菜单标题
    name: "basis",//路由名称
    path: "/crud/basis", //路由路径
    redirect: "/crud/basis/i18n",//路由跳转
    meta: { //额外的配置
        "cache": true, //是否缓存页面
        "isMenu": true, //是否是菜单，=false则为纯路由配置，不在左侧菜单显示
        "icon": "ion:disc-outline", //菜单图标
        auth: true, //是否需要登录
        permission:"sys:user:read" //权限标识
    },
    children: []//子路由
}
```

## 四、 Tabs页签

tabs页签由 [pageStore](https://github.com/fast-crud/fs-admin-antdv/blob/main/src/store/modules/page.ts) 控制

```js
const pageStore = usePageStore();

/**
 * @class opened
 * @description 新增一个 tag (打开一个页面)
 * @param {Object} context
 * @param {Object} payload new tag info
 */
pageStore.add({ tag, params, query, fullPath })
/**
 * @class current
 * @description 打开一个新的页面
 * @param {Object} context
 * @param {Object} payload 从路由钩子的 to 对象上获取 { name, params, query, fullPath, meta } 路由信息
 */
pageStore.open({ name, params, query, fullPath, meta })

/**
 * @class opened
 * @description 关闭一个 tag (关闭一个页面)
 * @param {Object} context
 * @param {Object} payload { tagName: 要关闭的标签名字 }
 */
pageStore.close({ tagName });
/**
 * @class opened
 * @description 关闭当前标签右边的标签
 * @param opts
 */
pageStore.closeRight(opts = {})
/**
 * @class opened
 * @description 关闭当前标签右边的标签
 * @param opts
 */
pageStore.closeRight(opts = {})

/**
 * @class opened
 * @description 关闭当前激活之外的 tag
 * @param opts
 */
pageStore.closeOther()

/**
 * @class opened
 * @description 关闭所有 tag
 * @param {Object} context
 */
pageStore.closeAll()

/**
 * @class keepAlive
 * @description 从已经打开的页面记录中更新需要缓存的页面记录
 * @param {Object} state state
 */
pageStore.keepAliveRefresh()
```
## 五、页面缓存

页面缓存的效果是：切换页面tabs标签，回到之前打开过的页面，不会重新加载页面数据。

要实现页面缓存需要同时满足以下两个条件：

* 页面组件需要有 name 属性并且 name 属性的值要与当前页面在路由信息中的 name 字段一致。
* 页面路由设置中要指定 `meta: { cache: true }`


下面是两段示例代码,注意箭头指向的行。    
页面组件：
```vue
<template>
  <fs-page>
    我会被缓存
  </fs-page>
</template>

<script>
export default {
  name: 'foo-page'      // <----------- 注意这里，要和router一致
}
</script>

```
该页面组件在路由中的数据：
```js
const routeItem = {
    path: '/foo/page',
    name: 'foo-page',   // <----------- 注意这里，要和上面一致
    meta: {
        title: '这是一个会被缓存的页面',
        cache: true     // <----------- 注意这里，要设置为true
    },
    component: () => import('page/foo/page.vue')
}
```

## 六、 国际化

请参考 [i18n](../guide/start/i18n.md)

## 七、 图标
请参考 [icon](../guide/start/icon.md)

## 八、主题颜色
暂不支持


## 九、快速开始
本教程演示如何将FsAdmin原始版本改成对接你的后台。

### 1、clone代码，本地启动

```shell
git clone https://github.com/fast-crud/fs-admin-antdv
cd fs-admin-antdv
pnpm install
npm run dev
```

### 2. 修改配置文件
.env文件修改
```shell
VITE_APP_API=/api         #<------修改请求接口前缀  
#登录与权限关闭
VITE_APP_PM_ENABLED=true  #<------设置为true，启用登录请求与权限管理
```

### 3. 修改后端ip和端口

#### 3.1 开发环境
```js
//修改 vite.config.ts
export function (){
    return {
        ...
            server: {
                proxy: {
                // with options
                "/api": {
                    //  修改为你的本地后端服务地址↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
                    target: "http://127.0.0.1:7001"
                }
            }
        }
    };
}

```

#### 3.2 生产环境
```shell
# 修改 .env.production 文件
# 改为你的后端生产环境地址↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
VITE_APP_API=http://www.docmirror.cn:7001/api
```


### 4、禁用mock

```js
// main.ts
import plugin from "./plugin/";
// 正式项目请删除mock，避免影响性能
// import "./mock";   //<---------注释掉这行

```
### 5、 api请求改成真实后端

```js
import { requestForMock } from "../../../api/service";
// 改成请求真实后端 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
import { request } from "../../../api/service";
```

### 6. 修改登录接口
`src/api/modules/api.user.ts`

```js
export async function login(data: LoginReq): Promise<LoginRes> {
    // ...
    //如果开启了登录与权限模块，则真实登录
    return await request({
        url: "/login",              // <------修改成你的登录地址，和登录参数
        method: "post",
        data
    });
}
```
### 7. 修改 FastCrud公共配置
根据集成文档修改transform配置    
修改 `src/plugins/fast_crud.ts` 处
```js
common(){
   return {
       request:{
           transformQuery(query){
               //这里将query转换为你后台查询请求格式
           },
           transformRes(){
               //这里将后台返回的数据转换为FastCrud的格式
           }
       }
   } 
}
```
