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
文档中有很多【类似`x-table-column`组件属性 或者 `对应ui组件的属性`】的说法。
x是指对应的ui的前缀，比如 `el-table-column/ n-table-column / a-table-column `

当看到此类说明时，表示该处地方可以配置对应组件的属性，你需要去查看对应ui组件的文档

```js
const crudOptions = {
    columns:{
        key:{
            type:"text",
            column:{
                //...这里可以配置x-table-column的属性
                width: '200px' //列的宽度  <----此属性是由[el|a|n]-table-column提供的
            }
        }
    }
}

``
```

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
                    on:{
                        onXxxx(context){
                            //监听组件事件,具备上下文，注意on开头
                        }
                    }
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

4. 如果对应ui文档上写的 'xxx-yyy'这样的属性名

你可以通过驼峰的方式来配置,比如`xxxYyy`，或者加双引号`"xxx-yyy"`。

5. 更多组件配置说明

[更多组件配置说明](../../api/common-options.md#component【组件配置】)

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


## 5. 关于 scope 或 context的说明
文档中有时候会出现 scope 或  context。说明该参数是上下文,格式如下（注意：不一定包含所有的字段，你可以打印出来看看）
```js
type ScopeContext = {
    value:any; //当前单元格/表单字段的值
    key:string; //当前单元格/表单字段的key
    index: number; // form表单内没有
    form: any; //单元格渲染时没有
    row: any; //当前行的值
    getComponentRef; //某些情况下没有
}
```

## 6. 做公共字段配置的三种方式

### 方式1： 如果有固定的key    

在`commonOptions`里面写固定key的配置即可    
比如 created_time, updated_time    

```js
commonOptions(context){
    return {
        columns:{
            created_time:{
                valueResolve({form,key,value}){
                    if(value){
                        form[key] = value.format("YYYY-MM-DD HH:mm:ss")
                    }
                }
            }
        }
    }
}

```
### 方式2： 有固定的字段类型
请参考：[修改官方字段类型](../advance/column-type.md#修改官方字段类型配置)

### 方式3： 以上都没有，请使用字段merge插件
请参考：[字段merge插件](../advance/column-type.md#字段merge插件)



## 遗漏补充
如有遗漏，请告诉我，我会补充上来



