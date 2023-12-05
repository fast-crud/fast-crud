import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";
import visualizer from "rollup-plugin-visualizer";
import strip from "@rollup/plugin-strip";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "vite";
import DefineOptions from "unplugin-vue-define-options/vite";
const { resolve } = path;
// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  return {
    plugins: [DefineOptions(), vueJsx(), vue()],
    esbuild: {
      jsxFactory: "h",
      jsxFragment: "Fragment",
      drop: command === "build" ? ["debugger"] : [],
      pure: ["console.log", "debugger"]
    },
    build: {
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        name: "FastCrud"
      },
      // cssCodeSplit: true,
      sourcemap: "inline",
      // minify: false,
      rollupOptions: {
        // input: {
        //   main: resolve(__dirname, "src/index.js"),
        //   en: resolve(__dirname, "src/local/lang/en.js"),
        // },
        plugins: [
          visualizer(),
          typescript({
            target: "esnext",
            rootDir: "src",
            declaration: true,
            declarationDir: "dist/d",
            exclude: ["./node_modules/**", "./src/**/*.vue"],
            allowSyntheticDefaultImports: true
          }),
          strip({
            //不移除console
            functions: ["console.log", "assert.*"],
            debugger: true,
            sourceMap: false
          })
        ],
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: ["vue", "lodash-es", "dayjs", "vue-i18n", "vue-router", "@fast-crud/ui-interface"],
        output: {
          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
            vue: "Vue",
            "lodash-es": "_",
            dayjs: "dayjs",
            "vue-i18n": "VueI18n",
            "vue-router": "VueRouter",
            "@fast-crud/ui-interface": "FsUiInterface"
          }
        }
      }
    }
  };
});
