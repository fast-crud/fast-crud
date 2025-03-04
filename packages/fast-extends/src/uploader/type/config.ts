import { FsUploaderAliossSTS, FsUploaderGetAuthContext, FsUploaderOptions } from "../d/type";
import { cloneDeep } from "lodash-es";

export const defaultConfig: FsUploaderOptions = {
  defaultType: "cos", // 默认的上传后端类型
  cos: {
    // 腾讯云 cos 的配置
    domain: "https://d2p-demo-1251260344.cos.ap-guangzhou.myqcloud.com",
    bucket: "d2p-demo-1251260344",
    region: "",
    secretId: "", //
    secretKey: "", // 传了secretKey 和secretId 代表使用本地签名模式（不安全，生产环境不推荐）
    async getAuthorization(context) {
      // 不传secretKey代表使用临时签名模式时，此参数必传（安全，生产环境推荐）
      throw new Error("请配置config.cos.getAuthorization 或 uploader.getAuthorization");
    }
  },
  alioss: {
    domain: "https://d2p-demo.oss-cn-shenzhen.aliyuncs.com",
    bucket: "d2p-demo",
    region: "oss-cn-shenzhen",
    accessKeyId: "", // "",
    accessKeySecret: "",
    getAuthorization(context: FsUploaderGetAuthContext): Promise<FsUploaderAliossSTS> {
      // 不传secretKey代表使用临时签名模式时（安全）
      return new Promise((resolve, reject) => {
        reject(new Error("请实现config.alioss.getAuthorization，返回Promise获取临时授权token"));
      });
    },
    keepName: false, // 阿里云的精简oss有点问题，中文文件名的文件无法上传
    sdkOpts: {
      // sdk配置
      // secure: false // 默认为非https上传,为了安全，你可以设置为true
    }
  },
  qiniu: {
    bucket: "d2p-demo",
    async getToken(context) {
      throw new Error("请实现config.qiniu.getToken方法，返回Promise获取七牛的授权token{token:xxx,expires:xxx}");
    },
    domain: "http://pzrsldiu3.bkt.clouddn.com"
  },
  s3: {
    bucket: "fast-crud",
    sdkOpts: {
      region: "us-east-1",
      forcePathStyle: true,
      endpoint: "https://play.min.io",
      credentials: {
        accessKeyId: "", //访问登录名
        secretAccessKey: "" //访问密码
      }
    }
  },
  form: {
    successHandle(ret) {
      //处理后端返回，转化为组件所需要的格式：{url:xxxx,key:xxx}
      return ret;
    },
    action: undefined,
    name: "file",
    headers: {},
    data: {}
    // async uploadRequest({ file, action }) {
    //   自定义文件上传请求
    //   return await axios.request();
    // }
  },
  async buildKey(context) {
    const { fileName } = context;
    // 文件key的构建规则
    const date = new Date();
    const fileType = context.fileType ?? "file";
    const keepName = context.keepName ?? false;
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

export const uploaderConfig: FsUploaderOptions = cloneDeep(defaultConfig);
