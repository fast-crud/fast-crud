import { merge, cloneDeep } from "lodash-es";
import { buildKey, useUploader } from "../utils/index";
import * as qiniu from "qiniu-js";
import { FsUploaderDoUploadOptions, FsUploaderQiniuOptions } from "../../d/type";

export async function getToken(file: File, fileName: string, key: string, config: FsUploaderQiniuOptions) {
  const ret = await config.getToken({
    fileName,
    key,
    file,
    ...config.custom,
    ...config
  });

  let tokenWrapper = null;
  if (typeof ret === "string") {
    tokenWrapper = { token: ret, expires: 3600 };
  } else {
    tokenWrapper = ret;
  }
  tokenWrapper.expiresTime = new Date().getTime() + tokenWrapper.expires * 1000;
  return tokenWrapper.token;
}

async function doUpload({ file, fileName, onProgress, options }: FsUploaderDoUploadOptions) {
  const key = await buildKey(file, fileName, options);
  const token = await getToken(file, fileName, key, options);

  return new Promise((resolve, reject) => {
    /**
     */
    const observable: any = qiniu.upload(file, key, token, options.putExtra, options.putConfig);
    const subscription = observable.subscribe({
      next(res: any) {
        if (res) {
          onProgress(res.total);
        }
      },
      error(err: any) {
        reject(err);
      },
      async complete(res: any) {
        let ret: any = { url: options.domain + "/" + key, key: key };
        if (options.successHandle) {
          ret = await options.successHandle(ret);
          resolve(ret);
          return;
        }
        resolve(ret);
      }
    }); // 上传开始
    // subscription.unsubscribe() // 上传取消
  });
}

export async function upload(context: FsUploaderDoUploadOptions) {
  const { getConfig } = useUploader();
  const global = getConfig("qiniu");
  const options = context.options;
  const config = merge(cloneDeep(global), options);
  context.options = config;
  return await doUpload(context);
}
