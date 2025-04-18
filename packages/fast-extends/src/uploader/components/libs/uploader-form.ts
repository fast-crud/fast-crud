import { merge, cloneDeep } from "lodash-es";
import { doAjax } from "../utils/ajax";
import { buildKey, useUploader } from "../utils/index";
import { FsUploaderDoUploadOptions, FsUploaderFormOptions } from "../../d/type";

/**
 *
 * @param option {file,filename,action,data,headers}
 * @param options
 * @returns {Promise<unknown>}
 */
async function doUpload(opts: FsUploaderDoUploadOptions) {
  const { file, fileName, onProgress } = opts;
  const options = opts.options as FsUploaderFormOptions;
  const key = await buildKey(file, fileName, options);

  if (options.data == null) {
    options.data = {};
  }
  options.data.key = key;
  const ajaxOptions = {
    file,
    onProgress,
    timeout: 60000,
    ...options
  };
  delete ajaxOptions.uploadRequest;
  const uploadRequest = options.uploadRequest ?? doAjax;
  let res = await uploadRequest(ajaxOptions);
  if (options.successHandle) {
    res = await options.successHandle(res, ajaxOptions);
  }
  if (!res) {
    throw new Error("上传成功，successHandle处理后必须返回数据，格式为 url 或{url} 或 {key}等");
  }

  if (res && typeof res === "object" && res.key == null) {
    res.key = key;
  }
  return res;
}

export async function upload(context: FsUploaderDoUploadOptions) {
  const { getConfig } = useUploader();
  const global = getConfig("form");
  context.options = merge({}, cloneDeep(global), context.options);
  return await doUpload(context);
}
