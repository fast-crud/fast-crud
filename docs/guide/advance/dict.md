
# 数据字典

配置数据字典之后， type=【dict-select/dict-cascader/dict-tree/dict-radio/dict-switch/dict-checkbox】
这些字段类型就可以通过数据字典获取label及其选项，无需自己写各种options

## 用法
给需要dict作为参数的component配置dict实例对象参数
```js
import {dict} from '@fast-crud/fast-crud'
const crudOptions = {
    columns:{
        key:{
            form:{
                component:{
                    dict: dict({url:'/dict/getOptions'})
                }   
            }   
        }
    }

}
```

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

## 字典配置复制
```js
import {dict} from "@fast-crud/fast-crud"
const crudOptions = {
    columns:{
        key: { 
            dict: dict({...opts}),
            form:{ component:{ dict:{} } },
            search:{ component:{ dict:{} } },
            column:{ component:{ dict:{} } }
        }
    }
}
```
#### 单例模式
* dict.cloneable=false
此模式下，全局只有一个dict实例
通过这个dict实例操作dict.data数据，会影响页面内的所有使用到dict的组件的显示

#### 分发复制模式
* dict.cloneable=true
字段下配置的dict会在页面初始化后复制到`search.component`、`form.component`、`column.component` 下     
如果需要search、form、column有不同的表现，直接配置对应位置的dict即可覆盖字段下的dict配置即可     
通过初始dict的引用，无法修改到分发后的dict实例引用。

#### 原型模式
* dict.prototype=true
当配置dict.cloneable=true时，

## 数据字典的配置   
通常配置在column下,然后被分别赋值到component.dict和form.component.dict
```js
export const crudOptions = {
  columns: { //字段配置
    key:{
      dict: dict({
         cloneable:false, //是否分发复制
         prototype:false, //
         // 这里配置远程获取字典数据的请求地址
         url:'remote/dict/url', 
         // 或者配置一个方法，动态构建url
         url: (dict,context)=>{ 
           return 'newUrl'
         }, 
         data: [//[Array]，如果数据无需远程获取，可以直接将字典数组写在这里
            {
             value:1,
             label:'开启', 
             color:'primary', //颜色 【primary，success，danger，warning，info】
             disabled:false //是否禁用
             }
         ], 
         getData:(url,dict,context)=>{ //配置此参数会覆盖全局的getRemoteDictFunc
           return request().then(ret=>{return ret.data})
         },
         cache:true, //默认开启缓存
         value: 'value', // 数据字典中value字段的属性名
         label: 'label', // 数据字典中label字段的属性名
         children: 'children', // 数据字典中children字段的属性名
         isTree: false, // 此数据字典是否是树形的，通常用于级联组件、地区选择组件等处
         clone: false, // 是否在获取到字典数据之后clone一份,clone之后不影响全局缓存，可以随意修改
         getNodesByValues(values){return nodeArr}, //根据value数组，返回节点数据，用于懒加载时，行展示组件的label显示
         transfer:(data,options)=>{return data},// 可以修改获取到的远程数据，比如将字典的id字段转成字符串形式（缓存开启时只会执行一次）
         onReady(data, dict, context){
           //远程数据字典加载完成事件，每个引用该字典的组件都会触发一次
         }   
       })   
    }
  }
}
```
注意：dict会以url作为缓存key，使得该字典只会远程获取一次。
```js
dict:{
    cache:false //可以禁用缓存
}
```
    
注意： `getData()` 会覆盖全局的getRemoteDictFunc   
* `getData()` ：如果配置相同的url，即便getData不一样，还是会获取到相同的字典数据，可以通过url单独清理缓存   


## 页面中获取数据字典数据
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
    onReady: (data, dict,context) => {
        //可以在此处进行一些字典数据的处理，比如设置为禁用
    }
})
``` 


## 动态修改字典数据
只要能获取到dict实例的引用，修改其data数据即可需改字典数据。

## 字典重载
