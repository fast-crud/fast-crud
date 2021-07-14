import cascaderData from "./cascader-data";
import { TreeNodesLazyLoader } from "./pcas-data";

const openStatus = [
  { value: "1", label: "打开", color: "success" },
  { value: "2", label: "停止", color: "primary" },
  { value: "0", label: "关闭", color: "danger" }
];

const moreOpenStatus = [
  { value: "1", label: "打开(open)", color: "success" },
  { value: "2", label: "停止(stop)", color: "primary" },
  { value: "0", label: "关闭(close)", color: "danger" }
];

const textStatus = [
  { id: "1", text: "打开", color: "success" },
  { id: "2", text: "停止", color: "primary" },
  { id: "0", text: "关闭", color: "danger" }
];

export function GetTreeChildrenByParentId(parentId) {
  return TreeNodesLazyLoader.getChildren(parentId);
}

export function GetNodesByValues(values) {
  return TreeNodesLazyLoader.getNodesByValues(values);
}

export default [
  {
    path: "/dicts/OpenStatusEnum",
    method: "get",
    handle() {
      return {
        code: 0,
        msg: "success",
        data: openStatus
      };
    }
  },
  {
    path: "/dicts/_OpenStatusEnum2",
    method: "get",
    handle() {
      return {
        code: 0,
        msg: "success",
        data: textStatus
      };
    }
  },
  {
    path: "/dicts/moreOpenStatusEnum",
    method: "get",
    handle() {
      return {
        code: 0,
        msg: "success",
        data: moreOpenStatus
      };
    }
  },
  {
    path: "/dicts/cascaderData",
    method: "get",
    handle() {
      return {
        code: 0,
        msg: "success",
        data: cascaderData
      };
    }
  },
  {
    path: "/tree/GetTreeChildrenByParentId",
    method: "get",
    async handle({ params }) {
      const list = await GetTreeChildrenByParentId(params.parentId);
      return {
        code: 0,
        msg: "success",
        data: list
      };
    }
  },
  {
    path: "/tree/GetNodesByValues",
    method: "get",
    async handle({ params }) {
      const list = await GetNodesByValues(params.values);
      return {
        code: 0,
        msg: "success",
        data: list
      };
    }
  }
];
