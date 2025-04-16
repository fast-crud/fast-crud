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

```
### 3. 注册workers
```js
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
// 注意yaml的worker需要单独搞个文件export一下，
// 具体见示例 /packages/fast-admin/fs-admin-antdv4/src/plugin/monaco/yaml.worker.ts
import yamlWorker from "./yaml.worker?worker"; 
import { registerWorker } from "@fast-crud/fast-extends";
export function setupMonaco() {
  registerWorker("json", jsonWorker);
  registerWorker(["css", "less", "scss"], cssWorker);
  registerWorker(["html", "handlebars", "razor"], htmlWorker);
  registerWorker(["yaml", "yml"], yamlWorker);
  registerWorker(["typescript", "javascript"], tsWorker);
  registerWorker("*", editorWorker);
}

```
### 4. 使用组件
```js

const crudOptions = {
    columns:{
        key:{
            type:"editor-code"
        }
    }
}
```



