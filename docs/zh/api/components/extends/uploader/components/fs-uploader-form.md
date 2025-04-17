# FsUploaderForm

表单上传方式的uploader配置

---
```js
const crudOptions={
    columns:{
        key:{
            type:"file-uploader",
            form:{
                component:{
                    uploader:{
                        type:"form",
                        uploadRequest:async (opts)=>{
                            // 自定义上传请求
                        },
                        //... 更多参数,参考下方FsUploaderFormOptions
                    }
                    
                }
            }
        }
    }
    
}

```


```ts
type FsUploaderFormOptions = {
    keepName?: boolean;
    successHandle?: FsUploaderSuccessHandle;
    buildKey?: (context: FsUploaderBuildKeyContext) => Promise<string>;
    /**
     * 请求url
     */
    action?: string;
    /**
     * 文件参数
     */
    name?: string;
    /**
     * headers
     */
    headers?: any;
    /**
     * 额外的上传参数
     */
    data?: any;
    /**
     * 获取授权等接口中将会传入
     */
    custom?: any;
    /**
     * 自定义上传请求
     * @param file
     * @param action
     */
    uploadRequest?: (props: FsUploaderFormRequestOptions) => Promise<any>;
}
```
