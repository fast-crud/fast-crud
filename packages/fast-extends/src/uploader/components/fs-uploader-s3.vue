<template>
  <span class="fs-uploader-s3"></span>
</template>
<script lang="ts">
import _ from "lodash-es";
import { useUploader, buildKey } from "./utils/index.js";
import { getCurrentInstance } from "vue";
import Minio from "minio";

async function doUpload({ file, fileName, onProgress, options }) {
  const minioClient = new Minio.Client({
    ...(options.sdkOpts || {})
  });

  return new Promise(async (resolve, reject) => {
    const key = await buildKey(file, fileName, options);
    const metaData = {
      "Content-Type": "application/octet-stream",
      // "X-Amz-Meta-Testing": 1234,
      // example: 5678
      ...options.metaData
    };
    async function complete() {
      let ret = { url: options.domain + "/" + key, key: key };
      if (options.successHandle) {
        ret = await options.successHandle(ret);
        resolve(ret);
        return;
      }
      resolve(ret);
    }
    return minioClient.fPutObject(options.bucket, key, file, metaData, function (err, etag) {
      if (err) {
        reject(err);
      }
      //onProgress(res.total);
      complete();
    });
  });
}
export default {
  name: "FsUploaderS3",
  setup() {
    const { proxy } = getCurrentInstance();
    const { getConfig } = useUploader(proxy);
    const global = getConfig("s3");
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
