export async function importJsYaml() {
  return await import("js-yaml");
}

export async function importYamlContribution() {
  await import("monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution");
}

export async function importJsonContribution() {
  await import("monaco-editor/esm/vs/language/json/monaco.contribution");
}

export async function importJavascriptContribution() {
  await import("monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution");
}

export async function importMonacoYaml() {
  return await import("monaco-yaml");
}

export async function importWorks() {
  const editorWorker = await import("monaco-editor/esm/vs/editor/editor.worker?worker");
  const jsonWorker = await import("monaco-editor/esm/vs/language/json/json.worker?worker");
  const cssWorker = await import("monaco-editor/esm/vs/language/css/css.worker?worker");
  const htmlWorker = await import("monaco-editor/esm/vs/language/html/html.worker?worker");
  const tsWorker = await import("monaco-editor/esm/vs/language/typescript/ts.worker?worker");
  const yamlWorker = await import("./yaml.worker?worker");

  return {
    editorWorker,
    jsonWorker,
    cssWorker,
    htmlWorker,
    tsWorker,
    yamlWorker
  };
}
