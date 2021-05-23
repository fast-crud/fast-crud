# fast-crud
[English](./README.md) | [简体中文](./README_zhCN.md)

Fastcrud is a configuration oriented crud development framework based on vue3. It can rapidly develop crud functions, and can be used as the basic framework of low code platform.    
Inherits and optimizes the design idea of D2CrudPlus. It is easy to get started, has strong scalability, and has rich examples, so that you can quickly complete the task of moving bricks and spend more time rowing.

source :[Github](https://github.com/fast-crud/fast-crud)  /  [Gitee](https://gitee.com/fast-crud/fast-crud)   
demo:
[antdv](http://fast-crud.docmirror.cn/antdv/)  /  [element](http://fast-crud.docmirror.cn/element/)

document：http://fast-crud.docmirror.cn/

<div style="display:flex;">
<a href="https://gitee.com/fast-crud/fast-crud" target="_blank"
  ><img src="https://gitee.com/fast-crud/fast-crud/badge/star.svg?theme=dark" alt="star"
/></a>  
<a href="https://github.com/fast-crud/fast-crud" target="_blank"
  ><img alt="GitHub stars" src="https://img.shields.io/github/stars/fast-crud/fast-crud?logo=github"
/></a>
</div>

>Fast crud is currently in alpha, and the API may change
>The complete redo version of D2CrudPlus based on vue3

## Developing crud is as fast as lightning
1、Just write the crud options
```js
const crudOptions= {
      columns: { //字段配置
        id: {// id字段
          title: "ID",
          type: "number", //字段类型
          column: { width: 50},
          form: { show: false }
        },
        name: { // 姓名字段
          title: "姓名",
          type: "text", //文本类型字段
          search: { show: true } //显示查询
        },
        city: { //城市字段
          title: "城市",
          type: "dict-select", //选择类型字段
          search: { show: true }, //显示查询
          dict: dict({ //本地数据字典
            value: "id",
            label: "text",
            data: [
              { id: "sz", text: "深圳", color: "success" },
              { id: "gz", text: "广州", color: "primary" },
              { id: "bj", text: "北京" },
              { id: "wh", text: "武汉" },
              { id: "sh", text: "上海" }
            ]
          })
        },
        radio: {
          title: "状态",
          search: { show: true }, //显示查询
          type: "dict-radio", //单选类型字段
          dict: dict({ //远程数据字典
            url: "/dicts/OpenStatusEnum?single"
          })
        }
      }
    }
```

2、 Get a complete crud
![](./docs/images/crud.png)




## Feature
### 1. Configuration oriented crud programming
* According to the crud configuration, the crud function can be developed quickly

### 2. data dictionary
* Support local and remote dict
* With the help of select, it is easy to store the value value in the data, which needs the label of the corresponding dictionary to show the requirements

### 3. Rich field types
* Simplify the configuration by configuring the field type `column.type`
* Different form components are generated automatically according to different field types
* Support custom field type

### 4. Extends
Extend the custom type by extending the custom component

### 5. Multi UI support
Support antdv, element, you can use which you like


## dependence
### UI library
[Antdv](https://github.com/vueComponent/ant-design-vue)   
[Element-Plus](https://github.com/element-plus/element-plus)     
Choose one of them


### monorepo
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)


