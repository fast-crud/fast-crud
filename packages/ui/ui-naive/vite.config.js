import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";
import {visualizer} from "rollup-plugin-visualizer";
import strip from "@rollup/plugin-strip";
import typescript from "@rollup/plugin-typescript";
const { resolve } = path;
// https://vitejs.dev/config/
export default ({ command, mode }) => {
  return {
    plugins: [vueJsx(), vue()],
    esbuild: {
      drop: command === "build" ? ["debugger"] : [],
      jsxFactory: "h",
      jsxFragment: "Fragment"
    },
    build: {
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        name: "FsUiNaive"
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
          strip(),
          visualizer(),
          typescript({
            target: "es2020",
            rootDir: "src",
            declaration: true,
            declarationDir: "dist/d",
            exclude: "./node_modules/**",
            allowSyntheticDefaultImports: true
          })
        ],
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: [
          "vue",
          "@fast-crud/fast-crud",
          "naive-ui",
          "@ant-design/icons-vue",
          "lodash-es",
          "@fast-crud/ui-interface"
        ],
        output: {
          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
            vue: "Vue",
            "@fast-crud/fast-crud": "FastCrud",
            "naive-ui": "naive",
            "@ant-design/icons-vue": "AntDesignIconsVue",
            "lodash-es": "_",
            "@fast-crud/ui-interface": "FsUiInterface"
          }
        }
      }
    }
  };
};
