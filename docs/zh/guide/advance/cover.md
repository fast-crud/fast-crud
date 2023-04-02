# 配置覆盖机制
FastCrud内部有多层配置覆盖机制，所以你只需要写一些必要的配置即可生成出复杂的crudBinding。

底层配置会被上层逐层覆盖合并，用户的配置处于最上层的位置。



## 配置来源
以下列出了配置有哪些来源（按上层至底层顺序）

### 1. 页面CrudOptions
每个页面的Crud配置，优先级最高，最终使页面能完成不同的crud功能

### 2. 字段类型配置
通过给字段配置类型，内置的字段合并插件，会从字段类型列表中读取类型配置，然后与`crudOptions.columns[key]`合并

你也可以[自定义字段类型，或者修改官方字段类型](column-type.html#自定义字段类型)，相当于给字段类型进行公共配置

### 3. 公共配置
公共配置是用户能操作的最底层的配置，在安装`FsCrud`时配置。 可以在整个网站级别设置通用配置

```js
app.use(FastCrud,{
    commonOptions(){
        return {
            ... // 这里就是用户可以配置的公共配置
        }
    }
})
```

### 4. useFs/useCrud生成的配置
在使用`useFs/useCrud`的过程中，会生成各种事件配置，将各个组件连接起来，通常也无需关心



### 5. 内置默认配置
内置默认配置是最底层的配置，位于[fast-crud/use/default-crud-options.ts](https://github.com/fast-crud/fast-crud/blob/main/packages/fast-crud/src/use/default-crud-options.ts)
通常你无需关心。



## 置空覆盖

在相同的位置配置内容，即可在顶层覆盖底层的配置。    
有时候底层有我们不想要的配置，需要移除，此时就需要进行置空覆盖。    
你只需要配置`null`即可。   

```js
const crudOptions = {
    actionbar:{
        buttons:{
            add:{
                text: null, //可以让button不显示文字
                icon: 'PlusOutlined' //仅显示图标
            }
        }
    }
}
```

::: warning
如果你使用ts，那么你需要关闭`strictNullChecks`
```json5
//tsconfig.json
{
  "compilerOptions": {
    "strictNullChecks": false,
  }
}
```
:::


## 字段配置优先级
优先级从高到低

### 单元格字段
1. crudOptions.columns[key].column.xxx
2. 对应的字段类型.column.xxx

### search字段

1. crudOptions.columns[key].search.xxx
2. 对应的字段类型.search.xxx
3. crudOptions.columns[key].form.xxx
4. 对应的字段类型.form.xxx

### form字段
1. crudOptions.columns[key].[mode]Form.xxx
2. 对应的字段类型.[mode]Form.xxx
3. crudOptions.columns[key].form.xxx
4. 对应的字段类型.form.xxx


