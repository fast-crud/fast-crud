# CommonOptions
通用配置

## component【组件配置】

### component.name
* 说明：组件名
* 类型：String | 组件
* 示例：`a-select`

### component.[xxx]
* 说明：组件的属性
* 示例：`options:[]`

### component.onXxx
* 说明：组件的事件监听（没有context）
* 类型：Function(event)
* 示例：
```js
component:{
    onClick:(event)=>{
        console.log('点击事件',event)
    }
}
```

### component.on
* 说明：组件的事件监听（参数为context,可以获取表单或行数据）
* 类型：Function(context)
* 示例：
```js
component:{
    on:{
        onClick({value,key,row,form,getComponentRef}){
            console.log('点击事件',key,value,row,form)
        }
    }
}
```


## buttons【按钮组配置】
* 说明：按钮配置
* 类型：Object
* 示例：
```
{
    buttonKey:{
        ...FsButton, //fs-button组件的参数
        show:true,//是否显示此按钮
        click:()=>{}//点击事件
        order:1 //排序，越小越靠前
    },
}
```
