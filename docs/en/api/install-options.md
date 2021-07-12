# InstallOptions
`app.use(FastCrud,InstallOptions)`

## dictRequest
* 说明：公共字典请求方法
* 类型：async Function(dict) :Array
* 返回：字典数据数组

```js
installOptions = {
    dictRequest: async ({ url })=> {
      return await requestForMock({ url });
    }
}
```

## commonOptions
* 说明：公共CrudOptions,运行时将于页面的crudOptions合并
* 类型：Function():[CrudOptions](./crud-options/)
* 返回：Object:[CrudOptions](./crud-options/)
* 示例：
```js
const installOptions = {
    commonOptions() {
      return {
        table: {
          size: "small", //全局配置表格size为small
        },
    }
}
```

## ui
* 说明：当前使用哪一套ui组件
```js
const installOptions = {
    ui: {
      name: "element", //  or antdv
      target: {
        Message: ElMessage,  // or  message
        Notification: ElNotification, //or notification
        MessageBox: ElMessageBox // or Modal
      }
    }
}
```

