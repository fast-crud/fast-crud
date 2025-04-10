# fast-extends/uploader
上传扩展
### 1、install
```
pnpm add  @fast-crud/fast-extends
```

### 2、use
```js
import {FsExtendsUploader} from "@fast-crud/fast-extends";
import "@fast-crud/fast-extends/dist/style.css";

//配置uploader 公共参数
app.use(FsExtendsUploader, {
    defaultType: "cos",
    ... //其他参数
}
```

### 3、crud
```js
const crudOptions = {
    columns:{
        key:{
            type:'file-uploader',
            form:{
                component:{
                    uploader:{
                        //上传的自定义参数，可以覆盖“参数参考”中的全局参数
                        type:"cos",
                        bucket: "d2p-demo", //覆盖cos的bucket
                    }
                }
            }
        }
    }
}
```
## 包含的字段类型
你可以在此处查看上传扩展里面使用的哪些组件，

<<<@/../../packages/fast-extends/src/uploader/type/types.tsx

[组件配置参数](/api/components/extends/uploader/components/fs-file-uploader.md)
## 参数参考

<<<@/../../packages/fast-extends/src/uploader/type/config.ts
