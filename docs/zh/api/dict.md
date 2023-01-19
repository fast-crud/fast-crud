# dict【数据字典】
还不了解什么是数据字典？[看这里](../guide/advance/dict)
## 配置项
### cloneable
* 说明： 分发时是否需要clone，为false时，dict为单例模式
* 类型： Boolean
* 默认：false

### prototype
* 说明：是否是原型模式，每个组件都会初始化自己的dict实例，都会发出字典请求
* 类型：Boolean
* 默认：false

### url
* 说明：字典的请求url，也是全局缓存的key
* 类型：String | Function({dict,...context}):String
* 默认：false

### data
* 说明：字典数据，传入此值则无需从远程获取，如果未传则从远程获取后填入此处
* 类型：Array
* 默认：undefined

### getData
* 说明： 异步获取数组字典方法，此参数会覆盖全局的`getRemoteDictFunc`
* 类型：async Function({url,dict,...context}):Array
* 默认：undefined

### cache
* 说明：是否开启全局缓存（多个实例之间缓存，以url作为缓存key），开启后，多实例间加载字典只会请求一次。
* 类型：Boolean
* 默认：false

### value
* 说明：字典项的value属性名
* 类型：String
* 默认：value

### label
* 说明：字典项的label属性名
* 类型：String
* 默认：label

### children
* 说明：字典项的children属性名
* 类型：String
* 默认：children

### isTree
* 说明：字典数据是否树形结构，通常在级联组件、地区选择组件需要配置为true
* 类型：Boolean
* 默认：false

### getNodesByValues
* 说明：根据value数组，返回节点数据，用于懒加载时，行展示组件的label显示   
* 类型：`async Function(Array<value>):Array<Options>`
* 默认：undefined

### onReady
* 说明：远程数据字典加载完成事件,可以在组件使用前修改字典数据
* 类型：`async Function(Array<value>):Array<Options>`
* 默认：undefined

:::warning    
多个组件引用同一个dict实例，也只会触发一次`onReady`。    
如果多个组件引用同一个dict实例且需要每个都监听dict的变化，请参考下方`dict组件通用参数 onDictChange`    
:::

## dict的方法
获取到dict实例后，可以调用如下方法
### dict.loadDict(context?) 
加载字典
### dict.reloadDict(context?)
重新加载字典
### dict.getDictData()
获取字典数据
### dict.getDictMap()
获取字典map（以value为key的map）
### dict.getNodeByValue()
根据value获取字典项

## dict组件
dict组件包括：FsDictSelect/FsDictRadio/FsDictCascader/FsDictCheckbox/FsDictSwitch等
### 组件的方法
通过 `context.getComponentRef` 获取到`dict组件实例`后，可以调用如下方法

#### ref.getDict()
获取字典实例

#### ref.loadDict()
加载数据字典

#### ref.reloadDict()
重新加载数据字典

## dict组件的通用参数
### onDictChange({dict, ...context})
当组件引用的`dict`的`dict.data`改变后被触发，可以实现设置第一个选项为默认值之类的需求。

