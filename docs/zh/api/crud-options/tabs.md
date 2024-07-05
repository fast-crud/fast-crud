
# crudOptions.tabs
* 说明: Tabs快捷查询，在表格顶部显示tabs页签进行快捷查询
* 类型： Object
* 更多参数： [FsTabsFilter](/api/components/crud/search/tabs-filter.md)
* demo： [antdv](http://fast-crud.docmirror.cn/antdv/#/crud/feature/tabs)  /  [element](http://fast-crud.docmirror.cn/element/#/crud/feature/tabs)  /  [naive](http://fast-crud.docmirror.cn/naive/#/crud/feature/tabs)
* 示例
```js
const crudOptions = { 
    tabs:{
        show: true,
        name:'city', //对应查询字段key
        onXxxx: ()=>{}, //监听x-tabs组件的原始事件
    },
    columns: {
        city: {
            title: "城市",
            type: 'dict-select',
            dict: dict({data: [{value: 'sz', label: '深圳'}]})
        }
    }
}
```

## show
* 说明：显示或隐藏Tabs
* 类型：Boolean
* 默认：`false`

## name
* 说明：对应查询字段key
* 类型： String
* 默认： undefined


## defaultOption
* 说明： 默认页签配置（第一个页签，查询全部）
* 类型： Object
* 示例
```js
const crudOptions = { 
    tabs:{
        show: true,
        name:'city',
        defaultOption:{
            show:true, //是否显示默认页签
            value: null, //点击此页签时，对应的查询value
            label: "全部" //页签显示名称
        }
    },
}
```

## options
* 说明： 页签列表
* 类型： any[]
* 默认： 如果对应的name字段有配置`dict`，则自动使用`dict`的`data`作为`options`
* 示例
```js
//表格顶部将显示tabs，点击其中深圳页签，将发起查询，查询参数为 {city:'sz'}
const crudOptions = { 
    tabs:{
        show: true,
        name:'city',
        options:[
            {value: 'sz', label: '深圳'}
        ]
    },
}
```


## value
* 说明：option的value字段名称
* 类型： String
* 默认： value


## label
* 说明：option的label字段名称
* 类型： String
* 默认： label
```js
//表格顶部将显示tabs，点击其中深圳页签，将发起查询，查询参数为 {city:'sz'}
const crudOptions = { 
    tabs:{
        show: true,
        name:'city',
        value:'id',
        label:'text',
        options:[
            {id: 'sz', text: '深圳'}
        ]
    },
}
```
