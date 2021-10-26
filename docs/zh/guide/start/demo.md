# 启动DEMO
在开始集成fast-crud到你的项目之前，强烈建议先从运行demo体验一下。

## 目录结构
```
src
  |--packages    
    |-- fast-crud                  //核心工程
    |-- fast-extends               //官方扩展组件
    |-- fast-admin
        |-- fs-admin-antdv         //Antdv版示例工程
        |-- demo-element           //Element版示例工程,后续会改造成fs-admin-element

```

## 运行示例

### 基本示例运行

* 下载源码
```shell
git clone https://gitee.com/fast-crud/fast-crud.git
cd fast-crud
# 同步fast-admin子模块
git submodule update --init --recursive
```

* 运行antdv版示例
```shell
cd packages/fast-admin/fs-admin-antdv
npm install # or yarn instal
npm run dev
#启动成功后打开输出链接即可看到效果
```

* 运行element示例
```shell
cd packages/fast-admin/fs-admin-element
cd fs-admin-element
npm install # or yarn instal
npm run dev
#启动成功后打开输出链接即可看到效果
```



### 调试运行
如果你想要贡献代码，那你肯定想要在修改`fast-crud`源码后立即在示例中看到效果。    

请按如下步骤启动：    
1、 需要先将所有子项目都执行`npm install` 
```shell script
git clone https://gitee.com/fast-crud/fast-crud.git
cd fast-crud
# 同步fast-admin子模块
git submodule update --init --recursive

# 可以通过lerna bootstrap命令一次性全部install
npm install lerna -g
lerna bootstrap

# 或者
# 也可以手动进入fast-crud和fast-extends等子项目目录，一个个单独install
cd ./packages/fast-crud
npm install

cd ./packages/extends/fast-extends
npm install

```

2、 然后debug模式启动

 * 调试antdv版示例
```shell script
# 运行 antdv版示例
cd fast-crud/packages/fs-admin/fs-admin-antdv  
npm install  
#不启用权限模块
npm run debug
#启用权限运行
npm run debug:pm
#启动成功后打开输出链接即可看到效果
```
* 调试element版示例
```shell script
# 运行 element版示例
cd fast-crud/packages/fs-admin/fs-admin-element  
npm install  
#不启用权限模块
npm run debug
#启用权限运行
npm run debug:pm
#启动成功后打开输出链接即可看到效果
```



