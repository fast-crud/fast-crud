import { OpenDialogProps } from "/src/d.ts";
import { inject } from "vue";
import logger from "../utils/util.log";

export function useFormWrapper(silence = false) {
  const wrapperProvider: Function = inject("use:form:wrapper", () => {});
  const pd = wrapperProvider();

  if (pd == null) {
    if (!silence) {
      logger.warn("当前无法通过useFormWrapper打开对话框，请先使用fs-form-provider包裹上层组件");
    }
    return {};
  }

  const openDialog = async (opts: OpenDialogProps) => {
    return await pd.open(opts);
  };

  return {
    openDialog
  };
}
