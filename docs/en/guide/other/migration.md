# 从d2-crud-plus迁移
由于API已完全重构，无法直接迁移。但大体思路是没变的，以下列出`crudOptions`变化的部分。

## columns
 * 由array变为object

## 列的配置
 * 从`columns[index]`移到`columns[key].column`下

## 数据字典
 * 数据字典从配置变为对象配置，可以通过引用变量直接操作data
 * `dict:{url:'xxx'}` --> `dict:dict({url:'xxxx'})`
