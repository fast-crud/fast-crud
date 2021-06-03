
# request 【请求】
请求相关配置


## transformQuery
* 说明：pageRequest请求参数转换，当框架传入的`query`参数不符合`pageRequest`参数结构时，可配置此方法进行通用转换
* 类型：Function({page,form,sort})
* 参数：page:{pageSize:`每页条数`,currentPage:`当前页码`}
* 参数：form:{`查询框获得的参数`}
* 参数：sort:{prop:`排序字段key`,order:`string,升序还是降序`,asc:`boolean，是否升序`}
* 返回：query：`pageRequest所需要的参数`
* 示例：
```json5
{ //crudOptions
  request: {
    transformQuery: ({ page, form, sort }) => {
      const order = sort == null?{}:{orderProp:sort.prop,orderAsc:sort.asc}
      return { current: page.currentPage, size: page.pageSize, ...form,...order };
    }
  }
}
```

## pageRequest 
* 说明：页面数据请求
* 类型：async Function(query)
* 参数：query: `transformQuery`返回的参数，若`transformQuery`未配置，则为{page,form,sort}
* 返回：res:{}
* 示例：
```json5
{
  request: {
    pageReqest:async (query)=>{
      const url = "/your/crud/page/request/url"
      return axios({url,data:query});
    }
  }
}

```


## transformRes 
* 说明：页面数据结果转换，当`pageRequest`返回的结构与下面“返回”不一致时，可以配置此方法将返回结果转换为本框架所需要的格式
* 类型：Function(res)
* 参数：res: pageRequest返回的结果
* 返回：{records:[]`列表数据`,currentPage:number`当前页码`,pageSize:number`每页条数`,total:number`总记录数`}
* 示例：
```json5
{
  request: {
    transformRes: ({ res }) => {
      return { currentPage: res.current, pageSize: res.size, ...res };
    }
  }
}
```

## editRequest
* 说明：编辑对话框，点击保存后发出的保存修改的请求
* 类型：async Function({ form, row })
* 示例：
```json5
{
  request: {
    editRequest:async ({ form, row }) => {
      form.id = row.id;
      return await api.UpdateObj(form);
    };
  }
}
```
## addRequest

* 说明：添加对话框，点击保存后发出的请求
* 类型：async Function({ form })
* 示例：
```json5
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
```json5
{
  request: {
    delRequest: async ({ row }) => {
      return await api.DelObj(row.id);
    };
  }
}
```
