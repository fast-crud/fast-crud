# crudOptions.columns[key].search

* 说明：该字段在查询框表单里面的配置
* 类型：`SearchProps`
* 配置同`[key].form`
>初始化时会与`[key].form`合并，然后放入`crudOptions.search.columns[key]`

## [key].search[对应ui组件的配置]
* 说明：formItem配置，支持el-form-item,a-form-item,n-form-item的配置
* 配置： 具体配置请根据你使用的ui库，前往对应ui库的文档查找相应组件的配置
* 类型：any
* 示例：
```js
const crudOptions = {
    columns:{
        key:{
            search:{
                labelWidth:200 //配置查询框的label宽度(此字段仅限element-plus,其他ui请查阅对应ui的文档)
                //... 更多配置，请阅读对应组件的文档
            }
        }
    }
}
```

## [key].search.component
* 说明：查询框字段组件配置
* 类型：`ComponentProps`
参考组件配置[component](../../common-options.md)


## [key].search.valueResolve
* 说明：查询字段值转化，doRefresh查询数据时会被执行
* 类型：`(context:ValueResolveContext)=>void`
```js
const crudOptions ={
  columns:{
      test:{
          search:{
              valueResolve({key,value,form}){  //  <------注意这里是form，不是row
                  if(value!= null){
                      //当后台需要的是int类型，输入的是string，就需要转化一下
                      form[key] = parseInt(value)
                  }
              }
          }
      }
  }   
}
```

## [key].search.order
* 说明：查询排序号，数字越小越靠前排列。
* 类型：number
* 默认值： 1 ， 当配置0或负数则排到最前面，配置2则排到最后面


## [key].search.col
* 说明：查询字段的单独col配置，设置查询字段宽度，支持el-col,a-col,n-col的配置
* 类型：Object
* 示例：
```js
const crudOptions = {
    columns:{
        key:{
            search:{
                col:{span:4} //占据一行的4格
                //像时间范围查询这种，可以配置为{span:8}，占据一行的8格，就可以实现规整的查询框布局
            }
        }
    }
}
```

## [key].search.autoSearchTrigger
* 说明：是否在该字段变化时触发自动查询，需要总的autoSearch开启状态才会生效
* 类型： boolean | 'input' 输入触发 | 'change' 变化时触发 | 'enter'  回车键触发
* 示例：
```js
const crudOptions = {
    columns:{
        key:{
            search:{
                autoSearchTrigger: true  // change | enter | input
            }
        }
    }
}
```


## [key].search.valueChange
* 说明: 值变化触发
* 类型：`(context:ValueChangeScope)=>void`
* 示例：
```js
crudOptions = { //
  columns:{
      key:{
          search:{
              valueChange(context){
                  console.log(context)
              },
          }
      }
  }
}
```

