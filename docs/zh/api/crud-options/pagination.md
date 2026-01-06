# crudOptions.pagination
翻页条配置     
支持 el-pagination / a-pagination 的配置

## show
* 说明：显示或隐藏查询框
* 类型：Boolean
* 默认：`true`

## 对应ui组件pagination的配置
* 支持：支持el-pagination / a-pagination / n-pagination 的配置
* 配置： 具体配置请根据你使用的ui库，前往对应ui库的文档查找相应组件的配置
* 示例：

```json
{
  //crudOptions
  "pagination": {
    "pageSize": 10 //默认pageSize
    onXxxx: ()=>{}, //监听pagination组件的原始事件
    //.... 更多配置，请阅读对应组件的文档
  }
}
```

## _onCurrentChange
* 说明：当前页码改变时触发
* 类型：Function
* 默认：`undefined`
* 参数：
  * current: number - 当前页码
  * pagination: Pagination - 分页配置对象

## _onPageSizeChange
* 说明：每页条数改变时触发
* 类型：Function
* 默认：`undefined`
* 参数：
  * pageSize: number - 每页条数
  * current: number - 当前页码
  * pagination: Pagination - 分页配置对象

  
