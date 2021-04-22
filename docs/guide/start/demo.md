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
# 运行 antdv版示例
cd fast-crud/packages/demo-antdv  
# 运行 element版示例
cd fast-crud/packages/demo-element  

npm install  #或者yarn install

npm run dev
```



### 权限管理示例运行
如果想要运行权限管理示例，执行如下命令
```shell script
npm run dev:pm
```
注意：权限管理需要先运行后台，请查看权限管理帮助文档获取更多信息


### 调试运行
如果想要修改`fast-crud`或者`extends-uploader`代码后在示例中热加载  
需要安装`lerna`，执行如下命令
```shell script
git clone https://gitee.com/fast-crud/fast-crud.git
cd fast-crud
npm install lerna -g
lerna bootstrap 

# 运行 antdv版示例
cd fast-crud/packages/demo-antdv  
# 运行 element版示例
cd fast-crud/packages/demo-element  
npm install  #或者yarn install
npm run dev
```
