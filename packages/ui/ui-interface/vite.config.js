import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";
import visualizer from "rollup-plugin-visualizer";
import strip from "@rollup/plugin-strip";
import typescript from "@rollup/plugin-typescript";
const { resolve } = path;
// https://vitejs.dev/config/
export default {
  plugins: [vueJsx(), vue()],
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment"
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "antdv"
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
          declarationDir: "dist/es",
          exclude: "./node_modules/**",
          allowSyntheticDefaultImports: true
        })
      ],
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue", "@fast-crud/fast-crud", "ant-design-vue", "@ant-design/icons-vue"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
          "@fast-crud/fast-crud": "FastCrud",
          "ant-design-vue": "Antdv",
          "@ant-design/icons-vue": "IconsVue"
        }
      }
    }
  }
};
