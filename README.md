# fast-crud
[English](./README.md) | [简体中文](./README_zhCN.md)

Fastcrud is an options-oriented crud development framework based on vue3. It can rapidly develop crud functions and can be used as the basic framework of a low code platform.    
It is easy to get started, has strong scalability, and has rich examples so that you can quickly complete the task of moving bricks.

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
      columns: { //field conf
        id: {// id
          title: "ID",
          type: "number", //field type
          column: { width: 50},
          form: { show: false }
        },
        name: { // name field
          title: "name",
          type: "text", //text type field
          search: { show: true } // show search
        },
        city: { // city field
          title: "city",
          type: "dict-select", // select type field
          search: { show: true }, // show search
          dict: dict({ //local dict
            value: "id",
            label: "text",
            data: [
              { id: "sz", text: "shenzhen", color: "success" },
              { id: "gz", text: "guangzhou", color: "primary" },
              { id: "bj", text: "beijing" },
              { id: "wh", text: "wuhan" },
              { id: "sh", text: "shanghai" }
            ]
          })
        },
        radio: {
          title: "status",
          search: { show: true }, //show search
          type: "dict-radio", //radio type field
          dict: dict({ //remote dict
            url: "/dicts/OpenStatusEnum?single"
          })
        }
      }
    }
```

2、 Get a complete crud
![](./docs/images/crud-en.png)




## Feature
### 1. Options-oriented crud programming
* According to the crud options, the crud function can be developed quickly

### 2. data dictionary
* Support local and remote dictionaries
* With the help of select, it is easy to store the value in the data, which needs the label of the corresponding dictionary to show the requirements

### 3. Rich field types
* Simplify the options by configuring the field type `column.type`
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


