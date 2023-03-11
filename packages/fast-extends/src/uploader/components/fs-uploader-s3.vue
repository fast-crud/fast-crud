<template>
  <span class="fs-uploader-s3"></span>
</template>
<script lang="ts">
import _ from "lodash-es";
import { useUploader, buildKey } from "./utils/index.js";
import { getCurrentInstance } from "vue";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { axiosInstance } from "./utils/axios";

async function uploadUsingSignedUrl(file, onProgress, options: any, key: string) {
  const signedUrl = await options.getSignedUrl(options.bucket, key, options);
  const decodedURL = decodeURIComponent(signedUrl);

  return await axiosInstance.put(decodedURL, file, {
    onUploadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;
      onProgress(Math.round((loaded * 100) / total));
    }
  });
}
async function doUpload({ file, fileName, onProgress, options }) {
  const client = new S3Client({
    ...(options.sdkOpts || {})
  });

  const key = await buildKey(file, fileName, options);
  async function complete() {
    let ret = { url: options.sdkOpts.endpoint + "/" + options.bucket + "/" + key, key: key };
    if (options.successHandle) {
      ret = await options.successHandle(ret);
      return ret;
    }
    return ret;
  }

  if (options.getSignedUrl) {
    await uploadUsingSignedUrl(file, onProgress, options, key);
  } else {
    const params = {
      Bucket: options.bucket, // The name of the bucket. For example, 'sample_bucket_101'.
      Key: key // The name of the object. For example, 'sample_upload.txt'.
    };
    await client.send(new PutObjectCommand({ Body: file, ...params }));
  }
  return await complete();
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
