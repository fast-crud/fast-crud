import { merge, cloneDeep } from "lodash-es";
import { buildKey, useUploader } from "../utils/index.js";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { axiosInstance } from "../utils/axios";
import { FsUploaderDoUploadOptions, FsUploaderS3Options, FsUploaderS3SignedUrlType } from "../../d/type";

export async function buildSignedUrl(s3Options: FsUploaderS3Options, key: string, type: FsUploaderS3SignedUrlType) {
  if (!s3Options.getSignedUrl) {
    console.error("请先配置uploader.getSignedUrl，该方法应该从后端获取签名url");
  }
  const signedUrl = await s3Options.getSignedUrl(s3Options.bucket, key, s3Options, type);
  return signedUrl;
}

export async function uploadUsingSignedUrl(props: FsUploaderDoUploadOptions, key: string) {
  const { file, onProgress, options } = props;
  const s3Options: FsUploaderS3Options = options as FsUploaderS3Options;
  const signedUrl = await buildSignedUrl(s3Options, key, "put");
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
    const ret = { url: s3Options.sdkOpts.endpoint + "/" + s3Options.bucket + "/" + key, key: key };
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

export async function upload(context: FsUploaderDoUploadOptions) {
  const { getConfig } = useUploader();
  const global = getConfig("s3");
  const options = context.options;
  const config = merge(cloneDeep(global), options);
  context.options = config;
  return await doUpload(context);
}
