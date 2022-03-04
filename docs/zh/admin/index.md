
# FsAdmin

本项目核心为`fast-crud`，需要与`admin`项目结合使用。官方的示例项目就是一个简单的`admin`项目。


## 各版本源码地址
[FsAdminAntdv](https://github.com/fast-crud/fs-admin-antdv)   

[FsAdminElement](https://github.com/fast-crud/fs-admin-element)

[FsAdminNaiveUi](https://github.com/fast-crud/fs-admin-naive-ui)


## 启动方法

请前往 [start](../guide/start/demo.md)

## 路由与菜单
`/src/router/source/` 目录下配置，每一项具备路由和菜单的双重功能

```json5
{
        title: "基本特性", //路由或菜单标题
        name: "basis", //路由名称
        path: "/crud/basis", //路由路径
        redirect: "/crud/basis/i18n", //路由跳转
        meta: {
          isMenu: true, //是否是菜单，=false则为纯路由配置，不在左侧菜单显示
          icon: "ion:disc-outline" //菜单图标
        },
        children: [] //子路由
}
```

## Api请求

api请求采用axios模块

```js
// mock请求
import { requestForMock } from "/src/api/service";
// 真实后端请求
import { request } from "/src/api/service";
```

## mock
示例项目默认为mock数据

如果要改成请求真实后端，请按如下步骤修改
### 1、requestForMock改成request
```js
import { requestForMock } from "../../../api/service";
// 改成请求真实后端 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
import { request } from "../../../api/service";
```

### 2. 修改ip和端口

#### 2.1 开发环境
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

#### 2.2 生产环境
```shell
# 修改 .env.production 文件
# 改为你的后端生产环境地址↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
VITE_APP_API=http://www.docmirror.cn:7001/api
```

## Tabs页签

## 国际化

## 图标

## 主题颜色
