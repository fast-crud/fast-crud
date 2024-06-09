# 贡献代码
欢迎各位贡献代码，共同发展fast-crud

## 1. fork仓库
请通过github fork。
```
github fork 
https://github.com/fast-crud/fast-crud
```
     

## 2. 调试方式运行demo
通过调试方式运行demo，可以在修改`fast-crud`源码后立即在示例中看到效果。

请按如下步骤启动：    
1、 需要先将所有子项目都执行`pnpm install`
```shell script
# 请将你下面的地址改成你fork后的仓库地址
git clone https://github.com/your_name/fast-crud.git
cd fast-crud
# 同步fast-admin子模块
git submodule update --init --recursive
# 通过pnpm命令一次性全部install
npm install -g pnpm@8.15.7 # 如果没有安装pnpm，则需要先安装, 注意9.x版本的pnpm有bug，安装依赖会卡住
pnpm install

```

2、 然后debug模式启动
* 调试antdv4版示例
```shell script
# 运行 antdv4版示例
cd fast-crud/packages/fs-admin/fs-admin-antdv4  
#不启用权限模块
npm run debug
#启用权限模块运行
npm run debug:pm
#启动成功后打开输出链接即可看到效果
```

* 调试element版示例
```shell script
# 运行 element版示例
cd fast-crud/packages/fs-admin/fs-admin-element  
#不启用权限模块
npm run debug
#启用权限模块运行
npm run debug:pm
#启动成功后打开输出链接即可看到效果
```

* 调试naive版示例
```shell script
# 运行 element版示例
cd fast-crud/packages/fs-admin/fs-admin-naive-ui  
# 启动
npm run debug
#启动成功后打开输出链接即可看到效果
```

## 3. 开发新特性或修复bug

此时你可以在`fast-crud`中开发新特性，或修复`bug`，然后在`demo`中做相应的示例，有必要时请编写相关文档

## 4. 提交pr
等待`review`与`merge`，感谢您对`fast-crud`的贡献。


