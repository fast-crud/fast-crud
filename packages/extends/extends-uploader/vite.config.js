import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

import path from "path";
import _ from "lodash";
import visualizer from "rollup-plugin-visualizer";
import strip from "@rollup/plugin-strip";
const { resolve } = path;

// https://vitejs.dev/config/
export default ({ command, mode }) => {
  let build = {};
  if (mode === "umd") {
    build = {
      build: {
        emptyOutDir: true,
        lib: {
          entry: resolve(__dirname, "src/index.umd.js"),
          formats: ["umd"]
        },
        rollupOptions: {
          output: {
            manualChunks: null
          }
        }
      }
    };
  } else if (mode === "umd") {
    build = {
      build: {
        emptyOutDir: true,
        lib: {
          entry: resolve(__dirname, "src/index.umd.js"),
          formats: ["umd"]
        },
        rollupOptions: {
          output: {
            manualChunks: null
          }
        }
      }
    };
  }

  const options = {
    plugins: [vueJsx(), vue()],
    esbuild: {
      jsxFactory: "h",
      jsxFragment: "Fragment"
    },
    build: {
      emptyOutDir: false,
      lib: {
        entry: resolve(__dirname, "src/index.js"),
        name: "extends-uploader",
        formats: ["es"]
      },
      // cssCodeSplit: true,
      sourcemap: true,
      // minify: false,
      rollupOptions: {
        plugins: [strip(), visualizer()],
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: [
          "vue",
          "lodash-es",
          "dayjs",
          "vue-i18n",
          "vuedraggable",
          "ali-oss",
          "cos-js-sdk-v5",
          "qiniu-js",
          "@fast-crud/fast-crud"
        ],
        output: {
          manualChunks(id) {
            if (id.includes("src/components") && id.lastIndexOf(".vue") > 0) {
              let name = id.substring(id.lastIndexOf("/") + 1);
              name = name.substring(0, name.indexOf("."));
              return "components/" + name;
            }
          },
          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
            vue: "Vue",
            "lodash-es": "_",
            dayjs: "dayjs",
            "vue-i18n": "VueI18n",
            vuedraggable: "vuedraggable",
            "@fast-crud/fast-crud": "FastCrud",
            "ali-oss": "OSS",
            "cos-js-sdk-v5": "COS",
            "qiniu-js": "qiniu"
          }
        }
      }
    }
  };

  _.merge(options, build);
  return options;
};
