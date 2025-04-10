const WorkerBucket: WorkerMatcher[] = [];

export type WorkerMatcher = {
  loader: WorkerLoader;
  match: (label: string) => boolean;
};

export type WorkerLoader = () => Promise<Worker>;

/**
 * 注册自定义worker
 */
export function registerWorker(labels: string | string[], loader: WorkerLoader) {
  WorkerBucket.push({
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

export async function initWorkers() {
  if (window.MonacoEnvironment) {
    return;
  }

  const editorWorker = await import("monaco-editor/esm/vs/editor/editor.worker?worker");
  const jsonWorker = await import("monaco-editor/esm/vs/language/json/json.worker?worker");
  const cssWorker = await import("monaco-editor/esm/vs/language/css/css.worker?worker");
  const htmlWorker = await import("monaco-editor/esm/vs/language/html/html.worker?worker");
  const tsWorker = await import("monaco-editor/esm/vs/language/typescript/ts.worker?worker");

  const customWorkers = [];
  for (const getter of WorkerBucket) {
    const worker = await getter.loader();
    if (worker) {
      customWorkers.push({
        worker,
        match: getter.match
      });
    }
  }

  //@ts-ignore
  window.MonacoEnvironment = {
    //@ts-ignore
    getWorker(_, label) {
      for (const customWorker of customWorkers) {
        if (customWorker.match(label)) {
          return customWorker.worker;
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
