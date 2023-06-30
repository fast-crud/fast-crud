import { compute, RuleRecord } from "@fast-crud/fast-crud";
export const createAllUploadSuccessValidator = (getFormComponentRef: (key: string, isAsync: boolean) => any) => {
  return async (rule: any, value: any) => {
    const ref = await getFormComponentRef(rule.fullField, true);
    if (ref && ref.hasUploading()) {
      throw new Error("还有未上传完成的文件");
    }
    return true;
  };
};

export const AllUploadSuccessValidator = () => {
  return compute(({ getComponentRef }) => {
    return createAllUploadSuccessValidator(getComponentRef);
  });
};

/**
 * 会附带正在上传的校验规则
 * @param yourRules
 * @param uploadingWarningMessage
 */
export const createUploaderRules = (yourRules?: RuleRecord[], uploadingWarningMessage?: string): RuleRecord[] => {
  if (yourRules == null) {
    yourRules = [];
  }
  yourRules.push({
    //@ts-ignore
    validator: AllUploadSuccessValidator(), //如果要自定义校验规则则需要手动配置这个
    message: uploadingWarningMessage || "还有文件正在上传，请稍候",
    trigger: "blur" // <-------注意使用blur事件，否则会闪现
  });
  return yourRules;
};
