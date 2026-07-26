#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const skillDir = resolve(scriptDir, "..");
const templateDir = resolve(skillDir, "assets", "basic-crud");

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (!item.startsWith("--")) {
      continue;
    }
    const key = item.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function usage() {
  return [
    "用法：",
    "  node scripts/scaffold-crud.mjs --root <目标目录> --name <组件名> --api-prefix <接口前缀> [--title <标题>] [--mock false]",
    "",
    "示例：",
    "  node scripts/scaffold-crud.mjs --root C:/repo/src/views/system/user --name SystemUser --title 用户管理 --api-prefix /system/user"
  ].join("\n");
}

async function renderTemplate(fileName, replacements) {
  const input = await readFile(resolve(templateDir, fileName), "utf8");
  return Object.entries(replacements).reduce((text, [key, value]) => {
    return text.replaceAll(`__${key}__`, value);
  }, input);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.root || !args.name || !args["api-prefix"]) {
    console.error(usage());
    process.exit(1);
  }

  const root = resolve(args.root);
  const replacements = {
    COMPONENT_NAME: args.name,
    API_PREFIX: args["api-prefix"],
    TITLE: args.title ?? args.name
  };

  await mkdir(root, { recursive: true });

  const files = ["index.vue", "crud.tsx", "api.ts"];
  if (args.mock !== "false") {
    files.push("mock.ts");
  }

  for (const file of files) {
    const content = await renderTemplate(file, replacements);
    await writeFile(resolve(root, file), content, "utf8");
  }

  console.log(`已在 ${root} 创建 ${files.length} 个 fast-crud 文件`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
