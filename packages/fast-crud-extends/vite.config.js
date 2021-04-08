import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";
import visualizer from "rollup-plugin-visualizer";
import glob from "glob";
const { resolve } = path;
// options is optional
const lazyComponents = {};
console.log("files");
const files = glob.sync("src/components/**/*.vue", {});
console.log("files", files);
for (let file of files) {
  console.log("file", file);
  const name = file.substring(file.lastIndexOf("/") + 1, file.lastIndexOf("."));
  lazyComponents[name] = resolve(__dirname, file);
}
console.log("lazyComponents", lazyComponents);

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
    //outDir: "dist/es/components/fs-cropper",
    lib: {
      entry: "src/index.js",
      name: "index",
      // formats: ["es"],
    },
    sourcemap: true,
    // minify: false,
    rollupOptions: {
      plugins: [visualizer()],
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        "vue",
        "lodash-es",
        "dayjs",
        "vue-i18n",
        "vuedraggable",
        "@fast-crud/fast-crud",
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
          "lodash-es": "_",
          dayjs: "dayjs",
          "vue-i18n": "VueI18n",
          vuedraggable: "vuedraggable",
          "@fast-crud/fast-crud": "FsCrud",
        },
      },
    },
  },
};
