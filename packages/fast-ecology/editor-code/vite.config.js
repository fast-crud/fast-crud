import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import strip from "@rollup/plugin-strip";
import DefineOptions from "unplugin-vue-define-options/vite";
import typescript from "@rollup/plugin-typescript";
import _ from "lodash";
const { resolve } = path;
// https://vitejs.dev/config/
export default ({ command, mode }) => {
  let build = {};
  if (mode === "umd") {
    build = {
      build: {
        emptyOutDir: true,
        lib: {
          entry: resolve(__dirname, "src/index.umd.ts"),
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
    base: "./",
    plugins: [DefineOptions(), vueJsx(), vue()],
    esbuild: {
      drop: command === "build" ? ["debugger"] : [],
      jsxFactory: "h",
      jsxFragment: "Fragment",
      pure: ["console.log", "debugger"]
    },
    build: {
      emptyOutDir: false,
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        name: "FsExtends",
        formats: ["es"]
      },
      // cssCodeSplit: true,
      sourcemap: true,
      // minify: false,
      rollupOptions: {
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
          "lodash-es",
          "dayjs",
          "vue-i18n",
          "vuedraggable",
          "ali-oss",
          "cos-js-sdk-v5",
          "axios",
          "qiniu-js",
          "@fast-crud/fast-crud",
          "@fast-crud/ui-interface",
          "monaco-editor",
          "monaco-yaml",
          "js-yaml",
          "monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution",
          "monaco-editor/esm/vs/language/json/monaco.contribution",
          "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution",
          "monaco-editor/esm/vs/editor/editor.worker?worker",
          "monaco-editor/esm/vs/language/json/json.worker?worker",
          "monaco-editor/esm/vs/language/css/css.worker?worker",
          "monaco-editor/esm/vs/language/typescript/ts.worker?worker",
          "monaco-editor/esm/vs/language/html/html.worker?worker",
          "monaco-yaml/yaml.worker.js",
          "monaco-yaml/yaml.worker.js?worker",
          "monaco-editor/*",
          "monaco-editor/**"
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
            axios: "axios",
            vuedraggable: "vuedraggable",
            "@fast-crud/fast-crud": "FastCrud",
            "ali-oss": "OSS",
            "cos-js-sdk-v5": "COS",
            "qiniu-js": "qiniu",
            "@fast-crud/ui-interface": "FsUiInterface",
            "monaco-editor": "monaco",
            "monaco-yaml": "monacoYaml",
            "js-yaml": "jsYaml"
          }
        }
      }
    }
  };

  _.merge(options, build);
  return options;
};
