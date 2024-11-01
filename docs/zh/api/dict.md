# dict【数据字典】
还不了解什么是数据字典？[看这里](../guide/advance/dict)
## 配置项

### prototype
* 说明：是否是原型模式，每个组件都会初始化自己的dict实例，都会发出字典请求
* 类型：Boolean
* 默认：false

### cloneable
* 说明： 分发时是否需要clone，为false时，dict为单例模式
* 类型： Boolean
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
* 建议：不开缓存，将dict()创建的实例放到全局文件中导出，相当于store来使用，一样可以实现全局缓存的效果
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

### labelBuilder
* 说明：字典项的label属性名构建方法，用于构建复杂的label
* 类型：`(option)=>string`
* 默认：undefined


### children
* 说明：字典项的children属性名
* 类型：String
* 默认：children

### isTree
* 说明：字典数据是否树形结构，通常在级联组件、地区选择组件需要配置为true
* 类型：Boolean
* 默认：false

### getNodesByValues
* 说明：根据value数组，返回节点数据，用于表格单元格组件的label显示，当dict的data过多或懒加载时需要配置   
* 类型：`async Function(Array<value>,options?: LoadDictOpts):Array<Options>`
* 默认：undefined
```
const crudOptions = {
  columns:{
    key:{
      type: 'dict-select',
      dict: dict({
        async getNodesByValues(values:any[]){
          const res:any[] = await api.getByIds(values)
          //注意：这里res必须是数组
          return res;
        }
      })
    }
  }
}

```

### onReady
* 说明：远程数据字典加载完成事件,可以在组件使用前修改字典数据
* 类型：`async Function(Array<value>):Array<Options>`
* 默认：undefined

:::warning    
多个组件引用同一个dict实例，也只会触发一次`onReady`。    
如果多个组件引用同一个dict实例且需要每个都监听dict的变化，请参考下方`dict组件通用参数 onDictChange`    
:::

```js
 /**
 * dict请求url
 */
url?: string | DictGetUrl;
/**
 * 自定义获取data远程方法
 */
getData?: DictGetData<T>;

/**
 * 字典项value字段名称
 */
value?: string;
/**
 * 字典项label字段名称
 */
label?: string;
/**
 * 字典项children字段名称
 */
children?: string;
/**
 * 字典项color字段名称
 */
color?: string;
/**
 * 是否是树形
 */
isTree?: boolean;
/**
 * 是否全局缓存
 */
cache?: boolean; // 获取到结果是否进行全局缓存
/**
 * 是否将本dict当做原型，所有组件引用后将clone一个实例
 */
prototype?: boolean; // 是否原型配置

/**
 * 是否分发时复制
 */
cloneable?: boolean; // 是否分发复制
/**
 * dict创建后是否立即请求
 */
immediate?: boolean; //是否立即请求

/**
 * 根据values 远程获取字典，prototype=true时有效
 * @param values
 */
getNodesByValues?: (values: any, options?: LoadDictOpts) => Promise<T[]>;

/**
 * dict数据远程加载完后触发
 */
onReady?: (context: any) => void;

/**
 * 自定义参数
 */
custom?: any;

/**
 * 本地字典数据，无需远程请求
 */
data?: T[];
```

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

