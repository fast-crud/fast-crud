<template>
  <span class="fs-cos-uploader"></span>
</template>
<script>
import _ from "lodash-es";
import { getCurrentInstance } from "vue";
import { buildKey } from "./lib/utils";
import { useUploader } from "./index";
import { utils } from "@fast-crud/fast-crud";
import COS from "cos-js-sdk-v5";
const logger = utils.logger;
function newClient(options) {
  let client = null;
  const secretId = options.secretId;
  const secretKey = options.secretKey;
  const getAuthorization = options.getAuthorization;
  if (getAuthorization) {
    client = new COS({
      // 必选参数
      getAuthorization(options, callback) {
        // 不传secretKey代表使用临时签名模式,此时此参数必传（安全，生产环境推荐）
        getAuthorization(options).then((data) => {
          callback(data);
        });
      },
    });
  } else {
    logger.warn("您还未配置getAuthorization，将使用SecretKey授权进行上传");
    client = new COS({
      SecretId: secretId,
      SecretKey: secretKey,
    });
  }

  return client;
}
async function doUpload({ file, fileName, onProgress, options }) {
  const key = await buildKey(file, fileName, options);
  const config = options;
  logger.debug("-----------开始上传----------", fileName, options);
  // TODO 大文件需要分片上传
  const cos = newClient(options);
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
        },
      },
      async function (err, data) {
        if (err != null) {
          logger.debug(err);
          reject(err);
          return;
        }
        logger.debug("上传成功", data);
        let result = { url: config.domain + "/" + key, key: key };
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
export default {
  name: "FsCosUploader",
  setup() {
    const { proxy } = getCurrentInstance();
    const { getConfig } = useUploader(proxy);
    const global = getConfig("cos");
    async function upload(context) {
      const options = context.options;
      const config = _.merge(_.cloneDeep(global), options);
      context.options = config;
      return await doUpload(context);
    }
    return { upload };
  },
};
</script>
