# options

## crudOptions

```js
const crudOptions ={
    request:{},     //http请求
    search:{},      //查询框配置
    actionbar:{},   //动作条(添加按钮)
    toolbar:{},     //工具条
    table:{},       //el-table/a-table的配置
    rowHandler:{},  //操作列配置
    form:{},        //表单的公共配置
    viewForm:{},    //查看表单的独立配置
    editForm:{},    //编辑表单的独立配置
    addForm:{},     //添加表单的独立配置
    columns:{},     //列配置
    pagination:{},  //分页配置
    container:{},   //容器配置
    data:[]         //列表数据
}

```
### request 
请求相关配置

#### transformQuery
* 说明：pageRequest请求参数转换
* 类型：async Function({page,form})
* 参数：page:{pageSize:`每页条数`,currentPage:`当前页码`},form:{查询参数}
* 返回：query
* 示例：
```js
transformQuery: ({ page, form }) => {
    return { current: page.currentPage, size: page.pageSize, ...form };
}
```
#### pageRequest 
* 说明：页面数据请求
* 类型：async Function(query)
* 参数：query: `transformQuery`返回的参数，若`transformQuery`未配置，则为{page,form}
* 返回：res:{}
* 示例：
```json5
{
  request: {
    pageReqest:async (query)=>{
      return axios({url,data:query});
    }
  }
}

```

#### transformRes 
* 说明：页面数据结果转换
* 类型：async Function(query)
* 参数：query: `transformQuery`返回的参数，若`transformQuery`未配置，则为{page,form}
* 返回：res:{}
* 示例：
```json5
{
  request: {
    pageReqest:async (query)=>{
      return axios({url,data:query});
    }
  }
}

```
