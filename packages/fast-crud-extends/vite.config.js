import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";
import visualizer from "rollup-plugin-visualizer";
import commonjs from "@rollup/plugin-commonjs";
import multi from "@rollup/plugin-multi-entry";

const { resolve } = path;

// https://vitejs.dev/config/
export default {
  plugins: [vueJsx(), vue()],
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
  },
  build: {
    //outDir: "dist/es/components/fs-cropper",
    lib: {
      entry: "",
      name: "index",
      // formats: ["es"],
    },
    sourcemap: true,
    // minify: false,
    rollupOptions: {
      input: [
        resolve("src/index.js"),
        resolve("src/lib/uploader/fs-cropper.vue"),
      ],
      plugins: [commonjs(), visualizer()],
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
