# 动态计算
 
这里的动态计算是基于`vue`的`computed`的，但又有所不同。      
主要用于解决某些配置项需要根据当前上下文数据动态变化的问题。    

动态计算demo：
[antdv版](http://fast-crud.docmirror.cn/antdv/#/basis/compute)  | 
[element版](http://fast-crud.docmirror.cn/antdv/#/basis/compute)

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

`context`里面的内容根据所处的位置不同，包含的内容不同,比如在表格行的上下文里面就没有form
```js
context = {
    row:Object, 
    form:Object, //表格行的context里没有
    index:number, //addForm和search的context里没有
    getComponentRef:Function(columnKey) //获取上下文范围内的组件ref实例
}
```

## 适用范围
`columns.key.form`、`columns.key.xxxForm`、`columns.key.column`、`columns.key.search`下的所有属性均可以使用动态计算

