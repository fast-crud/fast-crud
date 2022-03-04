# 启动DEMO

::: tip

在开始集成fast-crud到你的项目之前，强烈建议先从运行demo体验一下。

:::
## 目录结构
```
src
  |--packages    
    |-- fast-crud                  //核心工程
    |-- fast-extends               //官方扩展组件
    |-- fast-admin                 //fs-admin各个版本的submodule
        |-- fs-admin-antdv         //Antdv版示例工程：https://gitee.com/fast-crud/fs-admin-antdv.git
        |-- fs-admin-element       //ElementPlus版示例工程：https://gitee.com/fast-crud/fs-admin-element.git
        |-- fs-admin-naive-ui      //NaiveUI版示例工程:https://gitee.com/fast-crud/fs-admin-naive-ui.git
    |-- ui                         //UI适配
```

## 运行示例

### 基本示例运行

* 运行antdv版示例
```shell
git clone https://gitee.com/fast-crud/fs-admin-antdv.git
cd fs-admin-antdv
npm install # or yarn install
npm run dev
#启动成功后打开输出链接即可看到效果
```

* 运行element示例
```shell
git clone https://gitee.com/fast-crud/fs-admin-element.git
cd fs-admin-element
npm install # or yarn install
npm run dev
#启动成功后打开输出链接即可看到效果
```

* 运行NaiveUI示例
```shell
git clone https://gitee.com/fast-crud/fs-admin-naive-ui.git
cd fs-admin-naive-ui
npm install # or yarn install
npm run dev
#启动成功后打开输出链接即可看到效果
```


### 带权限模式运行

目前仅 fs-admin-element 、fs-admin-antdv支持
```shell
npm run dev:pm
```

同时您需要启动后台
 
后台项目地址： https://github.com/fast-crud/fs-server-js    
gitee： https://gitee.com/fast-crud/fs-server-js

如果需要连接你自己的权限管理接口，则需要按你自己的情况做适配改造

### 调试运行
如果你想要贡献代码，那你肯定想要在修改`fast-crud`源码后立即在示例中看到效果。    

[本章节内容已移至贡献代码章节](../other/contribution.md)


### 更多

更多关于示例的相关说明：请前往[fs-admin](../../admin/index.md)
