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
