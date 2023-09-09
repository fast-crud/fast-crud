
# 基于配置
本章节主要了解`FastCrud`是如何通过配置驱动出一个完整的`crud`的。
## 1. FastCrud运行过程
构建`crudOptions` --> 调用`useCrud` --> 获得`crudBinding` --> 传入`fs-crud`组件    

:::tip    
新版本将以上过程封装为了一个[useFs方法](../../api/use.md#useFs)，你可以一步到位    
::: 

### crudOptions
使用`fast-crud`，你只需要掌握如何配置正确的`crudOptions`，即可完成一个`crud`的开发工作。       
其中  [**字段配置**](./component.md)  是重点，一定要看      

当你不知道`crudOptions`有什么参数时，请参考如下文档：
* [CrudOptions API文档](../../api/crud-options/index.md) 
* [CrudOptions typedoc文档](/d.ts/types/CrudOptions.html)

::: tip   
表格与配置对应关系
* `crudOptions.table` 表格配置
* `crudOptions.search` 查询框配置
* `crudOptions.pagination` 分页配置
* `crudOptions.columns` 字段配置
* `crudOptions.columns[key].column` 表格列配置（图中columns[key]部分）
* `crudOptions.columns[key].search` 查询表单内字段配置(图中状态字段在查询框内的配置)
:::

![](../../images/struct.png)

表单与配置对应关系    
::: tip   
* `crudOptions.form` 添加表单配置
* `crudOptions.viewForm` 查看表单配置
* `crudOptions.editForm` 编辑表单配置
* `crudOptions.addForm` 添加表单配置

* `crudOptions.columns` 字段配置
* `crudOptions.columns.form` 所有表单内该字段公共配置

* `crudOptions.columns.viewForm` 查看表单内字段配置
* `crudOptions.columns.addForm` 添加表单内字段配置
* `crudOptions.columns.editForm` 编辑表单内字段配置

:::

![](../../images/form-layout.png)




当你想要调整对应位置的配置，找到`crudOptions`里面对应的位置修改配置即可。


### useCrud
主要作用是初始化crud，将`crudOptions`转化为`crudBinding` 
转化过程主要做了两件事：    
1. 用户的`crudOptions`与公共配置、基础配置进行合并
2. 字段配置分发，将`crudOptions.columns[key]`里面的`form`,`column`,`search`等配置分发到`table.columns`,`form.columns`,`search.columns`中去
   * 其中`viewForm`、`addForm`、`editForm`与`form`会进行合并，然后分发到`viewForm.columns`、`addForm.columns`、`editForm.columns`

如此生成出来的新的`Options`就是`crudBinding`


### crudBinding
在开发`crud`时，我们页面里面用的组件是`fs-crud`，`crudBinding`就是传入的全部参数

```html
<template>
    <fs-crud ref="crudRef" v-bind="crudBinding"/>
</template>
```

::: tip

由于`fs-crud`实际参数是`crudBinding`。    
所以动态修改`crudOptions`里面的属性时，你会发现并不会生效。      
你只能通过动态修改`crudBinding`里面的属性来达到目的。   
当你对于`crudBinding`的结构不熟悉时，去手动修改它可能不是很方便。     
此时你可以使用[动态计算](./compute.md) ( 当然动态计算也有其局限性，详情请见[`动态计算->适用范围`](./compute.html#适用范围) )

:::

### fs-crud组件
其他的都交给`fs-crud`吧     




