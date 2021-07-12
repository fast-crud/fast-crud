# form
* 说明: 表单基本配置
* 类型： Object
* 支持： [el-form],[a-form]的配置

>调用[FsFormWrapper](/api/components/crud/crud/fs-form-wrapper)组件实例的`open`方法即可打开表单对话框。    
>此处的`form`会作为表单基本配置，分别与`addForm`、`editForm`、`viewForm`合并。     
>然后作为参数传入open对话框，从而打开不同mode的表单对话框

表单的字段布局伪代码
```html
<el-form>
    <el-row class="fs-row">
        <el-col class="fs-col" v-for="item of columns">
            <el-form-item>表单字段</el-form-item>
        </el-col>
    </el-row>
</el-form>
```

## display
* 说明: 表单布局方式
* 类型：String
* 可选：flex , grid
* 默认：flex

> flex模式：通过`a-col`/`el-col`分栏组件控制字段布局    
> grid模式：通过`display:grid`样式来控制字段布局


## col
* 说明: `el-col`|`a-col`配置
* 类型：Object
* 默认：`{span:12}` 一行显示两个字段，分两列布局（如果配置`{span:24}`，则为单列布局）


## el-form,a-form配置
* 说明: 支持`el-form`|`a-form`配置
* 类型：Object
* 示例: [antdv](http://fast-crud.docmirror.cn/antdv/#/form/independent) |  [element](http://fast-crud.docmirror.cn/element/#/form/independent)
```json5
//element
{ // crudOptions.form
    labelPosition: "right",
    labelWidth: "100px", //
    //更多配置请查看antdv文档，form表单章节
}
```

```json5
//antdv
{ //crudOptions.form
    labelAlign: "right",
    labelCol: { span: 8},
    wrapperCol: {span: 14 },
    //更多配置请查看element-plus文档，form表单章节
}
```


## wrapper
* 说明: 表单容器配置（`对话框`或`抽屉`）
* 类型：Object
* 参考：支持el-dialog，el-drawer，a-modal，a-drawer的配置，取决于[wrapper.is](#wrapper-is)配置

### wrapper .is
* 说明: 确定表单容器组件
* 类型：String
* 默认：el-dialog / a-modal
* 可选：el-dialog / el-drawer / a-modal / a-drawer

### wrapper .onOpen
* 说明: 对话框打开事件处理方法
* 类型：Function

### wrapper .onOpened
* 说明: 对话框打开完成事件处理方法
* 类型：Function

### wrapper .onClosed
* 说明: 对话框关闭事件处理方法
* 类型：Function


## columns
* 说明: 字段列配置。（FastCrud初始化时会通过`crudOptions.columns.[key].form`的配置自动生成，无需主动配置）
* 类型：Object
* 示例：

```json5
{ //crudOptions.form.columns
  columnKey: {
    title: '字段名',
    component: {},
    rules: []
  }
}
```

## group
* 说明: 表单分组配置
* 类型：Object
* 示例： [antdv-collapse](http://fast-crud.docmirror.cn/antdv/#/form/group) | 
[antdv-tabs](http://fast-crud.docmirror.cn/antdv/#/form/group-tabs) | 
[element-collapse](http://fast-crud.docmirror.cn/element/#/form/group) | 
[element-tabs](http://fast-crud.docmirror.cn/element/#/form/group-tabs)
```json5
{ // crudOptions.form
    group: {
      type: "collapse", //or tabs
      // 此处支持：el-collapse / a-collapse / el-tabs / a-tabs 参数
      accordion: true, //手风琴模式
      groups: {
        base: { //分组key，可随意命名
          columns: [ 'columnKey1', 'columnKey2'] //该分组包含的字段keys
        }
      }
    }
}
```
### group.type
* 说明: 表单分组组件类型
* 类型：String
* 默认：collapse
* 可选值： collapse，tabs

### group.groups
* 说明: 分组配置
* 类型：Object:{[groupKey]:Object}
```json5
{  //crudOptions.form.group.groups
  groupKey: { //分组key，可随意命名
     // 此处支持el-collapse-item，el-tab-pane，a-collapse-panel，a-tab-pane
      title: "标题",//el-collapse-item参数
      label: "标题", //el-tab-pane参数
      header:"标题", // a-collapse-panel 参数
      tab: "标题", // a-tab-pane 参数
      slots: {
        //插槽，可以自定义标题
      }, 
      columns: [ 'columnKey1', 'columnKey2'], //该分组包含的字段keys
  }
}
```

## doSubmit
* 说明: 提交表单时执行的方法（独立使用表单时，通过`formRef.submit()`可触发此方法）
* 类型：async Function(context)
* 默认：默认无需配置，通过`useCrud`自动生成
