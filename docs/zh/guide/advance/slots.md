# slots【插槽】
FastCrud内可以有很多地方都能通过插槽自定义内容。 

## 占位插槽
布局插槽使用`-`作为连接符

### 页面占位插槽

#### header
* header-top 
* header-middle
* header-bottom

#### search
* search-left
* search-middle
* search-right

#### actionbar
* actionbar-left
* actionbar-right

#### toolbar
* toolbar-left
* toolbar-right

#### footer
* footer-top
* footer-bottom

### 表单占位插槽
* 示例：[antdv](http://fast-crud.docmirror.cn/antdv/#/crud/slots/form) | [element](http://fast-crud.docmirror.cn/crud/element/#/crud/slots/form)
* scope: {index`序号`,mode`模式：add/view/edit`,_self:`formWrapper实例`,getFormData:`获取表单数据方法`}
#### form-header
* form-header-left
* form-header-right

#### form-header-action
* form-header-action-left
* form-header-action-right

#### form-body
* form-body-top
* form-body-bottom

#### form-footer
* form-footer-left
* form-footer-right

## 字段插槽
字段插槽可以自定义实现很多复杂的显示和输入    
字段插槽通过`_`作为连接符
### search【查询字段插槽】
* 命名规则：`'search_'+字段key`
* 示例：[antdv](http://fast-crud.docmirror.cn/antdv/#/crud/slots/search) | [element](http://fast-crud.docmirror.cn/element/#/crud/slots/search)
* scope: {index`序号`,mode`模式：search`,row:`行数据`,form:`表单数据`}

### cell【单元格字段插槽】
* 命名规则：`'cell_'+字段key`
* 示例：[antdv](http://fast-crud.docmirror.cn/antdv/#/crud/slots/cell) | [element](http://fast-crud.docmirror.cn/element/#/crud/slots/cell)
* scope: {index`序号`,row:`行数据`}

### form【表单字段插槽】
* 命名规则：`'form_'+字段key`
* 示例：[antdv](http://fast-crud.docmirror.cn/antdv/#/crud/slots/form-item) | [element](http://fast-crud.docmirror.cn/element/#/crud/slots/form-item)
* scope: {index`序号`,mode`模式：add/view/edit`,row:`行数据`,form:`表单数据`}
