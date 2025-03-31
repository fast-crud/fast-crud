import { importWorks } from "./async-import";

const WorkerBucket = {};

/**
 * 注册自定义worker
 * @param name
 * @param worker
 */
export function registerWorker(name: string, worker: any) {
  WorkerBucket[name] = worker;
}

export async function initWorkers() {
  if (window.MonacoEnvironment) {
    return;
  }

  const { editorWorker, jsonWorker, cssWorker, htmlWorker, tsWorker } = await importWorks();

  // const editorWorker = new Worker(new URL("monaco-editor/esm/vs/editor/editor.worker.js", import.meta.url));
  // const jsonWorker = new Worker(new URL("monaco-editor/esm/vs/language/json/json.worker.js", import.meta.url));
  // const cssWorker = new Worker(new URL("monaco-editor/esm/vs/language/css/css.worker.js", import.meta.url));
  // const htmlWorker = new Worker(new URL("monaco-editor/esm/vs/language/html/html.worker.js", import.meta.url));
  // const tsWorker = new Worker(new URL("monaco-editor/esm/vs/language/typescript/ts.worker.js", import.meta.url));
  // const yamlWorker = new Worker(new URL("./yaml.worker.js", import.meta.url));

  //@ts-ignore
  window.MonacoEnvironment = {
    //@ts-ignore
    getWorker(_, label) {
      const custom = WorkerBucket[label];
      if (custom) {
        return new custom();
      }
      if (label === "json") {
        return new jsonWorker.default();
      } else if (label === "css" || label === "scss" || label === "less") {
        return new cssWorker.default();
      } else if (label === "html" || label === "handlebars" || label === "razor") {
        return new htmlWorker.default();
      } else if (label === "typescript" || label === "javascript") {
        return new tsWorker.default();
      } else if (label === "yaml" || label === "yml") {
        //@ts-ignore
        return new yamlWorker.default();
      }
      return new editorWorker.default();
    }
  };
}
