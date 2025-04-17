# FsUploaderAlioss

alioss上传方式的uploader配置

---

```js
const crudOptions={
    columns:{
        key:{
            type:"file-uploader",
            form:{
                component:{
                    uploader:{
                        type:"alioss",
                        //... 更多参数,参考下方FsUploaderAliossOptions
                    }
                }
            }
        }
    }
    
}

```

```ts
type FsUploaderAliossOptions = {
    keepName?: boolean;
    successHandle?: FsUploaderSuccessHandle;
    buildKey?: (context: FsUploaderBuildKeyContext) => Promise<string>;
    domain: string; //"https://d2p-demo.oss-cn-shenzhen.aliyuncs.com",
    bucket: string; //"d2p-demo",
    region: string; //"oss-cn-shenzhen",
    accessKeyId?: string; // "",
    accessKeySecret?: string; // "", // 传了secretKey 和secretId 代表使用本地签名模式（不安全，生产环境不推荐）
    getAuthorization: (context: FsUploaderGetAuthContext) => Promise<FsUploaderAliossSTS>;
    keepName?: boolean;
    sdkOpts?: any;
}
```
