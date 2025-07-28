import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import yamlWorker from "./yaml.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
export type WorkerItem = {
  worker: any;
  match: (label: string) => boolean;
};
const WorkerBucket: WorkerItem[] = [];
/**
 * 注册自定义worker
 */
export function registerWorker(labels: string | string[], worker: any) {
  WorkerBucket.push({
    worker: worker,
    match: (label: string) => {
      if (typeof labels === "string") {
        return labels === label;
      }
      for (const labelItem of labels) {
        if (labelItem === "*") {
          return true;
        }
        if (labelItem === label) {
          return true;
        }
      }
      return false;
    }
  });
}

export function initWorkers() {
  if (window.MonacoEnvironment) {
    return;
  }

  //@ts-ignore
  window.MonacoEnvironment = {
    //@ts-ignore
    getWorker(_, label) {
      for (const workerLoader of WorkerBucket) {
        if (workerLoader.match(label)) {
          return new workerLoader.worker();
        }
      }
      if (label === "json") {
        return new jsonWorker();
      } else if (label === "css" || label === "scss" || label === "less") {
        return new cssWorker();
      } else if (label === "html" || label === "handlebars" || label === "razor") {
        return new htmlWorker();
      } else if (label === "typescript" || label === "javascript") {
        return new tsWorker();
      } else if (label === "yaml" || label === "yml") {
        //@ts-ignore
        return new yamlWorker();
      }
      return new editorWorker();
    }
  };
}
