# FsUploaderQiniu

qiniu上传方式的uploader配置

---

```js
const crudOptions={
    columns:{
        key:{
            type:"file-uploader",
            form:{
                component:{
                    uploader:{
                        type:"qiniu",
                        //... 更多参数,参考下方FsUploaderQiniuOptions
                    }
                    
                }
            }
        }
    }
    
}

```


```ts
type FsUploaderQiniuOptions = {
    keepName?: boolean;
    successHandle?: FsUploaderSuccessHandle;
    buildKey?: (context: FsUploaderBuildKeyContext) => Promise<string>;
    bucket?: string; // "d2p-demo"
    getToken?: (context: FsUploaderGetAuthContext) => Promise<any>;
    domain?: string; // "http://pzrsldiu3.bkt.clouddn.com",
}
```
