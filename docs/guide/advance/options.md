# 基于配置

本章主要介绍`fast-crud`的初始化过程（将简单配置初始化为fs-crud组件所需要的配置）

## fs-crud组件

在开发CRUD时，我们页面里面用的组件是`fs-crud`，`crudBinding`就是传入的全部参数

```html

<template>
    <fs-crud ref="crudRef" v-bind="crudBinding"/>
</template>
```

具体`fs-crud`需要哪些参数，请查看[fs-crud组件的参数](./api/component/fs-crud)

所以我们主要看怎么由`crudOptions`转变成`crudBinding`的

### 1.crudBinding 包含哪些配置

下面以仅有一个`status`字段的`crud`举例    
如下是`fs-crud`需要的最终配置，将如下配置传入`fs-crud`就可以渲染出一套crud页面来

```js
const crudBinding = {
    columns: { //单元格的配置
        status: {//配置单元格用values-format显示
            title: '状态',
            key: 'status',
            component: {
                name: 'fs-values-format',
                dict: dict({url: 'dicts/statusEnums'})
            }
        }
    },
    addForm: {
        columns: {
            status: {
                title: '状态', //【与单元格的title重复，可简化】
                compnent: {
                    name: 'fs-dict-select', //添加时使用选择框
                    dict: dict({url: 'dicts/statusEnums'})
                }
            }
        },
        rules: {...}
    },
    editForm: {
        columns: {
            status: {...}
        },
        rules: {status: {...}}
    },
    viewForm: {
        columns: {
            status: {...}
        },
        rules: {status: {...}}
    },
    search: {
        columns: {
            status: {...}
        },
    },
    
}
```

### 2. 简化第一步，从功能角度转到字段角度

上面配置是按功能划分的，字段配置在功能下     
我们转换成按字段划分，功能配置在字段下   
此状态是crudOptions的字段的最全配置

```js
columns:{
   status:{
       title: '状态',
       search: {component: {...}},//这里放查询配置
       addForm: {component: {...}},//这里放添加表单配置
       editForm: {component: {...}},//这里放编辑表单配置
       view: {component: {...}}, //这里放查询表单配置
       component: {} //这里放单元格组件配置
   } 
}
```

### 3. 简化addForm、editForm、view

addForm、editForm、view这三个大部分情况下都是一样的，可以合并成一个form

```js
columns:[
    {
        title: '状态',
        key: 'status',
        search: {},//这里放查询配置
        form: {}, //addForm、editForm、view合并成form
        component: {} //这里放单元格配置
    }
]
```

### 4. 通过字段类型继续简化

字段类型背后代表了一段默认配置，当你配置了type时，你可以省略它代表的这部分默认配置

查看[字段类型](./column-type.md)更详细的说明

```js
columns:[
    {
        title: '状态',
        key: 'status',
        type: 'select',
        dict: {url: '/dict/status'}
    }
]
```

::: tip 你仍然可以单独设置被简化掉的配置    
比如你想让status字段在添加时启用，编辑时禁用，可以使用如下配置
:::

```js
columns:[
    {
        title: '状态',
        key: 'status',
        type: 'select',
        dict: {url: '/dict/status'},
        editForm: { //配置编辑时禁用此组件
            component: {
                disabled: true
            }
        }
    }
]
```

::: warning 由于数组的合并是取并集，所以当添加和编辑的校验规则不相同时，不要配置在`form.rules`里面，需要在`editForm.rules`和`editForm.rules`下分别配置

:::

```
columns:[ 
  {
    title:'姓名',
    key:'name',
    form: {
      helper: '添加时必填，编辑时必填且需要校验长度',
      rules: [{ required: true, message: '请输入姓名' }]
    },
    editForm: {
      rules: [{ min: 2, max: 5, message: '姓名长度为2-5' }]
    }
  } 
]
```

### 5. 初始化过程

下面是以上简化过程的伪代码

```
1.  `created()`中开始crud初始化
2.  页面配置`crudOptions`覆盖全局配置`commonOption`
2.  遍历`crudOptions.columns`，[详细过程](./column-type.md)
3.  　　－－根据`type`获取默认字段配置
4.  　　－－使用用户的配置覆盖默认配置
5.  　　－－`search`中的配置覆盖`form`的配置生成`字段查询配置`
6.  　　－－`addForm`中的配置覆盖`form`的配置生成`字段添加配置`
7.  　　－－`editForm`中的配置覆盖`form`的配置生成`字段编辑配置`
8.  　　－－`view`中的配置覆盖`form`的配置生成`字段查看配置`（仅当componentType='form'）
10.  处理分组配置
11.  生成最终的`crud配置`，输出日志 crud init `{crud}`（你可以在此检查生成的配置是否正确）
12.  将`crud配置`传入`d2-crud-x`组件
13.  触发`doSearch`方法执行`pageRequest`获取数据
```

## 简化其他配置

通过全局配置,可以简化其他配置

```js
Vue.use(d2CrudPlus, {
    commonOption() { //全局配置
        return {
            ... //每个页面的crudOptions会以此全局配置为基础
        }
    }
})
```

## 简化事件

[d2-crud有哪些事件](../d2-crud-x/events.md)

页面会通过mixins继承`_crudListeners`这个方法。     
这个方法将会把`d2-crud`事件全部配置监听。

```js
<d2-crud-x
    v-on="_crudListeners" 
  @xxx="handleXxx"  //可以自己配置事件，覆盖_crudListeners里的监听
/>
```

### valueChange

`form-data-change`、`cell-data-change`、`search-data-change`事件还会自动触发每个字段中配置的`valueChange`方法
