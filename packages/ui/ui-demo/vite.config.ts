import { defineConfig } from 'vite'
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import typescript from "@rollup/plugin-typescript";
import DefineOptions from "unplugin-vue-define-options/vite";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [DefineOptions(), vueJsx(), vue()],
  build: {
    lib: {
      entry: "src/bpmn/index.ts",
      name: "bpmn"
    },
    // cssCodeSplit: true,
    sourcemap: "inline",
    // minify: false,
    rollupOptions: {
      plugins: [
        typescript({
          target: "esnext",
          rootDir: "src",
          declaration: true,
          declarationDir: "dist/d",
          exclude: ["./node_modules/**"],
          allowSyntheticDefaultImports: true
        }),
      ],
      external: ["vue", "lodash-es", "dayjs", "vue-i18n"],
      output: {
        globals: {
          vue: "Vue",
          "lodash-es": "_",
          dayjs: "dayjs",
          "vue-i18n": "VueI18n"
        }
      }
    }
  }
})
