<template>
  <span class="fs-uploader-alioss"></span>
</template>
<script>
import _ from "lodash-es";
import { useUploader, buildKey } from "./utils/index";
import OSS from "ali-oss";
import { getCurrentInstance } from "vue";
let sts = null;
async function getSts(config) {
  if (sts != null && sts.expiresTime > new Date().getTime()) {
    return sts;
  }
  // 需要重新获取sts
  const ret = await config.getAuthorization(config);
  sts = ret;
  sts.expiresTime = new Date().getTime() + parseInt(ret.expiration);
  return sts;
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
async function doUpload({ file, fileName, onProgress, options }) {
  const key = await buildKey(file, fileName, options);
  let sts = null;
  if (options.getAuthorization !== null) {
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
  } else {
    client = new OSS({
      region: options.region,
      accessKeyId: options.accessKeyId,
      accessKeySecret: options.accessKeySecret,
      bucket: options.bucket,
      ...options.sdkOpts
    });
  }
  await client.put(key, file);
  let result = { url: options.domain + "/" + key, key: key };
  if (options.successHandle) {
    result = await options.successHandle(result);
    return result;
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
export default {
  name: "FsUploaderAlioss",
  setup() {
    const { proxy } = getCurrentInstance();
    const { getConfig } = useUploader(proxy);
    const global = getConfig("alioss");
    async function upload(context) {
      const options = context.options;
      const config = _.merge(_.cloneDeep(global), options);
      context.options = config;
      return await doUpload(context);
    }
    return { upload };
  }
};
</script>
