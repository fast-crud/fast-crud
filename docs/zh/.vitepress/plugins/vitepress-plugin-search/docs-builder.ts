import { Options } from "./types";
import * as fs from "fs/promises";
import { slugify } from "@mdit-vue/shared";
import globToRegExp from "glob-to-regexp";

const { readdir, readFile } = fs;
let rootPath = "";

const replaceMdSyntax = (mdCode: string): string =>
  mdCode
    .replace(/\[(.*?)\]\(.*?\)/g, `$1`) // links
    .replace(/(\*+)(\s*\b)([^\*]*)(\b\s*)(\*+)/gm, `$3`); //bold

/**
 * Get if a string matches any of the regexes or globs in the array
 */
const match = (str: string, arr: (string | RegExp)[]): boolean => {
  let isMatch = false;
  for (const item of arr) {
    if (item instanceof RegExp) {
      if (item.test(str)) {
        isMatch = true;
        break;
      }
    } else if (typeof item === "string") {
      if (globToRegExp(item).test(str)) {
        isMatch = true;
        break;
      }
    }
  }
  return isMatch;
};

/**
 * Get a list of all md files in the docs folders..
 * @param dirName the full path name containing the md files
 * @param options the options object
 * @returns a list of full path location of each md file
 */
const getFileList = async (
  dirName: string,
  options: Options
): Promise<string[]> => {
  let files = [] as string[];
  const items = await readdir(dirName, { withFileTypes: true });

  for (const item of items) {
    if (options?.allow?.length > 0) {
      if (!match(`${dirName}/${item.name}`, options.allow)) continue;
    }
    if (options?.ignore?.length > 0) {
      if (match(`${dirName}/${item.name}`, options.ignore)) continue;
    }
    if (item.isDirectory() && item.name != "node_modules") {
      files = [
        ...files,
        ...(await getFileList(`${dirName}/${item.name}`, options)),
      ];
    } else {
      if (item.name.endsWith(".md")) files.push(`${dirName}/${item.name}`);
    }
  }

  return files;
};

/**
 * remove frontmatter content
 * @param mdCode the content of md files
 * @returns the content without frontmatter content
 */
const removeFrontMatter = (mdCode: string): string =>
  mdCode.replace(/^---(.|\W)*?---/, "");

/**
 * remove script tags from md content
 * @param mdCode the content of md files
 * @returns the content without script tags
 */
const removeScriptTag = (mdCode: string): string =>
  mdCode
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .trim();

/**
 * remove style tags from md content
 * @param mdCode the content of md files
 * @returns the content without style tags
 */
const removeStyleTag = (mdCode: string): string =>
  mdCode.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "").trim();

/**
 * create index docs to be used later on lunr
 * @param dirName the full path name containing the md files
 * @returns a list cleaned md contents
 */
const processMdFiles = async (
  dirName: string,
  options: Options
): Promise<mdFiles[]> => {
  rootPath = dirName;
  let mdFilesList = await getFileList(dirName, options);
  let allData = [] as mdFiles[];

  for (let index = 0; index < mdFilesList.length; index++) {
    const mdFile = mdFilesList[index];
    // console.log(`reading md file ${index +1} of ${mdFilesList.length}`);
    let code: string = await readFile(mdFile, { encoding: "utf8" });
    let cleanCode = removeStyleTag(
      removeScriptTag(replaceMdSyntax(removeFrontMatter(code)))
    );
    allData.push({ content: cleanCode, path: mdFile });
  }

  return Promise.resolve(allData);
};

/**
 * index data extracted from md to be used to generate the final index and previews
 */
interface MdIndexDoc {
  path: string;
  anchor: string;
  content: string;
}

interface mdFiles {
  path: string;
  content: string;
}

/**
 * Split an md content by anchors in several index docs
 * @param mdCode an md content
 * @param path path of md file
 * @returns array of index docs
 */
const parseMdContent = (mdCode: string, path: string): MdIndexDoc[] => {
  const result = mdCode.split(/(^|\s)#{2,}\s/gi);
  const cleaning = result.filter((i) => i != "" && i != "\n");
  const mdData = cleaning.map((i) => {
    let content = i.split("\n");
    let anchor = content?.shift() || "";
    return { anchor, content: content.join("\n"), path };
  });
  return mdData;
};

interface Doc {
  id: string;
  link: string;
  b: string;
  a: string;
  t?: string;
}

const buildDoc = (mdDoc: MdIndexDoc, id: string): Doc => {
  let m, t;
  let a = (t = mdDoc.anchor);
  if ((m = /\{(.*?)\}/m.exec(mdDoc.anchor)) !== null) {
    a = m[0];
    t = mdDoc.anchor.replace(/\{(.*?)\}/m, "");
  }
  a = slugify(a);
  if (a[0] == "#") a = a.replace("#", "");

  let link = mdDoc.path.replace(rootPath + "/", "").replace("md", "html");

  if (!id.includes(".0")) link += `#${slugify(a)}`;

  return {
    id,
    link,
    b: mdDoc.content,
    a,
    t,
  };
};

const buildDocs = async (HTML_FOLDER: string, options: Options) => {
  const files = await processMdFiles(HTML_FOLDER, options);

  const docs = [] as Doc[];
  if (files !== undefined) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let mdDocs = parseMdContent(file.content, file.path);

      for (let index = 0; index < mdDocs.length; index++) {
        const mdDoc = mdDocs[index];
        docs.push(buildDoc(mdDoc, i + "." + index));
      }
    }
  }
  return docs;
};

export default buildDocs;
