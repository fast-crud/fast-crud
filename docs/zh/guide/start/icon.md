# 图标

如果你集成到你的项目中没有显示图标，请看下方`iconify`图标的使用

## FsIcon

1. `fast-crud`底层使用`FsIcon`组件来使用图标，通过`icon`属性来配置图标
2. 当`icon`参数包含`:`时会被识别为iconify图标（例如：`icon="ion:apps-sharp"`）
3. 否则视为ui库的内置图标(例如`icon="CheckOutlined"`)
4. 使用antdv的内置图标需要事先全局注册该图标。

## 使用`iconify`图标

示例项目中大量使用了`iconify`图标，如果你想集成到你的项目中，请按如下步骤配置

### 1. 安装依赖

```json
 {
  "dependencies": {
    "@purge-icons/generated": "^0.7.0"
  },
  "devDependencies": {
    "vite-plugin-purge-icons": "^0.7.0",
  }
}

```

### 2. 配置vite插件
```js
// vite.config.js
return {
    plugins: [
        vueJsx(),
        vue(),
        PurgeIcons(),
    ]
}
```

### 3. `main.js` 中导入`generated`
```js
import "@purge-icons/generated";
```

### 4. fs中配置使用`iconify`图标

1. 从[iconify图标库](https://iconify.design/icon-sets/ion/) 中查找你要使用的图标，复制图标名称，配置到`icon`属性上即可.
2. 注意图标名称要是`xxx:yyyy`格式的，中间要有冒号。
3. 如果图标没有冒号的，请确认当前图标所在图标库名，图标库名后面的第一个`-`换成`:`即可

   
### 5. 独立使用`iconify`图标
```html
 <fs-icon :icon='xxxx:yyyy'/>
```

