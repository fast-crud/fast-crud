# 一些通用规则
便于您能够快速理解文档内容

## 1. 公共配置都可以在页面里面被覆盖

包括扩展组件的公共配置也都可以覆盖，具体去看对应的扩展组件的属性
```js
const crudOptions = {
    columns:{
        key:{
            type:"file-uploader",
            component:{
                uploader:{
                    //...覆盖公共上传配置
                }
            }
        }
    }
}

```
## 2. 文档中类似x-table-column的属性说明
x是指对应的ui的前缀，比如 `el-table-column/ n-table-column / a-table-column `

当看到此类说明时，表示该处地方可以配置对应组件的属性


## 3. 组件配置说明
1. 组件配置是通过 `fs-component-render`来渲染的，component下面可以配置`fs-component-render`的属性
```js
const crudOptions = {
    columns:{
        key:{
            form:{
                component:{
                    //这两个属性是fs-component-render的属性
                    name:"xxxx",
                    on:{}
                }
            }
        }
    }
}
```
2. 由于`component.name`对应的组件会继承`fs-component-render`的属性,所以`component`下面同时也可以配置`component.name`对应组件的属性
```js
const crudOptions = {
    columns:{
        key:{
            type:'text',
            form:{
                component:{
                    //也可以配置对应组件的属性
                    placeholder:"请输入",
                    disabled:false,
                    style:{}
                }
            }
        }
    }
}
```
3. 事件是通过配置`onXxxx($event){}`来监听的

```js
const crudOptions = {
    columns:{
        key:{
            type:'text',
            form:{
                component:{
                    //也可以配置对应组件的属性
                    onInput($event){
                        //监听原始的input事件
                    }
                }
            }
        }
    }
}
```

[更多组件配置说明](../api/common-options.html#component【组件配置】)

## 4. 关于render后缀方法的说明

fs中有很多地方可以配置带render的方法，例如：`columns.key.form.render`、`columns.key.form.topRender`、`columns.key.column.cellRender`、`columns.key.form.prefixRender`等等。
所有这些render方法都是通过`jsx/tsx`进行自定义渲染.

使用方法如下：
```js
const crudOptions ={
    columns:{
        name:{
            form:{
                render:(context)=>{
                    //jsx语法与template稍有不同，他用的是`{}`来包裹变量，而不是`{{}}`
                    //比如v-model就要按如下写法
                    //更多jsx语法请参考下方文档
                    return <a-input v-model={[context.form.name, "value"]} />    //<------注意这里的v-model写法
                }
            }
        }
    }
}
```

更多jsx语法，请参考文档：https://github.com/vuejs/babel-plugin-jsx







