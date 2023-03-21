import { UiInterface } from "@fast-crud/ui-interface";
import { CrudOptions } from "../d/crud";
import { DictRequest } from "../use";

export type FsSetupOptions = {
  ui?: UiInterface;
  commonOptions?: () => CrudOptions;

  dictRequest?: DictRequest;
  i18n?: any;
};
