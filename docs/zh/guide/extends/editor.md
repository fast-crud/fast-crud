# fast-extends/editor
编辑器扩展，支持富文本编辑器，代码编辑器

## 富文本编辑器
富文本编辑器封装的wang-editor5组件
### 1. install
```
pnpm add  @fast-crud/fast-extends 
```

### 2、use
```js
import {FsExtendsEditor} from "@fast-crud/fast-extends";
import "@fast-crud/fast-extends/dist/style.css";
//use editor
app.use(FsExtendsEditor)
```

### 3. 使用组件
```js

const crudOptions = {
    columns:{
        key:{
            type:"editor-wang5"
        }
    }
}
```

## 代码编辑器
代码编辑器封装的monaco-editor组件

### 1. install
```
pnpm add  @fast-crud/fast-extends js-yaml monaco-editor monaco-yaml
```

### 2、use
```js
import {FsExtendsEditor} from "@fast-crud/fast-extends";
import "@fast-crud/fast-extends/dist/style.css";
import { initWorkers } from "@fast-crud/fast-extends/src/editor/components/fs-editor-code/worker";
//use editor
app.use(FsExtendsEditor)
initWorkers();
```

### 3. 使用组件
```js

const crudOptions = {
    columns:{
        key:{
            type:"editor-code"
        }
    }
}
```



