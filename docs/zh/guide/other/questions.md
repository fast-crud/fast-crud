# 疑难问题

## esbuild ENOENT 报错
运行 `npm run dev` 时 出现 `node_modules\esbuild\esbuild.exe ENOENT`
```shell
# 项目目录下执行如下命令
node ./node_modules/esbuild/install.js
```

## Transforming async generator functions to the configured target environment ("es2015") is not supported yei
集成`fast-extends`后打包报错，因为s3的库不支持`es2015`，需要将编译目标改成`es2018`或以上`esnext`

```js
//修改vite.config.js
{
    build: {
        target: 'es2018'  //或者 esnext
    }
}
```
##  TypeError: date4.locale is not a functio
使用 antdv4 日期组件报错
需要配置 
```js
const crudOptions = {
    columns:{
        key:{
            valueBuilder({value}){
                //日期组件只能接受dayjs或者Date对象
                return dayjs(value) //或者 new Date()
            }
        }
    }
}
```
