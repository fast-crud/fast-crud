export type WorkerMatcher = {
  loader: WorkerLoader;
  match: (label: string) => boolean;
};

export type WorkerLoader = () => Promise<Worker>;

export type WorkerItem = {
  worker: any;
  match: (label: string) => boolean;
};

const workerLoaders: WorkerMatcher[] = [];
/**
 * 注册自定义worker
 */
export function registerWorker(labels: string | string[], loader: WorkerLoader) {
  workerLoaders.push({
    loader: loader,
    match: (label: string) => {
      if (typeof labels === "string") {
        return labels === label;
      }
      for (const labelItem of labels) {
        if (labelItem === label) {
          return true;
        }
      }
      return false;
    }
  });
}

async function loadWorkers() {
  while (workerLoaders.length > 0) {
    const item = workerLoaders.pop();
    if (item) {
      const worker = await item.loader();
      customWorkers.push({
        match: item.match,
        worker: worker
      });
    }
  }
}

const customWorkers: WorkerItem[] = [];
export async function initWorkers() {
  await loadWorkers();
  if (window.MonacoEnvironment) {
    return;
  }

  const editorWorker = await import("monaco-editor/esm/vs/editor/editor.worker?worker");
  const jsonWorker = await import("monaco-editor/esm/vs/language/json/json.worker?worker");
  const cssWorker = await import("monaco-editor/esm/vs/language/css/css.worker?worker");
  const htmlWorker = await import("monaco-editor/esm/vs/language/html/html.worker?worker");
  const tsWorker = await import("monaco-editor/esm/vs/language/typescript/ts.worker?worker");

  //@ts-ignore
  window.MonacoEnvironment = {
    //@ts-ignore
    getWorker(_, label) {
      for (const customWorker of customWorkers) {
        if (customWorker.match(label)) {
          return new customWorker.worker();
        }
      }
      if (label === "json") {
        return new jsonWorker.default();
      } else if (label === "css" || label === "scss" || label === "less") {
        return new cssWorker.default();
      } else if (label === "html" || label === "handlebars" || label === "razor") {
        return new htmlWorker.default();
      } else if (label === "typescript" || label === "javascript") {
        return new tsWorker.default();
      }
      return new editorWorker.default();
    }
  };
}
