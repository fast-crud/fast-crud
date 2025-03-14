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
                    //局部注册组件
                    name: TestComponent
                }
            }
        }
    }
}
```

### component.vModel
* 说明：组件通过v-model绑定的字段名，在表单和列表中将数据绑定到组件的哪个字段上。
* 类型：String | VModelProps

```js
const curdOptions = {
    columns:{
        key:{
            form:{
                component:{
                    // 简单配置
                    vModle:"value", 
                    // 完整配置
                    vModel:{ // VModelProps类型
                        name:"value",//绑定的字段名
                        trim: true,//是否去除前后空格
                        number: true,//是否转换为数字
                        transform: (value:any) => {//自定义转换函数
                            if(!value){
                                return undefined
                            }
                            return value
                        }
                    }
                }
            }
        }
    }
}
```


### component.onXxx
* 说明：组件的原始事件监听（没有context）
* 类型：Function(event)
* 示例：
```js
component:{
    onClick:(event)=>{
        console.log('点击事件',event)
    }
}
```

### component.on.onXxx
* 说明：组件的事件监听（对原始事件的包装，参数为context,可以获取表单或行数据）
* 类型：Function(context)
* 示例：
```js
component:{
    on:{
        // 注意：必须要on前缀
        onClick({value,key,row,form,getComponentRef,$event}){
            //$event为原始事件
            console.log('点击事件',key,value,row,form)
        }
    }
}
```


### component.slots
* 说明：组件的插槽
* 示例： 
```js
//本示例演示，输入框后缀插槽里面放入一个图标
component:{
    name:"a-input"
    slots:{
        suffix:(scope)=>{
            // scope 包含当前上下文，比如行数据，表单数据等
            return <fs-icon icon={"ion:eye-outline"}/>
        }
    }
}
```

### component.[xxx]
* 说明：组件的其他属性，你需要到对应组件的文档中查找该组件支持哪些属性
* 

### component.props.[xxx]
* 说明：组件的属性（同上）
* 区别：当组件的属性与上面所列的属性名称（name、vModel、on、props等等）有冲突时，可以配置在`props`下




## buttons
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


## FsButton【按钮配置】
* 说明：按钮配置
* 类型：Object
* 相关：[fs-button](./components/crud/basic/fs-button.md)
* 示例：
```
 rowHandle:{
    view:{
        text:"查看",//按钮文字
        title:"查看",//鼠标停留显示的信息
        icon:"", //图标
        iconRight:"", //右侧图标
        circle:false,//是否圆形按钮
        type:"", //a-button，el-button的类型
        style:{},
        disabled:false,
        tooltip:{ //tooltip的属性
            title //a-tooltip 提示内容
            slots:{ //tooltip插槽
                default(){
                    return "n-tooltip的提示内容"
                }
            }
        },
        ...// a-button,el-button的其他配置
    },
}
```



## render
fs中有很多地方可以配置带render的方法，例如：`columns.key.form.render`、`columns.key.form.topRender`、`columns.key.column.cellRender`、`columns.key.form.prefixRender`等等。
所有这些render方法都是通过`jsx/tsx`进行自定义渲染.

使用方法如下：
```js
const crudOptions ={
    columns:{
        name:{
            form:{
                render:(context)=>{
                    return <a-input v-model={[context.form.name, "value"]} />    //<------注意这里的v-model写法
                }
            }
        }
    }
}
```

更多jsx语法，请参考文档：https://github.com/vuejs/babel-plugin-jsx

