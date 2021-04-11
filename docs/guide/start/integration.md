# 集成到你的项目中

接下来介绍如何将`fast-crud`集成到你的`vue3`项目中

## 集成步骤

在开始着手集成之前，如果你还没有运行过demo，建议您先运行demo项目，在里面[开发一个crud](./first)感受一下

### 1.安装

```shell script
#使用npm
npm i  @fast-crud/fast-crud @fast-crud/fast-crud-extends

```

### 2.引入

 ```javascript
// 引入fast-crud
import {FastCrud} from "@fast-crud/fast-crud";

// 引入ui的通知方法
//如果使用antdvue
import {message, notification, Modal} from "ant-design-vue";

//如果使用element
import {ElMessage, ElNotification, ElMessageBox,} from "element-plus";

app.use(FastCrud, {
    i18n,
    // 此处配置公共的dictRequest
    async dictRequest({ dict }) {
        const res = await requestForMock({ url: dict.url });
        console.log("get dict", res);
        return res;
    },
    // 使用哪套ui
    ui: {
        name: "element",
        target: {
            Message: ElMessage,
            Notification: ElNotification,
            MessageBox: ElMessageBox,
        },
    },
    //公共crud配置
    commonOptions() {
        return {
            ... //你可以在此处配置你的crud公共配置
        };
    },
});
 ```

[更多关于后台返回数据结构的配置说明](/guide/structure.md)


### 3. 安装扩展组件

如果你还需要文件上传、图片裁剪等组件   
那么你还需要安装对应的扩展插件。

以下为文件上传、图片裁剪扩展组件安装示例
```js
import { FsUploader } from "@fast-crud/fast-crud-extends";

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
                method: "get",
            }).then((ret) => {
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
        },
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
                method: "get",
            }).then((ret) => {
                console.log("ret", ret);
                return ret;
            });
        },
        sdkOpts: {
            // sdk配置
            secure: true, // 默认为非https上传,为了安全，设置为true
        },
        successHandle(ret) {
            // 上传完成后可以在此处处理结果，修改url什么的
            console.log("success handle:", ret);
            return ret;
        },
    },
    qiniu: {
        bucket: "d2p-demo",
        getToken(options) {
            return request({
                url: "/upload/qiniu/getToken",
                method: "get",
            }).then((ret) => {
                return ret; // {token:xxx,expires:xxx}
            });
        },
        successHandle(ret) {
            // 上传完成后可以在此处处理结果，修改url什么的
            console.log("success handle:", ret);
            return ret;
        },
        domain: "http://d2p.file.veryreader.com",
    },
    form: {
        action: "/api/upload/form/upload",
        name: "file",
        withCredentials: false,
        successHandle(ret) {
            // 上传完成后的结果处理， 此处后台返回的结果应该为 ret = {code:0,msg:'',data:fileUrl}
            if (!ret.data) {
                throw new Error("上传失败");
            }
            return { url: ret.data };
        },
    },
});
```

### 4. 完成
现在`fast-crud`已经集成到你的项目中，你可以按照上一节学习的，在你的实际项目里开始你的crud开发了。
