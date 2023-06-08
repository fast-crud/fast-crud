
# crudOptions.request
请求相关配置


## transformQuery
* 说明：`pageRequest`列表请求参数转换，当框架传入的`query`参数不符合`pageRequest`参数结构时，可配置此方法进行通用转换
* 类型：Function({page,form,sort})
* 参数：page:{pageSize:`每页条数`,currentPage:`当前页码`}
* 参数：form:{`查询框获得的参数`}
* 参数：sort:{prop:`排序字段key`,order:`string,升序还是降序`,asc:`boolean，是否升序`}
* 返回：query：`pageRequest所需要的参数`
* 示例：
```js
const crudOptions={ 
  request: {
    // pageRequest请求参数转换
    transformQuery: ({ page, form, sort }) => {
      const order = sort == null?{}:{orderProp:sort.prop,orderAsc:sort.asc}
        //改造成你的后端所能接受的参数结构
      return { current: page.currentPage, size: page.pageSize, ...form,...order };
    }
  }
}
```

## transformRes 
* 说明：`pageRequest`列表请求结果转换，当`pageRequest`返回的结构与下面“返回”不一致时，可以配置此方法将返回结果转换为本框架所需要的格式
* 类型：Function(res)
* 参数：res: pageRequest返回的结果
* 返回：{records:[]`列表数据`,currentPage:number`当前页码`,pageSize:number`每页条数`,total:number`总记录数`}
* 示例：
```js
const crudOptions= {
  request: {
    // pageRequest请求结果转换
    transformRes: ({ res }) => {
      //将后端返回的结果，改造成fs所需要的结构
      return { currentPage: res.current, pageSize: res.size, ...res };
    }
  }
}
```

::: tip
你也可以直接在`pageRequest()`里面做处理也是可以的，不过不太推荐此方式
```js
async pageRequest(opts){
   // 转化opts为你后台接口所需要的结构
   //opts ={page,form,sort}
   const ret = await api.request(newOpts)
   // 转化ret 为 fast-crud所需要的结构
   // newRet = {records,currentPage,pageSize,total}
   return newRet;
}
```
:::

## editRequest
* 说明：编辑对话框，点击保存后发出的保存修改的请求
* 类型：async Function({ form, row })
* 示例：
```json
{
  request: {
    editRequest:async ({ form, row }) => {
      form.id = row.id;
      return await api.UpdateObj(form);
    };
  }
}
```



## pageRequest
* 说明：页面数据请求
* 类型：async Function(query)
* 参数：query: `transformQuery`返回的参数，若`transformQuery`未配置，则为`{page,form,sort}`
* 返回：res:{}
* 示例：
```js
const pageRequest = async (query)=>{
    const url = "/your/crud/page/request/url"
    return axios({url,data:query});
};
// 所有demo里面都有的
const crudOptions= {
  request: {
    pageReqest:pageRequest
  }
}

```


## addRequest

* 说明：添加对话框，点击保存后发出的请求
* 类型：async Function({ form })
* 示例：
```json
{
  request: {
    addRequest: async ({ form }) => {
      return await api.AddObj(form);
    };
  }
}
```

## delRequest

* 说明：操作列，点击删除按钮发出的请求
* 类型：async Function({row})
* 示例：
```json
{
  request: {
    delRequest: async ({ row }) => {
      return await api.DelObj(row.id);
    };
  }
}
```

## infoRequest

* 说明：详情请求,在add,edit,view对话框打开前，先通过infoRequest获取详情，作为初始表单，如果不配置则以表格数据作为初始值
* 类型：async Function({mode,row}) : row
* 示例：
```js
const crudOptions = {
  request: {
    infoRequest: async ({ mode, row }) => {
      if(mode === 'edit'){
          //编辑的时候去后台获取最新的详情
          return await api.GetObj(row.id);
      }   
      //其他情况下直接使用表格中的行数据作为初始表单
      return row;
    };
  }
}
```
