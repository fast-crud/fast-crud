<template>
  <span class="fs-uploader-s3"></span>
</template>
<script lang="ts">
import _ from "lodash-es";
import { useUploader, buildKey } from "./utils/index.js";
import { getCurrentInstance } from "vue";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

async function doUpload({ file, fileName, onProgress, options }) {
  const client = new S3Client({
    ...(options.sdkOpts || {})
  });

  return new Promise(async (resolve, reject) => {
    const key = await buildKey(file, fileName, options);
    async function complete() {
      let ret = { url: options.sdkOpts.endpoint + "/" + options.bucket + "/" + key, key: key };
      if (options.successHandle) {
        ret = await options.successHandle(ret);
        resolve(ret);
        return;
      }
      resolve(ret);
    }

    const params = {
      Bucket: options.bucket, // The name of the bucket. For example, 'sample_bucket_101'.
      Key: key // The name of the object. For example, 'sample_upload.txt'.
    };
    try {
      await client.send(new PutObjectCommand({ Body: file, ...params }));
      return complete();
    } catch (err) {
      reject(err);
    }
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
