# 启动DEMO
在开始集成fast-crud到你的项目之前，强烈建议先从运行demo体验一下。

## 目录结构
```
src
  |--packages    
    |-- fast-crud                  //核心工程
    |-- extends                    //扩展组件
        |-- extends-uploader       //上传组件扩展
    |-- demo-antdv                 //Antdv版示例工程
    |-- demo-element               //Element版示例工程

```

## 运行示例

### 基本示例运行
执行如下命令即可运行示例项目
```shell script
git clone https://gitee.com/fast-crud/fast-crud.git
cd fast-crud
# 更新fs-admin子模块
npm run init

# 运行 antdv版示例,请进入fs-admin-antdv 目录
cd fast-crud/packages/fs-admin/fs-admin-antdv  
# 运行 element版示例，请进入demo-element目录
cd fast-crud/packages/demo-element  

# 启动demo
npm install  #或者yarn install
npm run dev
```

### 调试运行
如果你想要贡献代码，那你肯定想要在修改`fast-crud`源码后立即在示例中看到效果。    

请按如下步骤启动：    
1、 需要先将所有子项目都执行`npm install` 
```shell script
git clone https://gitee.com/fast-crud/fast-crud.git
cd fast-crud
# 可以通过lerna bootstrap命令一次性全部install
# 安装lerna
npm install lerna -g
# 通过bootstrap命令将fast-crud和extends-uploader
lerna bootstrap

# 也可以手动进入fast-crud和extends-xxx目录，一个个单独install
cd ./packages/fast-crud
npm install

cd ./packages/extends/extends-uploader
npm install

```

2、 然后debug模式启动

 * 运行 antdv版示例
```shell script
# 运行 antdv版示例
cd fast-crud/packages/fs-admin/fs-admin-antdv  
#如果第一步执行过，就无需再执行
npm install  
#不启用权限模块
npm run debug
#启用权限
npm run debug:pm

```
* 运行 element版示例
```shell script
# 运行 antdv版示例
cd fast-crud/packages/demo-element  
#如果第一步执行过，就无需再执行
npm install  
npm run debug

```



