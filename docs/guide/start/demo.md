# 启动DEMO
在开始集成fast-crud到你的项目之前，强烈建议先从运行demo开始，在demo里面先写一个crud来感受一下

## 目录结构
```
src
  |--packages    
    |-- fast-crud                  //核心工程
    |-- fast-crud-extends          //扩展组件
    |-- fast-crud-antdv            //Antdv版示例工程
    |-- fast-crud-element          //Element版示例工程

```

## 运行示例

### 基本示例运行
执行如下命令即可运行示例项目
```shell script
git clone https://gitee.com/fast-crud/fast-crud.git
# 运行 antdv版示例
cd fast-crud/packages/fast-crud-antdv  
# 运行 element版示例
cd fast-crud/packages/fast-crud-element  

npm install  #或者yarn install

npm run dev
```



### 权限管理示例运行
如果想要运行权限管理示例，执行如下命令
```shell script
npm run dev:pm
```
注意：权限管理需要先运行后台，请查看[权限管理帮助文档](./permission.md)获取更多信息


### 调试运行
如果想要修改`fast-crud`或者`fast-crud-extends`代码后在示例中热加载  
需要安装`lerna`，执行如下命令
```shell script
git clone https://gitee.com/fast-crud/fast-crud.git
cd fast-crud
npm install lerna -g
lerna bootstrap #link

# 运行 antdv版示例
cd fast-crud/packages/fast-crud-antdv  
# 运行 element版示例
cd fast-crud/packages/fast-crud-element  
npm install  #或者yarn install
npm run dev
```

::: tip
可以脱离d2-admin使用在其他项目中
运行以下命令可以启动一个无其他依赖示例
```
cd /src/packages/d2-crud-plus
npm install
npm run dev
```
:::
