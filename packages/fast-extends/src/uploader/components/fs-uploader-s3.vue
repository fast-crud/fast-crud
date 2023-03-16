<template>
  <span class="fs-uploader-s3"></span>
</template>
<script lang="ts">
import _ from "lodash-es";
import { useUploader, buildKey } from "./utils/index.js";
import { defineComponent, getCurrentInstance } from "vue";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { axiosInstance } from "./utils/axios";
import { FsUploaderDoUploadOptions, FsUploaderS3Options } from "@/uploader/d.ts/type";

async function uploadUsingSignedUrl(props: FsUploaderDoUploadOptions, key: string) {
  const { file, onProgress, options } = props;
  const s3Options: FsUploaderS3Options = options as FsUploaderS3Options;
  const signedUrl = await s3Options.getSignedUrl(s3Options.bucket, key, options);
  const decodedURL = decodeURIComponent(signedUrl);

  return await axiosInstance.put(decodedURL, file, {
    onUploadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;
      onProgress({ percent: Math.round((loaded * 100) / total) });
    }
  });
}
async function doUpload(props: FsUploaderDoUploadOptions) {
  const { file, fileName, onProgress, options } = props;
  const s3Options: FsUploaderS3Options = options as FsUploaderS3Options;
  const client = new S3Client({
    ...(s3Options?.sdkOpts || {})
  });

  const key = await buildKey(file, fileName, s3Options);
  async function complete() {
    let ret = { url: s3Options.sdkOpts.endpoint + "/" + s3Options.bucket + "/" + key, key: key };
    if (s3Options.successHandle) {
      return await s3Options.successHandle(ret);
    }
    return ret;
  }

  if (s3Options.getSignedUrl) {
    await uploadUsingSignedUrl(props, key);
  } else {
    const params = {
      Bucket: s3Options.bucket, // The name of the bucket. For example, 'sample_bucket_101'.
      Key: key // The name of the object. For example, 'sample_upload.txt'.
    };
    await client.send(new PutObjectCommand({ Body: file, ...params }));
  }
  return await complete();
}
export default defineComponent({
  name: "FsUploaderS3",
  setup() {
    const { proxy } = getCurrentInstance();
    const { getConfig } = useUploader(proxy);
    const global = getConfig("s3");
    async function upload(context: FsUploaderDoUploadOptions) {
      const options = context.options;
      const config = _.merge(_.cloneDeep(global), options);
      context.options = config;
      return await doUpload(context);
    }
    return { upload };
  }
});
</script>
