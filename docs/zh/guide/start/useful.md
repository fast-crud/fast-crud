# 常见需求实现

## 1. 调整列宽，底部滚动条

```ts
app.use(FastCrud, {
    commonOptions(props: UseCrudProps): CrudOptions {
        const opts: CrudOptions = {
            table: {
                //设置scroll 底部可以出现滚动条
                scroll: {
                    x: 2000, //antdv
                },
                scrollX: 2000, //navie-ui
            },
            columns: {
                //配置最后一列空白，用于自动伸缩列宽
                __blank__: {
                    title: '',
                    type: 'text',
                    form: {
                        show: false,
                    },
                    column: {
                        order: 99999,
                        width: -1,
                        columnSetShow: false,
                        resizable: false,
                        conditionalRender: {
                            match() {
                                return false;
                            },
                        },
                    },
                },
            },
        }
    }
});

//在全局注册字段合并组件，给每个字段设置默认宽度，支持自动拖动调整列宽
registerMergeColumnPlugin({
    name: 'resize-column-plugin',
    order: 2,
    handle: (columnProps: ColumnCompositionProps) => {
        if (!columnProps.column) {
            columnProps.column = {};
        }
        if (columnProps.column.resizable == null) {
            columnProps.column.resizable = true;
            if (!columnProps.column.width) {
                columnProps.column.width = 200;
            }
        }

        return columnProps;
    },
});

```

## 2. 显示查询字段组件
```ts
const crudOptions = {
    columns:{
        fieldKey:{
            search:{
                show:true //查询组件默认隐藏，你需要手动设置show=true
            }
        }
    }
}

```


## 3. 行选择（多行，单行选择，跨页选择）

[行选择插件](../../api/crud-options/settings.md#plugins-rowSelection)


## 4. 手机模式适配

[手机模式适配插件](../../api/crud-options/settings.md#plugins-mobile)


## 5. 操作列按钮根据行数据显隐
[动态计算示例](http://fast-crud.docmirror.cn/antdv4/#/crud/basis/compute)
```js
const crudOptions = {
    rowHandle:{
        buttons:{
            edit:{
                show : compute(({row})=>{
                    return row.editable === true
                })
            }
        }
    }
}
```



## 6. 添加时候启用，编辑时禁用
```js
const crudOptions = {
    cplumns:{
        fieldKey:{
            form:{
               //被viewForm 、addForm 和editForm继承
            },
            addForm:{
                //添加表单里面该字段的配置，会继承form的配置
                component:{
                    disabled:false
                }
            },
            editForm:{
                //编辑表单里面该字段的配置，会继承form的配置
                component:{
                    disabled:true
                }
            },
            viewForm:{
                //查看表单里面该字段的配置，会继承form的配置
                component:{
                    disabled:true
                }
            }
        }
    }
}
```

## 7. 动态增减表单项

```js
const formWrapperRef = crudExpose.getFormWrapperRef();
const columnsRef = toRef(formWrapperRef.formOptions, "columns");

//动态修改 columnsRef即可,比如：
// 此时无法使用type精简配置
// 配置项请参考：http://fast-crud.docmirror.cn/api/crud-options/columns/form.html
columnsRef.value.newField = { 
    component:{
        name: "a-input"
    }
}
```
