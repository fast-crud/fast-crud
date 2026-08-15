import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const tableSource = readFileSync(resolve(__dirname, "../src/components/crud/fs-table.tsx"), "utf8");
const cellSource = readFileSync(resolve(__dirname, "../src/components/crud/fs-cell.tsx"), "utf8");

describe("fs-table component resolution", () => {
  it("uses static component references in deferred table cell renderers", () => {
    expect(tableSource).toContain('import FsCell from "./fs-cell";');
    expect(tableSource).toContain('import FsEditableCell from "./editable/fs-editable-cell";');
    expect(tableSource).toContain('import FsRowHandle from "./fs-row-handle.vue";');
    expect(tableSource).not.toContain("<fs-cell");
    expect(tableSource).not.toContain("<fs-editable-cell");
    expect(tableSource).not.toContain("<fs-row-handle");
    expect(cellSource).toContain('import FsComponentRender from "../render/fs-component-render";');
    expect(cellSource).not.toContain("<fs-component-render");
    expect(tableSource).toContain("withCtx");
  });
});
