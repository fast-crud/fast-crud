# 表单高级用法

## 自定义按钮提交表单

在一些场景下，我们需要自定义按钮来提交表单，而不是使用默认的提交按钮

```ts
import {toInteger} from "lodash-es";

const crudOptions = {
    form: {
        wrapper: {
            buttons: {
                custom: {
                    text: "自定义按钮",
                    order: -1,
                    click: async (context: FormWrapperContext) => {
                        message.info("通过自定义按钮，触发保存");
                        // 这里可以触发保存
                        await context.submit();
                        message.info("保存成功");
                        
                    
                        // 你也可以不用默认的submit方法，自己定义保存逻辑
                        //触发校验
                        await context.formRef.value.validate();
                        //你自己的提交逻辑
                        await yourSubmitMethod(context.getFormData());
                        //关闭弹窗
                        await context.close();
                    }
                },
            }
        }
    }
}

```

```ts
type FormWrapperContext = {
    formWrapperId, //string 表单容器id
    close, //func 关闭对话框
    open, //func 打开对话框
    title, //string 对话框标题
    fullscreenEnabled, //boolean 是否支持全屏
    fullscreen, //boolean 是否全屏
    toggleFullscreen, //func 切换全屏
    submit, //func 提交表单方法
    reset, // func 重置表单方法
    loading, //boolean 是否正在提交，属性
    getFormData, //func 获取表单数据的方法
    setFormData, //func 填充表单数据的方法
    onValueChange, //func 表单值变化的回调
    formRef, //ref 表单组件的ref
    form, // object 表单数据， {xxx:xxx}
    mode //string, 表单模式,可选值：add,edit,view
}

```