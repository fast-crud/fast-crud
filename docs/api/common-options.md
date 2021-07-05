# CommonOptions
通用配置

## component【组件配置】

### component.name
* 说明：组件名（局部注册的组件直接传入组件本身)
* 类型：String | 组件
* 示例： 
```js
import TestComponent from './xxx.vue'
const curdOptions = {
    columns:{
        key:{
            form:{
                component:{
                    //全局注册的组件直接写组件名称即可
                    name: 'a-select',
                    //局部注册的组件需要shallowRef方法包裹
                    name: shallowRef(TestComponent)
                }
            }
        }
    }
}
```
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

### component.[xxx]
* 说明：组件的属性
* 示例：`options:[]`

### component.props.[xxx]
* 说明：组件的属性（同上）
* 区别：当组件的属性与上面所列的属性名称（name、vModel、on、props等等）有冲突时，可以配置在`props`下


## buttons【按钮组配置】
* 说明：按钮组配置
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


## fs-button【按钮配置】
* 说明：按钮配置
* 类型：Object
* 示例：
```
 rowHandle:{
    view:{
        text:"查看",//按钮文字
        title:"查看",//鼠标停留显示的信息
        icon:"", //图标
        type:"", //a-button，el-button的类型
        style:{},
        disabled:false,
        ...// a-button,el-button的其他配置
    },
}
```

