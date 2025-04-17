# FsUploaderS3

s3上传方式的uploader配置

---

```js
const crudOptions={
    columns:{
        key:{
            type:"file-uploader",
            form:{
                component:{
                    uploader:{
                        type:"s3",
                        //... 更多参数,参考下方FsUploaderS3Options
                    }
                    
                }
            }
        }
    }
    
}

```

```ts
type FsUploaderS3Options = {
    keepName?: boolean;
    successHandle?: FsUploaderSuccessHandle;
    buildKey?: (context: FsUploaderBuildKeyContext) => Promise<string>;
    bucket?: string;
    sdkOpts?: S3ClientConfig;
    getSignedUrl?: (
        bucket: string,
        key: string,
        options: FsUploaderS3Options,
        type: FsUploaderS3SignedUrlType
    ) => Promise<string>;
}
```