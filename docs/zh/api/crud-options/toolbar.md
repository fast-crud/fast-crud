
# crudOptions.toolbar 
工具条       
更多参数见：[FsToolbar](/api/components/crud/toolbar/index.md)

## show
* 说明：显示或隐藏工具条
* 类型：Boolean
* 默认：`true`

## buttons

* 说明：按钮配置
* 类型：Object
* 相关：[按钮组配置](../common-options.md#buttons)
```js
const crudOptions = {
    toolbar:{
        buttons:{
            //查询按钮
            search:{
                ...FsButton,
                circle:true,
                order:1,  // 列排序号，数字越小越靠前排列。 默认值为1, 当配置0或负数则排到最前面，配置2则排到最后面
                show:true,
                click:()=>{} //点击事件，默认开启隐藏查询框
            },
            // 刷新按钮
            refresh:{},
            // 紧凑模式
            compact:{},
            // 导出按钮
            export:{},
            // 列设置按钮
            columns:{},
            //自定义button
            customName:{}
        }
    }
}
```



## export
* 说明：导出配置
* 类型：`ExportProps`
* 示例：

```js
const crudOptions = {
    toolbar:{
        buttons:{
          export:{
              show:true
          }  
        },
        export:{
            server:()=>Promise<void>, // 服务端导出方法，配置则开启服务端导出，本地导出则不生效
            //以下为本地导出配置

            // 导出的列配置，不配置则导出全部，类型为 {key:string,title:string,width?:number}[],
            // 推荐通过 crudOptions.columns.key.column.exportable=true 来控制列是否导出
            columns:  null,
            noHeader: false, // 是否不需要表头，仅csv
            filename: 'table', // 导出文件名
            fileType: 'csv' ,// 导出文件类型，可选值：csv | excel=数据比较复杂时使用（包含逗号，换行等）
            dataFrom: 'local', //导出数据来源，可选值：local=本地页面数据 | search=导出前请求接口获取数据
            autoUseDictLabel: true, //是否自动使用字典标签
            searchParams: { //当dataFrom=search时，导出前请求接口获取数据的参数
                //查询条件
                page: {
                    currentPage: 1,
                    pageSize: 99999999
                }
                // 如果以下参数不传，以当前查询条件为准
                // form: {},
                // sort: {}
            },
            merge: [], // excel 合并单元格配置,仅excel生效
            dataFormatter: (opts:DataFormatterContext)=>{
                // 此方法里面要做的是修改row里面的数据
                // { row, originalRow, col } :DataFormatterContext
                //例如 格式化日期
                if (col.key === "date" && originalRow.date) {
                    row.date = dayjs(originalRow.date).format("YYYY-MM-DD HH:mm:ss");
                }
                
                //参数说明
                // DataFormatterContext = {row: any,originalRow: any, key: string, col: ColumnProps, exportCol:ExportColumn}
                // row = 当前行数据
                // originalRow = 当前行原始数据
                // key = 当前列的key
                // col = 当前列的配置
                // exportCol = 当前列的导出配置
            } ,
            columnFilter: (col:ColumnProps)=>{
                //列过滤器，返回true则导出该列
                //例如： 只导出show=true的列
                return col.show ===true
            },
            onlyShow:boolean, //仅导出当前显示的列，与上面的配置效果相同
            columnBuilder: ({col:ExportColumn})=>{
                //列构建器，调整列宽
                col.width = 100
            },
            
        }
    }
}
```


## compact
* 说明：当前是否紧凑模式
* 类型：Boolean
* 默认：`true`


## columnsFilter
* 说明：列设置配置
* 类型：Object


## columnsFilter.mode
* 说明：列设置展示模式
* 类型：string
* 默认值： 无
* 可选值：【simple(简单模式) | default（默认模式）】

## columnsFilter.originalColumns
* 说明：原始列设置, 可以修改列设置选项的显隐和禁用启用
* 类型：ColumnProps[]
* 默认值： 无
```js
// 在列设置中隐藏第三个字段
crudBinding.value.toolbar.columnsFilter.originalColumns[2].columnSetShow = false

// 在列设置中禁止第三个字段勾选
crudBinding.value.toolbar.columnsFilter.originalColumns[2].columnSetDisabled = true

```

## columnsFilter.container
* 说明：自定义列设置布局
* 类型：`{is：string|ShallowRef}`
* 默认值： `{is:"fs-columns-filter-layout-default"}`
* 布局参考： [fs-columns-filter-layout-default](https://github.com/fast-crud/fast-crud/blob/main/packages/fast-crud/src/components/toolbar/fs-table-columns-filter/fs-columns-filter-layout-default.vue)
* 关键： 通过 `inject(ColumnsFilterProvideKey)`获取 `ColumnsFilterContext`, 修改currentColumns内每个列的show值即可
