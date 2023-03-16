import { compute } from "@fast-crud/fast-crud";
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
