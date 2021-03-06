import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import visualizer from "rollup-plugin-visualizer";
import viteCompress from "vite-plugin-compression";
import PurgeIcons from "vite-plugin-purge-icons";
import path from "path";
import dayjs from "dayjs";
// https://vitejs.dev/config/
// 增加环境变量
process.env.VITE_APP_VERSION = require("./package.json").version;
process.env.VITE_APP_BUILD_TIME = dayjs().format("YYYY-M-D HH:mm:ss");
// 避免异常崩溃
process.on("uncaughtException", function (err) {
  console.error("uncaughtException:", err);
});
export default ({ command, mode }) => {
  console.log("args", command, mode);

  let devAlias = [];
  if (mode === "debug") {
    devAlias = [
      { find: /@fast-crud\/fast-crud\/dist/, replacement: path.resolve("../../fast-crud/src/") },
      { find: /@fast-crud\/fast-crud$/, replacement: path.resolve("../../fast-crud/src/") },
      { find: /@fast-crud\/fast-extends\/dist/, replacement: path.resolve("../../fast-extends/src/") },
      { find: /@fast-crud\/fast-extends$/, replacement: path.resolve("../../fast-extends/src/") },
      { find: /@fast-crud\/ui-element$/, replacement: path.resolve("../../ui/ui-element/src/") },
      { find: /@fast-crud\/ui-interface$/, replacement: path.resolve("../../ui/ui-interface/src/") }
    ];
  }

  console.log("devAlias", devAlias);
  return {
    base: "/element/",
    plugins: [
      vueJsx(),
      vue(),
      viteCompress(),
      PurgeIcons({
        iconSource: "local",
        remoteDataAPI: "https://gitee.com/fast-crud/collections-json/raw/master/json",
        includedCollections: ["ion"]
      })
    ],
    // optimizeDeps: {
    //   exclude: ["@fast-crud/fast-crud-extends"],
    // },
    optimizeDeps: {
      include: ["vuedraggable"]
    },
    esbuild: {
      jsxFactory: "h",
      jsxFragment: "Fragment"
    },
    resolve: {
      alias: [...devAlias, { find: "/@", replacement: path.resolve("./src") }],
      dedupe: ["vue"]
    },
    build: {
      minify: true,
      rollupOptions: {
        plugins: [visualizer()]
      }
    },
    server: {
      port: 3001,
      proxy: {
        // with options
        "/api": {
          target: "http://www.docmirror.cn:7070"
        }
      }
    }
  };
};
