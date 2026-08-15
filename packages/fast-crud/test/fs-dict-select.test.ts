import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  resolve(__dirname, "../src/components/extends/fs-dict-select.vue"),
  "utf8"
);

describe("fs-dict-select", () => {
  it("delegates custom dictionary fields to the UI select adapter", () => {
    expect(source).toContain("const fieldNamesBinder = ref();");
    expect(source).toContain("fieldNamesBinder.value = ui.select.fieldNames({");
    expect(source).toContain("value: props.dict.value");
    expect(source).toContain("label: props.dict.label");
    expect(source).toContain("{...fieldNamesBinder.value}");
    expect(source).not.toContain("fieldNames={fieldNames.value}");
  });
});
