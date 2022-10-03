# 权限控制
fs-admin示例项目集成了RBAC权限管理模块

[antdv版权限管理示例](http://fast-crud.docmirror.cn/antdv/#/sys/authority/user) / [element版权限管理示例](http://fast-crud.docmirror.cn/element/#/sys/authority/user)


## 一、运行权限管理示例

### 1. 启动后端
[fs-server-js](https://github.com/fast-crud/fs-server-js) 是一套基于midway的nodejs后台web服务框架    

特性：   
1. 基于midway，类似springmvc的开发体验
2. 支持数据库自动版本升级
3. 多数据库支持


#### 1.1 克隆后端代码
```shell
git clone https://github.com/fast-crud/fs-server-js
```

#### 1.2 安装依赖

```shell
cd fs-serer-js
npm install -y pnpm
pnpm install
```

#### 1.3 启动服务
```shell
npm run dev
```
> 输出如下，则表示启动成功   
> [ Midway ] Start Server at  http://127.0.0.1:7001   
> [ Midway ] Start on LAN http://192.168.3.35:7001    
> 
> 访问以上链接：将显示 `Hello Midwayjs!`


### 2. 将fs-admin-xx以权限模式启动

#### 2.1 克隆fs-admin-xx仓库

```shell
git clone https://github.com/fast-crud/fs-admin-antdv
#或者
git clone https://github.com/fast-crud/fs-admin-element
```


#### 2.2 权限模式启动
```shell
cd fs-admin-antdv
yarn install
npm run dev:pm

# 或者
# 修改.env文件：VITE_APP_PM_ENABLED=true
yarn install
npm run dev
```
#### 2.3 权限管理测试

您可以访问fs-admin的地址测试权限管理模块了        
* 登录 admin/123456 可以查看全部菜单，拥有全部功能  
* 登录 readonly/123456 只能查看，不能编辑     
系统默认数据不允许修改，如需体验，请自行添加数据进行测试    



### 二、 权限执行过程说明

1. [注册路由守卫](https://gitee.com/fast-crud/fs-admin-antdv/blob/main/src/plugin/permission/hook.ts)，在第一次打开路由时，判断是否已经加载权限
2. 如果已登录且没有加载过权限，则先加载权限并解析，然后放到`permissionStore`中
3. 在菜单和crud使用中，通过`usePermission`进行权限控制


## 三、权限控制

### 菜单控制
给菜单`meta.permission`配置权限代码即可
```js
 menuItem = {
    "title": "角色管理",
    "name": "role",
    "meta": {
      "permission": "sys:auth:role:view"  //在此处配置权限代码
    }
}
```
::: warning
与d2-crud-plus的权限示例不同的是: 菜单数据在本地配置，后端只需返回权限
:::

### crud按钮控制

#### 通过permission前缀统一配置
您可以在`index.vue` 中`useCrud` 时传入`permission`前缀即可，自动给`add/edit/remove/view`等按钮自动加上权限配置
```js
// 你的crud配置
const { crudOptions } = createCrudOptions({ expose });
// 此处传入权限前缀进行通用按钮权限设置，会通过commonOptions去设置actionbar和rowHandle的按钮的show属性
useCrud({ expose, crudOptions, permission: "sys:auth:user" });
// 注意这里只需配置前缀 -------------------------↑↑↑↑↑↑↑↑↑↑
// 例如会给添加按钮加上`sys:auth:user:add`的权限判断，如果无权限则不显示
// 批量设置过程请参考； https://gitee.com/fast-crud/fs-admin-antdv/blob/main/src/plugin/permission/use-crud-permission.ts#L8
```


#### 通过crudOptions配置

```js
import { usePermission } from "/@/plugin/permission";

export default function ({ expose }) {
    const { hasPermissions, requirePermissions } = usePermission();
    const curdOptions = {
        actionsbar: {
            buttons: {
                add: {
                    show: hasPermission("sys:auth:user:add")
                }
            }
        }
    }
}
```


### 代码控制
通过 `usePermission` 提供两个方法用于判断是否有对应权限

```js
import { usePermission } from "/@/plugin/permission";
export default defineComponent({
    setup() {
        const { hasPermissions, requirePermissions } = usePermission();
        if(hasPermissions('sys:auth:user:add')){ //支持数组
            console.log("您拥有添加权限")
        }

        function doAdd(){
            auth.requirePermissions('sys:auth:user:add') //如果没有相应权限直接抛异常
        }
    }
})
```

### 按钮控制
```html
<!-- 需要在setup中导出hasPermission方法 -->
<a-button v-if="hasPermission('sys:auth:user:add')">添加角色</a-button>
```



## 三、集成permission模块到你的项目

权限管理模块，位于`fs-admin-xx`中`/src/plugin/permission`下。

1. 复制 `/src/plugin/permission` 和 `/src/utils/util.mitt.ts` 到你的admin项目中
2. 安装permission模块
```js
import permission from "/src/plugin/permission";
app.use(permission);
```
3. 在登出时发射注销事件，以便清空权限缓存
```js
import { mitter } from "/@/utils/util.mitt";

function logout(){
    // ... 你的注销逻辑
    mitter.emit("app.logout");
}

```

4. 适配你的后端权限接口

修改 `permission/api.ts`
```js
import { request } from "/src/api/service";
export async function getPermissions() {
    // 请求你的后端接口，获取权限列表
    const ret = await request({
        url: "/sys/authority/user/permissions",
        method: "post"
    });
    return ret; //格式为：[{permission:'sys:auth:user:add'},{permission:'sys:auth:user:edit'},....]
}
```


