import { UiInterface } from "@fast-crud/ui-interface";
import { CrudOptions, RowRecord, UseCrudProps } from "../d/crud";
import { DictRequest, LoggerConfig } from "../use";

export type FsSetupOptions<R = any, C = any> = {
  ui?: UiInterface;
  commonOptions?: (props?: UseCrudProps<R, C>) => CrudOptions<R>;
  dictRequest?: DictRequest;
  i18n?: any;
  logger?: LoggerConfig;
  customComponents?: { [key: string]: any };
};
