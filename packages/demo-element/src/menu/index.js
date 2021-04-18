export default {
  menus: [
    {
      title: "首页",
      path: "index",
    },
    {
      title: "表单示例",
      path: "form",
      children: [
        { title: "文本输入", path: "/form/input" },
        { title: "选择框", path: "/form/Select" },
        { title: "级联", path: "/form/Select" },
        { title: "多选", path: "/form/Select" },
        { title: "单选", path: "/form/Select" },
        { title: "选择联动", path: "/form/Select" },
      ],
    },
    {
      title: "高级示例",
      path: "advanced",
      children: [
        { title: "树形表格", path: "/advanced/advancedInput" },
        { title: "行展开", path: "/advanced/formSelect" },
        { title: "多选表格", path: "/advanced/formSelect" },
        { title: "单选表格", path: "/advanced/formSelect" },
        { title: "批量删除", path: "/advanced/formSelect" },
        { title: "联动", path: "/advanced/formSelect" },
      ],
    },
  ],
};
