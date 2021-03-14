import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";
import visualizer from "rollup-plugin-visualizer";
const { resolve } = path;
// https://vitejs.dev/config/
export default {
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
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: "fast-crud",
    },
    // cssCodeSplit: true,
    sourcemap: true,
    // minify: false,
    rollupOptions: {
      // input: {
      //   main: resolve(__dirname, "src/index.js"),
      //   en: resolve(__dirname, "src/local/lang/en.js"),
      // },
      plugins: [visualizer()],
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue", "lodash-es", "dayjs", "vue-i18n", "vuedraggable"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
          "lodash-es": "_",
          dayjs: "dayjs",
          "vue-i18n": "VueI18n",
          vuedraggable: "vuedraggable",
        },
      },
    },
  },
};
