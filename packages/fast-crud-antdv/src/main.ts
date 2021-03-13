import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { FastCrud } from "@fast-crud/fast-crud";
import Antd, { message, notification, Modal } from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import "./style/common.less";

import { request, requestForMock } from "./api/service";
import "./mock";
import icons from "./icons";
import i18n from "./i18n";
import FsFileUploader from "./extends/file-uploader";
import FsUploader from "./extends/file-uploader/uploader";
const app = createApp(App);
app.use(Antd);
// app.use(ElementPlus, { size: 'small', zIndex: 3000, i18n: i18n.global.t })
app.use(router);
app.use(i18n);
app.use(icons);
app.use(FastCrud, {
  async dictRequest({ url }) {
    return await requestForMock({ url });
  },
  commonOptions() {
    return {
      table: {
        size: "small",
        pagination: false
      },
      request: {
        transformQuery: ({ page, form }) => {
          return { current: page.currentPage, size: page.pageSize, ...form };
        },
        transformRes: ({ res }) => {
          return { currentPage: res.current, pageSize: res.size, ...res };
        }
      },
      form: {
        display: "flex"
      }
    };
  },
  ui: {
    name: "antdv",
    target: {
      Message: message,
      Notification: notification,
      MessageBox: Modal
    }
  }
});
app.use(FsFileUploader);
app.use(FsUploader, {
  defaultType: "cos",
  cos: {
    domain: "https://d2p-demo-1251260344.cos.ap-guangzhou.myqcloud.com",
    bucket: "d2p-demo-1251260344",
    region: "ap-guangzhou",
    secretId: "", //
    secretKey: "", // 传了secretKey 和secretId 代表使用本地签名模式（不安全，生产环境不推荐）
    getAuthorization(custom) {
      // 不传secretKey代表使用临时签名模式,此时此参数必传（安全，生产环境推荐）
      return request({
        url: "/upload/cos/getAuthorization",
        method: "get"
      }).then(ret => {
        // 返回结构如下
        // ret.data:{
        //   TmpSecretId,
        //   TmpSecretKey,
        //   XCosSecurityToken,
        //   ExpiredTime, // SDK 在 ExpiredTime 时间前，不会再次调用 getAuthorization
        // }
        return ret;
      });
    },
    successHandle(ret) {
      // 上传完成后可以在此处处理结果，修改url什么的
      console.log("success handle:", ret);
      return ret;
    }
  },
  alioss: {
    domain: "https://d2p-demo.oss-cn-shenzhen.aliyuncs.com",
    bucket: "d2p-demo",
    region: "oss-cn-shenzhen",
    accessKeyId: "",
    accessKeySecret: "",
    getAuthorization(custom, context) {
      // 不传accessKeySecret代表使用临时签名模式,此时此参数必传（安全，生产环境推荐）
      return request({
        url: "/upload/alioss/getAuthorization",
        method: "get"
      }).then(ret => {
        console.log("ret", ret);
        return ret;
      });
    },
    sdkOpts: {
      // sdk配置
      secure: true // 默认为非https上传,为了安全，设置为true
    },
    successHandle(ret) {
      // 上传完成后可以在此处处理结果，修改url什么的
      console.log("success handle:", ret);
      return ret;
    }
  },
  qiniu: {
    bucket: "d2p-demo",
    getToken(custom) {
      return request({
        url: "/upload/qiniu/getToken",
        method: "get"
      }).then(ret => {
        return ret; // {token:xxx,expires:xxx}
      });
    },
    successHandle(ret) {
      // 上传完成后可以在此处处理结果，修改url什么的
      console.log("success handle:", ret);
      return ret;
    },
    domain: "http://d2p.file.veryreader.com"
  },
  form: {
    action: "/api/upload/form/upload",
    name: "file",
    withCredentials: false,
    successHandle(ret) {
      // 上传完成后的结果处理， 此处后台返回的结果应该为 ret = {code:0,msg:'',data:fileUrl}
      if (ret == null || ret === "") {
        throw new Error("上传失败");
      }
      return { url: ret };
    }
  }
});
app.mount("#app");
