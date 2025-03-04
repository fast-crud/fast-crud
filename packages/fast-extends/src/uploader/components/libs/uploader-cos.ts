import { cloneDeep, merge } from "lodash-es";
import { buildKey, useUploader } from "../utils";
import COS from "cos-js-sdk-v5";
import dayjs from "dayjs";
import { FsUploaderCosOptions, FsUploaderDoUploadOptions, FsUploaderResult } from "../../d/type";

export function getOssClient(options: FsUploaderCosOptions) {
  let client = null;
  const secretId = options.secretId;
  const secretKey = options.secretKey;
  const getAuthorization = options.getAuthorization;
  if (!secretId && !secretKey && getAuthorization) {
    client = new COS({
      // 必选参数
      getAuthorization(opts, callback) {
        // 不传secretKey代表使用临时签名模式,此时此参数必传（安全，生产环境推荐）
        getAuthorization(options).then((data) => {
          if (data.ExpiredTime && typeof data.ExpiredTime === "string") {
            data.ExpiredTime = dayjs(data.ExpiredTime).unix();
          }
          callback(data);
        });
      }
    });
  } else {
    console.warn("您还未配置getAuthorization，将使用SecretKey授权进行上传");
    client = new COS({
      SecretId: secretId,
      SecretKey: secretKey
    });
  }

  return client;
}
async function doUpload({ file, fileName, onProgress, options }: FsUploaderDoUploadOptions): Promise<FsUploaderResult> {
  const key = await buildKey(file, fileName, options);
  const config = options as FsUploaderCosOptions;
  // TODO 大文件需要分片上传
  const cos = getOssClient(config);
  return new Promise((resolve, reject) => {
    // onProgress({
    //   total: 0,
    //   percent: 0
    // })
    cos.putObject(
      {
        Bucket: config.bucket,
        Region: config.region,
        Key: key,
        Body: file,
        onProgress(progressEvent) {
          const e = progressEvent;
          if (e.total > 0) {
            e.percent = Math.floor((e.loaded / e.total) * 100);
          }
          onProgress(e);
        }
      },
      async function (err, data) {
        if (err != null) {
          console.error(err);
          reject(err);
          return;
        }
        let result: any = { url: config.domain + "/" + key, key: key };
        if (config.successHandle) {
          result = await config.successHandle(result);
          resolve(result);
          return;
        }
        resolve(result);
      }
    );
  });
}

export async function upload(context: FsUploaderDoUploadOptions): Promise<FsUploaderResult> {
  const { getConfig } = useUploader();
  const global = getConfig("cos");
  const options = context.options;
  const config = merge(cloneDeep(global), options);
  context.options = config;
  return await doUpload(context);
}
