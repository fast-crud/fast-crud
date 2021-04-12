import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import visualizer from "rollup-plugin-visualizer";
import path from "path";
// https://vitejs.dev/config/
// 增加环境变量
process.env.VITE_APP_VERSION = require("./package.json").version;
process.env.VITE_APP_BUILD_TIME = require("dayjs")().format(
  "YYYY-M-D HH:mm:ss"
);

export default ({ command, mode }) => {
  console.log("args", command, mode);

  let devAlias = {};
  if (mode === "development") {
    devAlias = {
      "@fast-crud/fast-crud/dist/lang": path.resolve(
        "../fast-crud/src/local/lang"
      ),
      "@fast-crud/fast-crud/dist": path.resolve("../fast-crud/src"),

      "@fast-crud/fast-crud/src": path.resolve("../fast-crud/src"),
      "@fast-crud/fast-crud-extends/src": path.resolve(
        "../fast-crud-extends/src"
      ),
      "@fast-crud/fast-crud": path.resolve("../fast-crud/src"),
      "@fast-crud/fast-crud-extends": path.resolve("../fast-crud-extends/src"),
    };
  }

  console.log("devAlias", devAlias);
  return {
    base: "/antdv/",
    plugins: [
      vueJsx({
        // options are passed on to @vue/babel-plugin-jsx
      }),
      // commonjs({
      //   // non-CommonJS modules will be ignored, but you can also
      //   // specifically include/exclude files
      //   include: ["node_modules/@fast-crud/fast-crud-extends/**"], // Default: undefined
      //   //exclude: ["node_modules/foo/**", "node_modules/bar/**"] // Default: undefined
      // }),
      // commonjs(),
      vue(),
    ],
    // optimizeDeps: {
    //   exclude: ["@fast-crud/fast-crud-extends"],
    // },
    esbuild: {
      jsxFactory: "h",
      jsxFragment: "Fragment",
    },
    resolve: {
      alias: {
        ...devAlias,
        "/@": path.resolve("./src"),
      },
      dedupe: ["vue"],
    },
    build: {
      rollupOptions: {
        plugins: [visualizer()],
      },
    },
    server: {
      proxy: {
        // with options
        "/api": {
          target: "http://www.docmirror.cn:7070",
        },
      },
    },
  };
};
