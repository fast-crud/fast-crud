import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  resolve(__dirname, "../src/components/toolbar/fs-table-columns-filter/index.vue"),
  "utf8"
);

describe("fs-table-columns-filter", () => {
  it("removes internal properties from plain column objects without using Map APIs", () => {
    expect(source).toContain("for (const key of Object.keys(item))");
    expect(source).not.toContain("item.keys()");
  });
});
