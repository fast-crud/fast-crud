import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";
import visualizer from "rollup-plugin-visualizer";
import strip from "@rollup/plugin-strip";
const { resolve } = path;
import DefineOptions from "unplugin-vue-define-options/vite";
import typescript from "@rollup/plugin-typescript";
// https://vitejs.dev/config/
export default ({ command, mode }) => {
  return {
    plugins: [DefineOptions(), vueJsx(), vue()],
    esbuild: {
      drop: command === "build" ? ["debugger"] : [],
      jsxFactory: "h",
      jsxFragment: "Fragment"
    },
    build: {
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        name: "FsUiInterface"
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
        external: ["vue", "lodash-es"],
        output: {
          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
            vue: "Vue",
            "lodash-es": "_"
          }
        }
      }
    }
  };
};
