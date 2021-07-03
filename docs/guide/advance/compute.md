# 动态计算

动态计算分为三类
1. `ref、computed`类,将配置传入一个`ref`或者`computed`，就能够动态变化。
2. `compute` 同步计算，基于`vue`的`computed`，但又有所不同。
3. `asyncCompute`异步计算，基于`vue`的`watch 和 computed`实现。 
 
动态计算主要用于解决配置需要动态变化的问题.    
对于第1类：实际上修改`crudBinding.xx.xx.xx`相应的属性也能实现动态，并且更精准，而`ref或computed`方式更灵活     
而2、3类则更为强大，可以根据当前上下文（form和row数据）进行动态计算。    

动态计算demo：
[antdv版](http://fast-crud.docmirror.cn/antdv/#/basis/compute)  | 
[element版](http://fast-crud.docmirror.cn/antdv/#/basis/compute)

## ref和computed【ref引用】
可以给`crudOptions`里的属性配置`ref`即可实现全局动态变化。     
你只需保存ref的引用，然后通过修改ref.value，达到动态修改的目的。    
实际上通过直接修改`crudBinding.xxx.xxx.xxx`也可以达到一样的效果，你可以根据实际情况酌情选用
```js
//默认ref不显示table
const showTableRef = ref(false)
//或者使用computed计算出是否显示table
const showTableComputed = computed(()=>{
    return showTableRef.value
})
const crudOptions = {
    table:{
        show:showTableRef //换成showTableComputed是一样的效果
    }
}

// 当修改showTableRef.value=true，可实现table的动态显隐
showTableRef.value = true

```
:::warning
某些配置可能不支持此方式进行动态，当出现问题时您可以提交issue，需要进行具体分析。             
建议只将末端配置使用`ref或computed`    
:::

## compute 【同步计算】
> 注意后面没有`d`，基于`vue`的`computed`，与之用法类似，但不是同一个东西

* 方法：compute(Function(context))
* context： [上下文](#context【上下文】)，一般包含`row`/`form`/`index`/`getComponentRef`
* return: 返回计算后的配置值

示例：
```js
import { useCompute } from "@fast-crud/fast-crud";
const {compute} = useCompute()
const crudOptions: {
    form:{
        // 根据当前上下文动态计算form.show的值
        show: compute((context)=>{
            return context.form.xxx === yyy;
        })
    }
}
```


比如很常见的需求：        
一个用户表，有个用户类型字段`userType`,可能的值为：`公司`或`个人`。     
我们要实现，当选择`公司`时，需要额外`上传营业执照`、`填写信用代码`的功能。    
就需要在`userType`字段选中`公司`的时候，将`上传营业执照`和`信用代码`的输入框显示出来。选择`个人`时则不显示。
```js
import {useCompute} from '@fast-crud/fast-crud'
const {compute} = useCompute()
const crudOptions = {
    columns:{
        grade:{
            title: '年级',
            type: 'text',
            form: {
                component:{
                    name:'a-select',
                    options: asyncCompute()
                }
            }
        },
        businessLicenceImg :{
            title: '营业执照上传',
            type: 'avatar-uploader',
            form:{
                show:compute((context)=>{
                    // 通过动态计算show属性的值，当前表单内的userType值为organization，才显示此字段
                    return context.form.userType ==='organization'
                })
            }
        },
        businessLicenceCode :{
            title: '营业执照号码',
            type: 'text',
            form:{
                show:compute((context)=>{
                    // 通过动态计算show属性的值，当前表单内的userType值为organization，才显示此字段
                    return context.form.userType ==='organization'
                })
            }
        }
    }
}

```

## asyncCompute 【异步计算】
当我们要计算的值需要从网络请求或者从其他地方异步获取时可以使用此方法配置

* 方法：asyncCompute({watch?,asyncFn})
* 参数`watch`：Function(context) ,可为空，监听一个值，当这个返回值有变化时，触发asyncFn。不传则asyncFn只会触发一次
* 参数`asyncFn`：asyncFn:Function(watchValue`watch的返回值`,context) ,异步获取值

例如：年级班级选择联动
```js
import {compute} from '@fast-crud/fast-crud'
const crudOptions = {
    columns:{
        grade:{
            title: '年级',
            type: 'text',
            form: {
                component:{
                    name:'a-select',
                    //配置异步获取选择框的options
                    options: asyncCompute({
                        //没有配置watch，只会触发一次
                        asyncFn: async ()=>{
                            //异步获取年级列表
                            return request({url:"/getGradeList"})
                        }
                    })
                }
            }
        },
        class :{
            title: '班级',
            type: 'avatar-uploader',
            form:{
                component:{
                    name:'a-select',
                    //配置异步获取选择框的options
                    options: asyncCompute({
                        //监听form.grade的值
                        watch((context)=>{
                            return context.form.grade
                        }),
                        //当watch的值有变化时，触发asyncFn,获取班级列表
                        asyncFn: async (watchValue,context)=>{
                            return request({"/getClassList?grade=" + watchValue})
                        }
                    })
                }
            }
        },
    }
}

```

## context【上下文】
在如下三个位置会具有上下文。(对应字段下的几个配置)
* `表格的每一行所有列`是一个上下文范围
* `表单里的所有字段`是一个上下文范围（表单里又分为addForm、editForm、viewForm）
* `搜索框的所有字段`是一个上下文范围
`context`里面的内容根据所处的位置不同，包含的内容不同,比如在表格行的上下文里面就没有form,具体有什么你可以在实际使用过程中log出来看看
```js
context = {
    row:Object, 
    form:Object, //表格行的context里没有
    index:number, //addForm和search的context里没有
    getComponentRef:Function(columnKey) //获取上下文范围内的组件ref实例
}
```

## 适用范围
`columns.key.form`、`columns.key.xxxForm`、`columns.key.column`、`columns.key.search`、`rowHandle`下的所有属性均可以使用动态计算

