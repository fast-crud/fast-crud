# form
* 说明: 表单基本配置
* 类型： Object
* 支持： [el-form],[a-form]的配置

>调用[FsFormWrapper](../components/crud/crud/fs-form-wrapper)组件实例的`open`方法即可打开表单对话框。    
>此处的`form`会作为表单基本配置，分别与`addForm`、`editForm`、`viewForm`合并。     
>然后作为参数传入open对话框，从而打开不同mode的表单对话框



## wrapper
* 说明: 表单容器配置（`对话框`或`抽屉`）
* 类型：Object
* 参考：支持el-dialog，el-drawer，a-modal，a-drawer的配置，取决于[wrapper.is](#wrapper-is)配置

#### wrapper .is
* 说明: 确定表单容器组件
* 类型：String
* 默认：el-dialog / a-modal
* 可选：el-dialog / el-drawer / a-modal / a-drawer
