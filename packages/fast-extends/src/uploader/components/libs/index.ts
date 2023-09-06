export async function loadUploader<T>(type: string): Promise<T> {
  let module: any = null;
  if (type === "alioss") {
    module = await import("./uploader-alioss");
  } else if (type === "cos") {
    module = await import("./uploader-cos");
  } else if (type === "form") {
    module = await import("./uploader-form");
  } else if (type === "qiniu") {
    module = await import("./uploader-qiniu");
  } else if (type === "s3") {
    module = await import("./uploader-s3");
  } else {
    console.error(`未找到${type}的上传实现`);
  }
  return module;
}
