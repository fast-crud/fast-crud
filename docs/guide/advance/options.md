
# 基于配置
本章节主要了解`FastCrud`是如何通过配置驱动出一个完整的`crud`的。
## FastCrud运行过程
构建`crudOptions` --> 调用`useCrud` --> 获得`crudBinding` --> 传入`fs-crud`组件    

### crudOptions
使用`fast-crud`，你只需要掌握如何配置正确的`crudOptions`，即可完成一个`crud`的开发工作。       
其中  [**字段配置**](./component.md)  是重点，它就在下一章节，一定要看    
当你不知道`crudOptions`有什么参数时，请参考 [CrudOptionsAPI文档](../../api/crud-options/index.md) 

### useCrud
主要作用是初始化crud，将`crudOptions`转化为`expose.crudBinding`   

### crudBinding
在开发`crud`时，我们页面里面用的组件是`fs-crud`，`crudBinding`就是传入的全部参数

```html
<template>
    <fs-crud ref="crudRef" v-bind="crudBinding"/>
</template>
```

### fs-crud组件
其他的都交给`fs-crud`吧     
具体`fs-crud`需要哪些参数，请查看[fs-crud组件的参数](/api/components/crud/fs-crud)文档

