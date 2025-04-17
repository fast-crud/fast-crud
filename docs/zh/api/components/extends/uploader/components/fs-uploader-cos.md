# FsUploaderCos

cos上传方式的uploader配置

---

```js
const crudOptions={
    columns:{
        key:{
            type:"file-uploader",
            form:{
                component:{
                    uploader:{
                        type:"cos",
                        //... 更多参数,参考下方FsUploaderCosOptions
                    }
                }
            }
        }
    }
    
}

```

```ts
type FsUploaderCosOptions = {
    keepName?: boolean;
    successHandle?: FsUploaderSuccessHandle;
    buildKey?: (context: FsUploaderBuildKeyContext) => Promise<string>;
    domain?: string; //"https://d2p-demo-1251260344.cos.ap-guangzhou.myqcloud.com",
    bucket?: string; //"d2p-demo-1251260344",
    region?: string; //"",
    secretId?: string; //"", //
    secretKey?: string; //"", // 传了secretKey 和secretId 代表使用本地签名模式（不安全，生产环境不推荐）
    getAuthorization?: (context: FsUploaderCosOptions) => Promise<any>;
}
```
