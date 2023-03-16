import { UiInterface } from "@fast-crud/ui-interface";
import { CrudOptions } from "/src/d.ts/crud";
import { DictRequest } from "/src/use";

export type FsSetupOptions = {
  ui?: UiInterface;
  commonOptions?: () => CrudOptions;

  dictRequest?: DictRequest;
  i18n?: any;
};
