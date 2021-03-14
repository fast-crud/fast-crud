<template>
  <span class="fs-qiniu-uploader"></span>
</template>
<script>
import _ from "lodash-es";
import { buildKey } from "./lib/utils";
import { useUploader } from "./index";
import * as qiniu from "qiniu-js";
import { utils } from "@fast-crud/fast-crud";
const logger = utils.logger;
async function getToken(file, fileName, key, config) {
  const ret = await config.getToken({
    fileName,
    key,
    file,
    ...config.custom,
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

async function doUpload({ file, fileName, onProgress, options }) {
  const key = await buildKey(file, fileName, options);
  logger.debug("-----------开始上传----------", fileName, options);
  const token = await getToken(file, fileName, key, options);

  return new Promise((resolve, reject) => {
    /**
     */
    const observable = qiniu.upload(
      file,
      key,
      token,
      options.putExtra,
      options.putConfig
    );
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
    const subscription = observable.subscribe({
      next(res) {
        if (res) {
          onProgress(res.total);
        }
      },
      error(err) {
        reject(err);
      },
      async complete(res) {
        let ret = { url: options.domain + "/" + key, key: key };
        if (options.successHandle) {
          ret = await options.successHandle(ret);
          resolve(ret);
          return;
        }
        resolve(ret);
      },
    }); // 上传开始
    // subscription.unsubscribe() // 上传取消
  });
}
export default {
  name: "FsQiniuUploader",
  setup() {
    const { getConfig } = useUploader();
    const global = getConfig("qiniu");
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
