## 升级依赖
yarn upgrade //升级依赖小版本
yarn outdated //查看依赖是否有新版本升级
yarn upgrade-interactive --latest //升级依赖大版本

## esbuild  ENOENT 报错问题修复
```shell
#  node_modules\esbuild\esbuild.exe ENOENT
node ./node_modules/esbuild/install.js
```
