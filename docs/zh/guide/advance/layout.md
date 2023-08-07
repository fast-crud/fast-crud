# 页面布局
配置 `container.is=xxxxxxx` 可以修改页面布局.         
对于布局您有如下选择:
* 默认布局：`fs-layout-default`
* Card布局：`fs-layout-card` [Card布局演示](http://fast-crud.docmirror.cn/antdv/#/crud/basis/layout-card)
* 自定义布局：见下文，[自定义布局演示](http://fast-crud.docmirror.cn/antdv/#/crud/basis/layout-card)

## 自定义布局
通过自定义布局，你可以将crud子组件任意摆放位置，改变样式使之适合您项目的整体风格。    
自定义布局需要编写您自己的layout组件，全局注册之后，通过配置`container.is=自定义组件名称`来使用。


### 1. 编写自定义layout组件
你需要在你的layout组件中配置如下插槽位置：
* search
* actionbar
* toolbar
* table
* form
* pagination

[自定义布局组件示例](https://github.com/fast-crud/fs-admin-antdv/tree/main/src/views/crud/basis/layout-custom/custom-layout.vue)

大概长这样
```html
<template>
    <div class="layout-custom">
        <div class="header">
            <slot name="search"></slot>
            <slot name="actionbar"></slot>
            <slot name="toolbar"></slot>
        </div>
        <div class="body">
            <slot name="table"></slot>
            <slot name="form"></slot>
        </div>
        <div class="footer">
            <slot name="pagination"></slot>
        </div>
    </div>
</template>

```

### 2. table支持表头固定
想要table支持表头固定，需要包裹table插槽的元素拥有高度自适应的能力     
通常可以这样写：
```html
<style lang="less">
    .layout-custom{
        height:100%;  // <--------要求父元素要有高度，否则没有用
        display:flex;
        flex-direction: column;
        .body{
            flex:1;   // <------- 此处就是让body拥有高度自适应的能力
        }
    }
</style>
```

### 3. 注册并使用
你可以选择将自定义布局`局部注册`或者`全局注册`

* 全局注册使用：
```js
//全局注册
import CustomLayout from 'xxxxxx/xxxx/custom-layout.vue'
app.component('CustomLayout',CustomLayout)
```
```js
//使用
const crudOptions = {
    container:{
        is:"CustomLayout"
    }
}
```

* 局部注册使用:
```js
import CustomLayout from 'xxxxxx/xxxx/custom-layout.vue'
import {shallowRef} from 'vue'
const crudOptions = {
    container:{
        is: shallowRef(CustomLayout)
    }
}
```



# 查询框自定义布局
配置 `search.container.is=xxxxxxx` 可以自定义查询框组件布局容器（使用方法同上）         

* 默认布局：`fs-search-layout-default`
* 参考：[fs-search-layout-default源码](https://github.com/fast-crud/fast-crud/blob/main/packages/fast-crud/src/components/search/layout-default.vue)

```js
const crudOptions = {
    search:{
        container:{
            is:'your-custom-layout-component-name',
            collapse:true, //是否展开，布局组件中定义的props
            'onUpdate:collapse':(value)=>{ //vModel事件
                crudBinding.search.container.collapse=value
            }
        },
    }
}
```


# 列设置自定义布局
配置 `toolbar.columnsFilter.container.is=xxxxxxx` 可以自定义列设置组件布局容器（使用方法同上）

* 默认布局：`fs-columns-filter-layout-default`
* 参考：[fs-columns-filter-layout-default源码](https://github.com/fast-crud/fast-crud/blob/main/packages/fast-crud/src/components/toolbar/fs-table-columns-filter/fs-columns-filter-layout-default.vue)

```js
const crudOptions = {
    toolbar:{
        columnsFilter:{
            container:{
                is:'your-custom-layout-component-name',
            },
        }
    }
}
```