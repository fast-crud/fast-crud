import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
    }),
    vue(),
  ],
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
  },
});
