import { requestForMock } from "../../../api/service";
const request = requestForMock;
const apiPrefix = "/formLayoutFlex";
export function GetList(query) {
  return request({
    url: apiPrefix + "/page",
    method: "get",
    data: query
  });
}

export function AddObj(obj) {
  return request({
    url: apiPrefix + "/add",
    method: "post",
    data: obj
  });
}

export function UpdateObj(obj) {
  return request({
    url: apiPrefix + "/update",
    method: "post",
    data: obj
  });
}

export function DelObj(id) {
  return request({
    url: apiPrefix + "/delete",
    method: "post",
    params: { id }
  });
}

export function GetObj(id) {
  return request({
    url: apiPrefix + "/info",
    method: "get",
    params: { id }
  });
}
export function GetRoleList() {
  return request({
    url: apiPrefix + "/getAllRole",
    method: "get"
  });
}

export function DoAuthz(userId, roleIds) {
  return request({
    url: apiPrefix + "/authz",
    method: "post",
    params: { userId },
    data: roleIds
  });
}
