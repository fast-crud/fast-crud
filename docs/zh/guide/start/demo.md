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


### 调试运行
如果你想要贡献代码，那你肯定想要在修改`fast-crud`源码后立即在示例中看到效果。    

[本章节内容已移至贡献代码章节](../other/contribution.md)
