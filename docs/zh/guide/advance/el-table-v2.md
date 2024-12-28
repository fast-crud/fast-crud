# element 使用虚拟表格
`1.24.1+`版本element支持虚拟表格，虚拟表格可以大幅提升性能

> 当前为体验版，可能存在一些问题，欢迎大家反馈

## 启用虚拟表格步骤

### 1. 注册merge插件
element虚拟表格所有字段必须有宽度，否则会报错，可以使用merge插件自动合并字段
```ts
// main.ts
import {registerMergeColumnPlugin} from '@fast-crud/fast-crud'
//在app.use(FastCrud)之后全局注册默认宽度插件
registerMergeColumnPlugin({
    name: "resize-column-plugin",
    order: 2,
    handle: (columnProps: ColumnCompositionProps, crudOptions: any) => {
        function fillWidth(columnProps: ColumnCompositionProps) {
            if (!columnProps.column) {
                columnProps.column = {};
            }
            //当使用table版本为v2时，设置字段默认宽度
            if (crudOptions.table.tableVersion === "v2") {
                if (!columnProps.column.width) {
                    columnProps.column.width = 150;
                }
            }
            if (columnProps.children && Object.keys(columnProps.children).length > 0) {
                for (const key in columnProps.children) {
                    fillWidth(columnProps.children[key]);
                }
            }
        }

        fillWidth(columnProps);

        return columnProps;
    }
});
```


### 2. 页面上启用table-v2
```ts
//要使用虚拟表格的crud配置修改如下配置即可
const crudOptions = {
    table:{
        tableVersion:"v2",
        fixed:true
    }
}
```