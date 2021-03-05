import Layout from "../layout/layout.vue";
import LayoutPass from "../layout/layout-pass.vue";
import _ from "lodash-es";
const resources = [
  {
    title: "首页",
    name: "index",
    path: "/index",
    component: "/home/index.vue",
  },
  {
    title: "表单示例",
    name: "form",
    path: "/form",
    redirect: "/form/text",
    children: [
      {
        title: "表单布局",
        path: "/form/layout",
        component: "/form/layout/index.vue",
      },
      {
        title: "表单Grid布局",
        path: "/form/layout-grid",
        component: "/form/layout-grid/index.vue",
      },
      {
        title: "表单Flex布局",
        path: "/form/layout-flex",
        component: "/form/layout-flex/index.vue",
      },
      {
        title: "文本输入(input)",
        path: "/form/text",
        component: "/form/text/index.vue",
      },
      {
        title: "选择(select)",
        path: "/form/select",
        component: "/form/select/index.vue",
      },
      {
        title: "级联(cascader)",
        path: "/form/cascader",
        component: "/form/cascader/index.vue",
      },
      {
        title: "多选(checkbox)",
        path: "/form/checkbox",
        component: "/form/checkbox/index.vue",
      },
      {
        title: "单选(radio)",
        path: "/form/radio",
        component: "/form/radio/index.vue",
      },
      {
        title: "开关(switch)",
        path: "/form/switch",
        component: "/form/switch/index.vue",
      },
      {
        title: "选择联动",
        path: "/form/linkage",
        component: "/form/linkage/index.vue",
      },
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
];

function createRouters(adminRouters) {
  return [
    {
      path: "/",
      name: "/",
      component: Layout,
      redirect: "index",
      children: adminRouters,
    },
  ];
}

let index = 0;
function transformOneResource(resource) {
  const menu = _.cloneDeep(resource);
  let route;
  if (resource.type !== "menu") {
    route = _.cloneDeep(resource);
    if (route.component) {
      let path = "/src/views" + route.component;
      route.component = () => import(/* @vite-ignore */ path);
    } else {
      route.component = LayoutPass;
    }
  }

  return {
    menu,
    route,
  };
}

const buildMenusAndRouters = (resources) => {
  const routes = [];
  const menus = [];

  for (const item of resources) {
    const { menu, route } = transformOneResource(item);
    routes.push(route);
    menus.push(menu);

    if (item.children) {
      if (item.children.length > 0) {
        const ret = buildMenusAndRouters(item.children);
        menu.children = ret.menus;
        route.children = ret.routes;
      }
    }
  }
  return {
    routes,
    menus,
  };
};

function setIndex(menus) {
  for (let menu of menus) {
    menu.index = index;
    index++;
    if (menu.children && menu.children.length > 0) {
      setIndex(menu.children);
    }
  }
}

const ret = buildMenusAndRouters(resources);
const adminRoutes = ret.routes;
const adminMenus = ret.menus;
setIndex(adminMenus);
export const menus = adminMenus;

export const routes = createRouters(adminRoutes);

console.log("menus:", menus, "routes", routes);
