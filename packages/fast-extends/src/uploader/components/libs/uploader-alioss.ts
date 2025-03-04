import { merge, cloneDeep } from "lodash-es";
import { buildKey, useUploader } from "../utils/index";
import OSS from "ali-oss";
import {
  FsUploaderAliossOptions,
  FsUploaderDoUploadOptions,
  FsUploaderGetAuthContext,
  FsUploaderResult,
  FsUploaderAliossSTS
} from "../../d/type";

let sts: any = null;
export async function getSts(config: FsUploaderGetAuthContext): Promise<FsUploaderAliossSTS> {
  if (sts != null && sts.expiresTime > new Date().getTime()) {
    return sts;
  }
  const options = config as FsUploaderAliossOptions;
  // 需要重新获取sts
  const ret = await options.getAuthorization(config);
  sts = ret;
  if (sts.expiresTime == null) {
    sts.expiresTime = new Date().getTime() + parseInt(ret.expiration);
  }
  return sts as FsUploaderAliossSTS;
}

export type AliOSSClientWrap = {
  client: OSS;
  key: string;
};

export async function getOssClient(
  options: FsUploaderAliossOptions,
  key: string,
  file: File
): Promise<AliOSSClientWrap> {
  let sts = null;
  if (!options.accessKeyId && !options.accessKeySecret && options.getAuthorization !== null) {
    sts = await getSts({
      key,
      file,
      ...options
    });
  } else {
    console.warn("您还未配置getAuthorization，将使用accessKeySecret作为授权进行上传");
  }
  let client = null;
  if (sts != null) {
    client = new OSS({
      region: options.region,
      accessKeyId: sts.accessKeyId,
      accessKeySecret: sts.accessKeySecret,
      stsToken: sts.securityToken,
      bucket: options.bucket,
      ...options.sdkOpts
    });
    key = sts.key || key;
  } else {
    client = new OSS({
      region: options.region,
      accessKeyId: options.accessKeyId,
      accessKeySecret: options.accessKeySecret,
      bucket: options.bucket,
      ...options.sdkOpts
    });
  }
  return { client, key };
}
/**
 *
 * @param config
 * {
 *   bucket,
 *   custom,
 *   secretKey,
 *   region,
 *   domain,
 *   accessKeyId,
 *   accessKeySecret,
 *   getAuthorization(custom)
 * }
 * @returns  上传结果 {url:xxx}
 */
async function doUpload(opts: FsUploaderDoUploadOptions): Promise<FsUploaderResult> {
  const { file, fileName, onProgress } = opts;
  const options: FsUploaderAliossOptions = opts.options as FsUploaderAliossOptions;
  const build_key = await buildKey(file, fileName, options);
  const { client, key } = await getOssClient(options, build_key, file);
  await client.put(key, file);
  let result: any = { url: options.domain + "/" + key, key: key };
  if (options.successHandle) {
    result = await options.successHandle(result, options);
  }
  return result;

  /**
     * onProgress (progressEvent) {
          logger.debug('progressEvent', progressEvent)
          let e = progressEvent
          if (e.total > 0) {
            e.percent = e.loaded / e.total * 100
          }
          option.onProgress(e)
        }
     */
}

export async function upload(context: FsUploaderDoUploadOptions): Promise<FsUploaderResult> {
  const { getConfig } = useUploader();
  const global = getConfig("alioss");

  const options = context.options;
  const config = merge(cloneDeep(global), options);
  context.options = config;
  return await doUpload(context);
}
