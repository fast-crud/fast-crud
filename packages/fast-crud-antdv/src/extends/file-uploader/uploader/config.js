export default {
  defaultType: "cos", // 默认的上传后端类型
  cos: {
    // 腾讯云 cos 的配置
    domain: "https://d2p-demo-1251260344.cos.ap-guangzhou.myqcloud.com",
    bucket: "d2p-demo-1251260344",
    region: "",
    custom: {
      // buildKey，获取授权等接口中将会传入
    },
    secretId: "", //
    secretKey: "", // 传了secretKey 和secretId 代表使用本地签名模式（不安全，生产环境不推荐）
    getAuthorization: null // 不传secretKey代表使用临时签名模式时，此参数必传（安全，生产环境推荐）
  },
  alioss: {
    domain: "https://d2p-demo.oss-cn-shenzhen.aliyuncs.com",
    bucket: "d2p-demo",
    region: "oss-cn-shenzhen",
    secretId: "",
    secretKey: "", // 传了secretKey 和secretId 代表使用本地签名模式（不安全，生产环境不推荐）
    getAuthorization(custom) {
      // 不传secretKey代表使用临时签名模式时（安全）
      return new Promise((resolve, reject) => {
        reject(
          new Error(
            "请实现config.alioss.getAuthorization，返回Promise获取临时授权token"
          )
        );
      });
    },
    custom: {
      // buildKey，获取授权等接口中将会传入
      keepName: false // 阿里云的精简oss有点问题，中文文件名的文件无法上传
    },
    sdkOpts: {
      // sdk配置
      // secure: false // 默认为非https上传,为了安全，你可以设置为true
    }
  },
  qiniu: {
    bucket: "d2p-demo",
    getToken(custom, fileName) {
      return new Promise((resolve, reject) => {
        reject(
          new Error(
            "请实现config.qiniu.getToken方法，返回Promise获取七牛的授权token{token:xxx,expires:xxx}"
          )
        );
      });
    },
    domain: "http://pzrsldiu3.bkt.clouddn.com",
    custom: {
      // buildKey，获取授权等接口中将会传入
    }
  },
  form: {
    successHandle(ret) {
      // 需要将res.url 设置为url
      if (ret.data == null || ret.data === "") {
        throw new Error("上传失败");
      }
      return { url: ret.data };
    },
    action: undefined,
    name: "file",
    headers: {},
    data: {},
    custom: {
      // buildKey，获取授权等接口中将会传入
    }
  },
  buildKey(fileName, custom = {}) {
    // 文件key的构建规则
    const date = new Date();
    let fileType = "file";
    if (custom != null && custom.fileType != null) {
      fileType = custom.fileType;
    }
    let keepName = false;
    if (custom.keepName != null) {
      keepName = custom.keepName;
    }
    let ext = "";
    if (keepName) {
      ext = "/" + fileName;
    } else {
      if (fileName.lastIndexOf(".") >= 0) {
        ext = fileName.substring(fileName.lastIndexOf("."));
      }
    }

    return (
      fileType +
      "/" +
      date.getFullYear() +
      "/" +
      (date.getMonth() + 1) +
      "/" +
      date.getDate() +
      "/" +
      Math.floor(Math.random() * 100000000000000) +
      ext
    );
  }
};
