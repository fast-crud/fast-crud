
# dict【数据字典】

`dict组件`配合`dict`，可以通过数据字典获取label及其选项，而无需自己写各种options
> dict组件指`fs-dict-` [开头的组件](../../api/components/crud/extends/fs-dict-select.md)

引用了`dict组件`字段类型：
* dict-select
* dict-cascader
* dict-tree
* dict-radio
* dict-switch
* dict-checkbox


## 用法
给需要dict作为参数的`dict组件`配置dict实例对象参数

* 方法：dict(opts)
* 参数：opts= {url:"",data:[]}  [更多参数](../../api/dict)
* 返回：实例化的`Dict`对象
* 示例：以下示例相当于写了一个select组件，并且可以异步远程获取options。
```js
import {dict} from '@fast-crud/fast-crud'
const crudOptions = {
    columns:{
        key:{
            form:{
                component:{
                    name:'fs-dict-select', //fs-dict-select组件，它有一个dict参数
                    dict: dict({url:'/dict/getOptions'})
                }   
            }   
        }
    }

}
```
## 字典复制
你可以将字典配置在columns.key.dict     
`useCrud`初始化时将会分别复制到form.component、search.component、column.component下。    
所以一般你只需要写一个dict配置即可
```js
import {dict} from "@fast-crud/fast-crud"
const crudOptions = {
    columns:{
        key: { 
            dict: dict({...opts}),// <---你一般只需写这一个字典配置
            form:{ component:{ dict:{} } }, // <--从上面自动复制到这里作为component的参数传入
            search:{ component:{ dict:{} } },// <--从上面自动复制到这里作为component的参数传入
            column:{ component:{ dict:{} } }// <--从上面自动复制到这里作为component的参数传入
        }
    }
}
```

#### 单例模式
* dict.cloneable=false     
* 此模式下，整个页面内只有一个dict实例，初始化复制时仅仅只是复制同一个实例的引用。       
* 所以你可以保留这个dict实例的引用，修改这个实例的data，会影响页面内的所有使用这个dict的组件的显示
* 你还可以将dict的实例放到一个全局文件中，在其他页面中引用，单例dict就是一个store。

#### 分发复制模式
* dict.cloneable=true
此模式下载初始化复制时，会clone多个实例到`search.component`、`form.component`（实际上是`addForm`、`editForm`、`viewForm`）、`column.component` 下            
如果需要search、form、column分别有不同的表现，可以配置这些位置下的dict属性，会覆盖默认的dict属性           
通过初始dict的引用，无法修改到分发后的dict实例引用。
在此模式下如果你想手动修改字典，可通过如下方式获取到字典实例
```js
// 获取字典实例（仅编辑对话框打开的状态下可获取）
const dict = expose.getFormComponentRef(columnKey).getDict() 
const options =dict.data;

// 获取组件实例，调用其reloadDict方法重新加载字典
expose.getFormComponentRef(columnKey).reloadDict()

```
#### 原型模式
* dict.prototype=true      
此模式下，dict仅作为配置原型，在组件实例化时，会新new一个dict对象出来，重新加载字典。
所以也只能采用`分发时复制`中的方式获取字典实例


## 字典远程请求方法
在注册`FastCrud`时，需要传入一个`dictRequest`的配置，此配置就是字典的默认请求方法
```js
app.use(FastCurd,{  
    async dictRequest(dict) {
        //通过字段组件中配置的dict.url获取远程字典数据
        return await request({ url:dict.url });
    },
})
```

在单个配置里面你也可以通过配置`dict.getData`方法来覆盖这个默认的请求方法
```js
dict:dict({
    //本dict将会走此方法来获取远程字典数据
    async getData(dict,context){
        return request(dict.url)
    }   
})

```


## 从数据字典实例中获取字典数据
```js
const dict = dict({...opts})
await dict.loadDict()
const dictData  = dict.data
const dictMap = dict.dataMap
```

## 清除字典缓存   
当配置dict.cache=true  
某些情况下需要清空字典缓存
```js
 # TODO 待完善
```

## onReady事件监听
当dict获取到远程数据之后，会触发onReady事件
```js
dict:dict({
    onReady: ({dict,...context}) => {
        //可以在此处进行一些字典数据的处理，比如设置为禁用
    }
})
``` 

## API

[数据字典API](../../api/dict)
