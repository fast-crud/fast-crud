# 自定义组件

本章节主要介绍，自定义的组件如何定义与使用

## 自定义一个组件

自定义的组件需要支持v-model（通常所说的受控属性）。

[相关vue文档](https://v3.cn.vuejs.org/guide/component-custom-events.html#v-model-参数)


以下是一个受控自定义组件的示例

```vue
<template>
  <!--   你的自定义受控组件-->
  <div>
    ...
    <a-input :value="data" @update:value="onDataChange"/>
    ...
  </div>
</template>
<script>

import ...
export default defineComponent({
  props: {
    modelValue: {}
  },
  emits: ['update:modelValue','yourCustomEvent'],
  setup(props, ctx) {
    // template上使用data
    const data = ref()

    watch(
        () => {
          return props.modelValue
        }, // 监听modelValue的变化，
        (value) => {
          data.value = value
        }, // 当modelValue值触发后，同步修改data.value的值
        {immediate: true} // 立即触发一次，给data赋值初始值
    )

    // 当data需要变化时，上报给父组件
    // 父组件监听到update:modelValue事件后，会更新props.modelValue的值
    // 然后watch会被触发，修改data.value的值。
    function onDataChange(value) {
      ctx.emit('update:modelValue', value)
    }
    
    //你也可以发射自定义事件
    function emitCustomEvent(){
      ctx.emit('yourCustomEvent', '这里是自定义事件消息')
    }

    return {
      data,
      onDataChange
    }
  }

})
</script>
```

## 在fast-crud配置中使用

```js
import YourCustomComponent from './your-custom-component.vue'
const crudOptions= {
    columns:{
        key:{
            form: {
                component: {
                    //局部引用子表格，要用shallowRef包裹
                    name: shallowRef(YourCustomComponent),
                    vModel: "modelValue",
                    on:{
                        //处理自定义事件
                        onYourCustomEvent(context){
                            console.log('自定义事件',context)
                        }
                    }
                }
            }
        }
    }
}
```


## 相关示例

[嵌套子表格当做输入组件](http://fast-crud.docmirror.cn/antdv/#/crud/advanced/nest)


[独立使用表单自定义组件](http://fast-crud.docmirror.cn/antdv/#/crud/feature/v-model)

