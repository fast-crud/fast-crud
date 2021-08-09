# fast-crud
[English](./README_en.md) | [简体中文](./README.md)

FastCrud 是基于Vue3的面向配置的crud开发框架，快速开发crud功能，可作为低代码平台的基础框架。   
继承并优化了D2CrudPlus的设计思想，入门简单，可扩展性强，丰富的示例，让你可以快速完成搬砖任务，更多的时间划水吹逼。

源码地址:[Github](https://github.com/fast-crud/fast-crud)  /  [Gitee](https://gitee.com/fast-crud/fast-crud)   
示例地址:
[antdv版](http://fast-crud.docmirror.cn/antdv/)  /  [element版](http://fast-crud.docmirror.cn/element/)

文档地址：http://fast-crud.docmirror.cn/

<div style="display:flex;">
<a href="https://gitee.com/fast-crud/fast-crud" target="_blank"
  ><img src="https://gitee.com/fast-crud/fast-crud/badge/star.svg?theme=dark" alt="star"
/></a>  
<a href="https://github.com/fast-crud/fast-crud" target="_blank"
  ><img alt="GitHub stars" src="https://img.shields.io/github/stars/fast-crud/fast-crud?logo=github"
/></a>
</div>


## 开发crud，快如闪电
1、只需简单编写crud配置
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

2、 一个完全体crud就出来了
![](./images/crud.png)




## 特性
### 1. 面向配置的crud编程
* 根据crud配置快速开发crud功能,可作为低代码平台基础框架

### 2. 数据字典
* 支持本地和远程获取
* 配合select，轻松实现数据存的是value值，需要对应字典的label来展示的需求

### 3. 丰富的字段类型
* 通过配置字段类型“column.type”来简化配置
* 根据字段类型不同，自动生成不同的表单组件
* 支持自定义字段类型

### 4. 扩展组件
通过扩展自定义组件，扩展自定义类型

### 5. 多UI支持
支持Antdv、Element，你喜欢哪个就用哪个



## 谁在用fast-crud？
* [battcn/wemirr-platform](https://gitee.com/battcn/wemirr-platform) ：中台管理系统 [预览地址](https://cloud.battcn.com/) , [配套前端ui](https://gitee.com/battcn/wemirr-platform-ui)


## 依赖
### ui组件库
* [Antdv 2x](https://github.com/vueComponent/ant-design-vue) 、[Element-Plus](https://github.com/element-plus/element-plus) 二选一

### 基于
* [vue](https://github.com/vuejs/vue-next) 
* [vitejs](https://github.com/vitejs/vite)


### monorepo
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)


## FsAdmin
示例admin脚手架

### 依赖
* [vue](https://github.com/vuejs/vue-next) 
* [vue-router](https://github.com/vuejs/vue-router-next)
* [antdv 2x](https://github.com/vueComponent/ant-design-vue)
* [vitejs](https://github.com/vitejs/vite)
* [pinia](https://github.com/posva/pinia)
* [purge-icons](https://github.com/antfu/purge-icons)

### 参考如下项目
* [d2-admin](https://github.com/d2-projects/d2-admin)
* [antdv-pro](https://github.com/vueComponent/ant-design-vue-pro)
* [vben-admin](https://github.com/anncwb/vue-vben-admin)

感谢这些优秀的项目





## 我的其他项目
### [dev-sidecar](https://github.com/docmirror/dev-sidecar)
> ---------------来都来了点个star再走呗-----------------↗↗↗↗↗↗↗↗  
> 解谜提示  
> 谜题共三层，前两层是两种不同的编码方式，第三层这里就不剧透了，留一点小乐趣。
