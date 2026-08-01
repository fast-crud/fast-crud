import vue from "@vitejs/plugin-vue";
import path from "path";

const { resolve } = path;

export default ({ mode }) => ({
  plugins: [vue()],
  build: {
    emptyOutDir: mode === "umd",
    lib: {
      entry: resolve(__dirname, mode === "umd" ? "src/index.umd.ts" : "src/index.ts"),
      name: "FsEditorMarkdown",
      formats: [mode === "umd" ? "umd" : "es"]
    },
    rollupOptions: {
      external: ["vue", "@fast-crud/fast-crud", "mavon-editor"],
      output: {
        globals: {
          vue: "Vue",
          "@fast-crud/fast-crud": "FastCrud",
          "mavon-editor": "MavonEditor"
        }
      }
    }
  }
});
