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
        { title: "文本输入", path: "formInput" },
        { title: "选择框", path: "formSelect" },
        { title: "级联", path: "formSelect" },
        { title: "多选", path: "formSelect" },
        { title: "单选", path: "formSelect" },
        { title: "选择联动", path: "formSelect" },
      ],
    },
    {
      title: "高级示例",
      path: "advanced",
      children: [
        { title: "树形表格", path: "advancedInput" },
        { title: "行展开", path: "formSelect" },
        { title: "多选表格", path: "formSelect" },
        { title: "单选表格", path: "formSelect" },
        { title: "批量删除", path: "formSelect" },
        { title: "联动", path: "formSelect" },
      ],
    },
  ],
};
