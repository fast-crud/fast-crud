import { UiInterface } from "@fast-crud/ui-interface";
import { CrudOptions } from "../d/crud";
import { DictRequest, UseCrudProps } from "../use";

export type FsSetupOptions = {
  ui?: UiInterface;
  commonOptions?: (props?: UseCrudProps) => CrudOptions;
  dictRequest?: DictRequest;
  i18n?: any;
};
