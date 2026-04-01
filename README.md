# fast-crud
[English](./README_en.md) | [简体中文](./README.md)

FastCrud（简称fs） 是基于Vue3的面向配置的crud开发框架，快速开发crud功能，可作为低代码平台的基础框架。   
入门简单，可扩展性强，拥有丰富的示例，让你可以快速完成搬砖任务，更多的时间划水吹逼。



官方开源地址： 
  
[Github](https://github.com/fast-crud/fast-crud)   ![](https://img.shields.io/github/stars/fast-crud/fast-crud?logo=github)    
 [Gitee](https://gitee.com/fast-crud/fast-crud)   ![](https://gitee.com/fast-crud/fast-crud/badge/star.svg?theme=dark)      
  [AtomGit](https://atomgit.com/fast-crud/fast-crud)       ![](https://atomgit.com/fast-crud/fast-crud/star/badge.svg)      

示例地址： [演示预览](http://fast-crud.docmirror.cn/demo/)  

文档地址：http://fast-crud.docmirror.cn/



>
> 注意：本项目的主要目标是实现一个`fs-crud`组件，帮助快速开发crud功能，`admin脚手架`并不是本项目的重点。    
> 你可以通过如下几种方式使用`fast-crud`
> * 直接使用示例中的[`fs-admin`](http://fast-crud.docmirror.cn/admin/)，特点是简单
> * 也可以采用其他的[`admin开源项目`](https://github.com/search?q=vue3+admin)，然后集成[`fast-crud`](http://fast-crud.docmirror.cn/guide/start/integration.html)
> * 我们也挑选了一些比较好的`admin项目`集成`fast-crud`之后做成了[admin-starter](http://fast-crud.docmirror.cn/demo/#二、admin脚手架starter)，助你快速上手

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
支持Antdv、Element、NaiveUI，你喜欢哪个就用哪个



## 谁在用fast-crud？
* [battcn/wemirr-platform](https://gitee.com/battcn/wemirr-platform) ：中台管理系统，java做后台 [预览地址](https://cloud.battcn.com/) , [配套前端ui](https://gitee.com/battcn/wemirr-platform-ui)
* [django-vue3-admin](https://gitee.com/huge-dream/django-vue3-admin) ：基于python ，django的后台管理系统
* 海豹信息，内部使用
* [IoTSharp](https://github.com/IoTSharp/IoTSharp)： IOT管理平台，采用fast-crud做前端
* [SuperApi](https://gitee.com/tmm-top/SuperApi) 无代码CRUD开发平台，后台基于NetCore，前端使用soybean集成fast-crud    

好评如潮，你还不试试？     
![](images/good.png)

## 联系作者

欢迎bug反馈，需求建议，技术交流等（请备注fs）

1、 加群

<p align="center">
<img height=230 src="./images/wxqrcode.png">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<img height=230 src="./images/qq_group.png">
</p>
<p align="center">
微信群
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
QQ群
</p>

2、 加作者好友
<p align="center">
<img height="230" src="./images/me.png">
</p>

## 捐赠
媳妇儿说：“一天到晚搞开源，也不管管老婆孩子！😡😡😡”        
拜托各位捐赠支持一下，让媳妇儿开心开心，我也能有更多时间进行开源项目，感谢🙏🙏🙏
<p align="center">
<img height="380" src="./images/donate.png">
</p>

## 技术支持
* 群里问问题免费解答
* 提供远程控制付费技术支持：
  * 收费标准：88元/半小时，问题解决不了不收费。
  * 问题描述清晰，一般小问题半小时内即可快速解决
  * 一节私教课的钱解决你可能一天都解决不了的问题，扫平你的知识盲区，是很划算的。
  * 请准备好向日葵远程控制


## 依赖
### ui组件库
* [Antdv 3x](https://github.com/vueComponent/ant-design-vue) 、[Element-Plus](https://github.com/element-plus/element-plus) 、[NaiveUI](https://github.com/TuSimple/naive-ui) 三选一

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
* [antdv 3x](https://github.com/vueComponent/ant-design-vue)
* [vitejs](https://github.com/vitejs/vite)
* [pinia](https://github.com/posva/pinia)
* [purge-icons](https://github.com/antfu/purge-icons)

### 参考如下项目
* [d2-admin](https://github.com/d2-projects/d2-admin)
* [antdv-pro](https://github.com/vueComponent/ant-design-vue-pro)
* [vben-admin](https://github.com/anncwb/vue-vben-admin)

感谢这些优秀的项目



## 我的其他项目

| 项目名称 | stars  | 项目描述  | 
| --------- |--------- |----------- |
| [certd](https://github.com/certd/certd/) | <img alt="GitHub stars" src="https://img.shields.io/github/stars/certd/certd?logo=github"/> | 全自动证书管理工具，免费证书申请，自动部署，让你的网站永不过期 |
| [dev-sidecar](https://github.com/docmirror/dev-sidecar/) | <img alt="GitHub stars" src="https://img.shields.io/github/stars/docmirror/dev-sidecar?logo=github"/> | 直连访问github工具，无需FQ，解决github无法访问的问题 |
| [winsvc-manager](https://github.com/greper/winsvc-manager/) | <img alt="GitHub stars" src="https://img.shields.io/github/stars/greper/winsvc-manager?logo=github"/> | 可视化包装应用成为一个Windows服务，使其后台运行 |


> ---------------来都来了点个star再走呗-----------------↗↗↗↗↗↗↗↗  
> DevSidecar解谜提示  
> 谜题共三层，前两层是两种不同的编码方式，第三层这里就不剧透了，留一点小乐趣。


## 鸣谢

* [Tencent EdgeOne](https://edgeone.ai/zh?from=github) ： 本项目 `CDN加速及安全防护`由 `Tencent EdgeOne` 赞助         
  <img src="./images/edgeone.png" width="300px"/>
* [vben5](https://www.vben.pro/) ：fs-admin-antdv4示例 采用vben5的布局框架，感谢vben的开源
* [jetbrains](https://jb.gg/OpenSourceSupport) ：感谢jetbrains提供的免费开源license     
<img src="https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.svg" width="100px"/>
