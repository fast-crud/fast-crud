
# 数据字典

配置数据字典之后， type=【dict-select/dict-cascader/dict-tree/dict-radio/dict-switch/dict-checkbox】
这些字段类型就可以通过数据字典获取label及其选项，无需自己写各种options

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
字段下配置的dict会在页面初始化后复制到`search.component`、`form.component`、`column.component` 下     
如果需要search、form、component有不同的表现，直接配置对应位置的dict即可覆盖基本配置     
更多信息请先阅读:[核心逻辑](./mixins.md)
## 数据字典的配置   
通常配置在column下,然后被分别赋值到component.dict和form.component.dict
```js
export const crudOptions = {
  columns: [ //字段配置
    {
      dict:{
        // 这里配置远程获取字典数据的请求地址
        url:'remote/dict/url', 
        // 或者配置一个方法，动态构建url
        url: (dict,{form,component})=>{ 
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
        getData:(url,dict,{form,component})=>{ //配置此参数会覆盖全局的getRemoteDictFunc
          return request().then(ret=>{return ret.data})
        },
        cache:true, //默认开启缓存
        value: 'value', // 数据字典中value字段的属性名
        label: 'label', // 数据字典中label字段的属性名
        children: 'children', // 数据字典中children字段的属性名
        isTree: false, // 此数据字典是否是树形的，通常用于级联组件、地区选择组件等处
        clone: false, // 是否在获取到字典数据之后clone一份,clone之后不影响全局缓存，可以随意修改
        getNodes(values){return nodeArr}, //根据value数组，返回节点数据，用于懒加载时，行展示组件的label显示
        transfer:(data,options)=>{return data},// 可以修改获取到的远程数据，比如将字典的id字段转成字符串形式（缓存开启时只会执行一次）
        onReady(data, dict, context){
          //远程数据字典加载完成事件，每个引用该字典的组件都会触发一次
        }   
      }   
    }
]}
```
注意：dict会以url作为缓存key，使得该字典只会远程获取一次。
```js
dict:{
    cache:false //可以禁用缓存
}
```
    
注意： `getData()` 会覆盖全局的getRemoteDictFunc   
* `getData()` ：如果配置相同的url，即便getData不一样，还是会获取到相同的字典数据，可以通过url单独清理缓存   


## 页面中获取数据字典
```js
this.getDictData(dict).then(data=>{
  this.dictData = data 
})

// 还可以传入列的key,根据该列的dict配置来获取字典数据
this.getDictData('columnKey').then(data=>{
  this.dictData = data 
})

// 返回map
this.getDictData('columnKey',{returnType:'dataMap'}).then(dataMap=>{
  this.dictDataMap = dataMap 
})
        
```

## 清除字典缓存   
远程字典会以url作为key缓存在内存里面  
某些情况下需要清空字典缓存，比如添加修改删除字典项的时候
```javascript
import { d2CrudPlus } from 'd2-crud-plus'
d2CrudPlus.util.dict.clear() //清空所有字典缓存
d2CrudPlus.util.dict.clear(url) //清空单个字典缓存
```

## onReady事件监听
当dict获取到远程数据之后，会触发onReady事件
```js
dict:{
  onReady: (data, dict,{form,component}) => {
      let value = vm.getEditForm().checkbox
      if (value == null) {
        value = []
      }
      radioOptionsChanged(vm, value)
  }
}
``` 

## 如何设置行展示组件【values-format】的颜色
方法1
获取的字典数据中，带上color即可，可选值【primary,success,danger,warning,info】
`data:[{value:xx,label:xx,color:'success'}]`

方法2
如果后台不方便返回color，可以给字段配置自动染色
` columns:[{component:{props:{color:'auto'}}}]`

方法3
或者手动设置
```js
dict:{
 getData:(url,dict,{form,component})=>{ //配置此参数会覆盖全局的getRemoteDictFunc
          return request(url).then(ret=>{
                    //修改颜色值
                    return ret.data
           })
  }
}
```

## 动态修改字典数据

直接修改dict.data无法动态修改select的选项数据

方式1： 配置DictSelect组件的options(数据结构与dict.data一致)，options参数比dict.data具有更高优先级，并且可以动态修改
```js
valueChange (key, value, form, { getColumn, mode, component, immediate, getComponent }) {
       getColumn.component.props.options=[{字典数据}]
 },
```
方式2： 参考选择联动http://preview.d2-crud-plus.docmirror.cn/D2CrudPlusExample/index.html#/demo/form/linkage
```js
valueChange (key, value, form, { getColumn, mode, component, immediate, getComponent }) {
            form.city = undefined // 将“city”的值置空
            form.county = undefined// 将“county”的值置空
            if (value) {
              getComponent('city').reloadDict() // 执行city的select组件的reloadDict()方法，触发“city”重新加载字典
            }
          },
```
DictSelect、DictRadio、DictCheckbox组件ref暴露如下一些方法可以操作字典：
```js
component.clearDict()  //清除字典
component.loadDict() //加载字典
component.setDictData(data) //修改字典数据
component.getDictData()
```

方式3：动态修改dict.url 也会触发字典重载
```js
valueChange (key, value, form, { getColumn, mode, component, immediate, getComponent }) {
       getColumn.component.props.dict.url=dict.url?params=xxx //不同的参数获取不同的字典列表
 },

```

## 字典缓存仅页面级别生效
在页面的created方法中清空所有字典缓存即可    
```js
import { d2CrudPlus } from 'd2-crud-plus'
export const crudOptions= {
 pageOptions:{
    onInitAfter(){ //初始化完成后，清空所有字典缓存
        d2CrudPlus.util.dict.clear() 
    }
 }
}
```
