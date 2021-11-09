# 贡献代码
欢迎各位贡献代码，共同发展fast-crud

## 1. fork仓库
请通过github fork。

## 2. 调试方式运行demo
通过调试方式运行demo，可以在修改`fast-crud`源码后立即在示例中看到效果。

请按如下步骤启动：    
1、 需要先将所有子项目都执行`npm install`
```shell script
# 请将你下面的地址改成你fork后的仓库地址
git clone https://github.com/fast-crud/fast-crud.git
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


## 3. 开发新特性或修复bug
在fast-crud中开发新特性，或修复bug，然后在demo中做相应的示例，有必要时请编写相关文档

## 4. 提交pr
等待review与merge，感谢您对fast-crud的贡献。


