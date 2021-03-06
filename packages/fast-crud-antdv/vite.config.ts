import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
    }),
    vue()
  ],
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment"
  },
  resolve: {
    alias: {
      "@fast-crud/fast-crud/dist/lang": path.resolve(
        "../fast-crud/src/local/lang"
      ),
      "@fast-crud/fast-crud": path.resolve("../fast-crud/src"),
      "/@": path.resolve("./src")
    },
    dedupe: ["vue"]
  }
});
