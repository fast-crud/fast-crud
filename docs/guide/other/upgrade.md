# 版本升级
## 命令行升级
项目根目录下执行如下命令即可升级`fast-crud`到最新版本
```
#使用npm
npm update

#或使用yarn 
yarn upgrade
```

## 手动升级

修改`package.json`的`dependencies`如下依赖包的版本号    
然后执行`npm install` 或 `yarn install` 即可
   
* @fast-crud/fast-crud:xxx
* @fast-crud/extends-uploader:xxx

> 具体的版本号请查看`changelog`

## 其他命令参考
```shell script
yarn upgrade //升级依赖小版本
yarn outdated //查看依赖是否有新版本升级
yarn upgrade-interactive --latest //升级依赖大版本
```
