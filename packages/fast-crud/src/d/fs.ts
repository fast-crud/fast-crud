import { UiInterface } from "@fast-crud/ui-interface";
import { CrudOptions, UseCrudProps } from "../d/crud";
import { DictRequest, LoggerConfig } from "../use";

export type FsSetupOptions = {
  ui?: UiInterface;
  commonOptions?: (props?: UseCrudProps) => CrudOptions;
  dictRequest?: DictRequest;
  i18n?: any;
  logger?: LoggerConfig;
};
