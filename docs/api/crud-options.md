# crudOptions
crud配置

```js
const crudOptions ={
    request:{},     //http请求
    columns:{},     //列配置
    search:{},      //查询框配置
    actionbar:{},   //动作条(添加按钮)
    toolbar:{},     //工具条
    table:{},       //el-table/a-table的配置
    rowHandler:{},  //操作列配置
    form:{},        //表单的公共配置
    viewForm:{},    //查看表单的独立配置
    editForm:{},    //编辑表单的独立配置
    addForm:{},     //添加表单的独立配置
    pagination:{},  //分页配置
    container:{},   //容器配置
    data:[]         //列表数据
}

```


## request 【请求】
请求相关配置


### transformQuery
* 说明：pageRequest请求参数转换，当框架传入的`query`参数不符合`pageRequest`参数结构时，可配置此方法进行通用转换
* 类型：Function({page,form})
* 参数：page:{pageSize:`每页条数`,currentPage:`当前页码`},form:{`查询框获得的参数`}
* 返回：query：`pageRequest所需要的参数`
* 示例：
```json5
{
  request: {
    transformQuery: ({ page, form }) => {
      return { current: page.currentPage, size: page.pageSize, ...form };
    }
  }
}
```

### pageRequest 
* 说明：页面数据请求
* 类型：async Function(query)
* 参数：query: `transformQuery`返回的参数，若`transformQuery`未配置，则为{page,form}
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


### transformRes 
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

### editRequest
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
### addRequest

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

### delRequest

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

## columns【字段配置】

* 说明：字段配置
* 类型：[key]:Object
* 示例：
```js
const crudOptions = {
    columns:{
        key:{ //字段key名称
            title: '字段名',
            type: 'text'
        }
    }
}
```
### [key].title

* 说明：字段名称
* 类型：String

可以通过如下配置在不同的位置覆盖这里配置的字段名称
```js
const crudOptions = {
    columns:{
        testKey:{
            title: "字段名",
            form:{ //会覆盖 testKey.title
                title:"显示在表单上的字段名"
            },
            addForm:{ //会覆盖form.title
                title:"显示在添加表单上的字段名"
            },
            viewForm:{//会覆盖form.title
                title:"显示在查看表单上的字段名"
            },
            editForm:{//会覆盖form.title
                title:"显示在编辑表单上的字段名"
            },
            search:{//会覆盖form.title
                title:"显示在查询框上的字段名"
            },
            column:{//会覆盖testKey.title
                title:"显示在列上的字段名"
            }
        }
    }
}
```



## search【查询框】

更多参数见：[FsSearch](./components/crud/search/index.md)

### show
* 说明：显示或隐藏查询框
* 类型：Boolean
* 默认：`true`

### buttons
* 说明：按钮配置
* 类型：Object
* 默认： {search:{},reset:{}}
* 示例：
```
{
    search:{
        ...FsButton, //fs-button组件的参数
        order:1, //排序，越小越靠前
        show:true,//是否显示此按钮
        click(){} //点击事件，默认触发查询
    },
    reset:{...同上},// 重置按钮
    custom:{...同上}//可以自定义
}
```

## actionbar 【动作条】

更多参数见：[FsActionbar](./components/crud/actionbar/index.md)

### show
* 说明：显示或隐藏查询框
* 类型：Boolean
* 默认：`true`

### buttons

* 说明：按钮配置
* 类型：Object
* 默认： {add:{...FsButton}}
* 示例：
```
{
    add:{
        ...FsButton, //fs-button组件的参数
        show:true,//是否显示此按钮
        click(){} //点击事件，默认打开添加对话框
    },
}
```

## toolbar 工具条

更多参数见：[FsToolbar](./components/crud/toolbar/index.md)

### show
* 说明：显示或隐藏查询框
* 类型：Boolean
* 默认：`true`

### buttons

* 说明：按钮配置
* 类型：Object
* 默认：[buttons](#buttons)
```
{
    search:{
        ...FsButton,
        order:1,
        show:true,
        click:()=>{} //点击事件，默认开启隐藏查询框
    },
    refresh:{},
    compact:{},
    export:{},
    columns:{}
}
```


## table【表格配置】

更多参数见：[FsTable](./components/crud/crud/fs-table.md)
支持 el-table | a-table的配置

### show
* 说明：显示或隐藏table
* 类型：Boolean
* 默认：`true`


##  rowHandle【操作列配置】

## form:{},        //表单的公共配置
## viewForm:{},    //查看表单的独立配置
## editForm:{},    //编辑表单的独立配置
## addForm:{},     //添加表单的独立配置
## pagination:{},  //分页配置
## container:{},   //容器配置
## data:[]         //列表数据

## component【组件配置】


### component.name
* 说明：组件名
* 类型：String | 组件
* 示例：`a-select`

### component.[xxx]
* 说明：组件的属性
* 示例：`options:[]`

### component.onXxx
* 说明：组件的事件监听（没有context）
* 类型：Function(event)
* 示例：
```js
component:{
    onClick:(event)=>{
        console.log('点击事件',event)
    }
}
```

### component.on
* 说明：组件的事件监听（参数为context,可以获取表单或行数据）
* 类型：Function(context)
* 示例：
```js
component:{
    on:{
        onClick({value,key,row,form,getComponentRef}){
            console.log('点击事件',key,value,row,form)
        }
    }
}
```


## buttons【按钮组配置】
* 说明：按钮配置
* 类型：Object
* 示例：
```
{
    buttonKey:{
        ...FsButton, //fs-button组件的参数
        show:true,//是否显示此按钮
        click:()=>{}//点击事件
        order:1 //排序，越小越靠前
    },
}
```
