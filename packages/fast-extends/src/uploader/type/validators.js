import { compute } from "@fast-crud/fast-crud";
export const createAllUploadSuccessValidator = (getFormComponentRef) => {
  return async (rule, value) => {
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
