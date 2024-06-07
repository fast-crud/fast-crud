import { S3ClientConfig } from "@aws-sdk/client-s3";

export type FileItem = {
  url?: string;
  name?: string;
  md5?: string;
  previewUrl?: string;
  key?: string;
  size?: string;

  [key: string]: any;
};

export type FsUploaderS3SignedUrlType = "get" | "put";

export type FsUploaderBuildKeyContext = {
  fileName: string;
  fileType?: string;
  keepName?: boolean;

  file: File;
} & FsUploaderImplOptions;

export type FsUploaderGetAuthContext = {
  file: File;
  key: string;
  fileName?: string;
} & FsUploaderImplOptions;

export type FsUploaderOptions = {
  defaultType?: "cos" | "alioss" | "qiniu" | "form" | "s3";
  cos?: Partial<FsUploaderCosOptions>;
  alioss?: Partial<FsUploaderAliossOptions>;
  qiniu?: Partial<FsUploaderQiniuOptions>;
  form?: Partial<FsUploaderFormOptions>;
  s3?: Partial<FsUploaderS3Options>;
  buildKey?: (context: FsUploaderBuildKeyContext) => Promise<string>;
};

export type FsUploaderResult = {
  url?: string;
  key?: string;
  [key: string]: any;
};
export type FsUploaderSuccessHandle = (ret: any, options?: FsUploaderImplOptions) => Promise<FsUploaderResult>;

export type FsUploaderCosOptions = {
  domain?: string; //"https://d2p-demo-1251260344.cos.ap-guangzhou.myqcloud.com",
  bucket?: string; //"d2p-demo-1251260344",
  region?: string; //"",
  secretId?: string; //"", //
  secretKey?: string; //"", // 传了secretKey 和secretId 代表使用本地签名模式（不安全，生产环境不推荐）
  getAuthorization?: (context: FsUploaderCosOptions) => Promise<any>;
} & FsUploaderCommonOptions;
export type FsUploaderAliossOptions = {
  domain: string; //"https://d2p-demo.oss-cn-shenzhen.aliyuncs.com",
  bucket: string; //"d2p-demo",
  region: string; //"oss-cn-shenzhen",
  accessKeyId?: string; // "",
  accessKeySecret?: string; // "", // 传了secretKey 和secretId 代表使用本地签名模式（不安全，生产环境不推荐）
  getAuthorization: (context: FsUploaderGetAuthContext) => Promise<FsUploaderAliossSTS>;
  keepName?: boolean;
  sdkOpts?: any;
} & FsUploaderCommonOptions;
export type FsUploaderQiniuOptions = {
  bucket?: string; // "d2p-demo"
  getToken?: (context: FsUploaderGetAuthContext) => Promise<any>;
  domain?: string; // "http://pzrsldiu3.bkt.clouddn.com",
} & FsUploaderCommonOptions;

export type FsUploaderFormOptions = {
  /**
   * 请求url
   */
  action?: string;
  /**
   * 文件参数
   */
  name?: string;
  /**
   * headers
   */
  headers?: any;
  /**
   * 额外的上传参数
   */
  data?: any;
  /**
   * 获取授权等接口中将会传入
   */
  custom?: any;
  /**
   * 自定义上传请求
   * @param file
   * @param action
   */
  uploadRequest?: (props: FsUploaderFormRequestOptions) => Promise<any>;
} & FsUploaderCommonOptions;

export type FsUploaderS3Options = {
  bucket?: string;
  sdkOpts?: S3ClientConfig;

  getSignedUrl?: (
    bucket: string,
    key: string,
    options: FsUploaderS3Options,
    type: FsUploaderS3SignedUrlType
  ) => Promise<string>;
} & FsUploaderCommonOptions;

export type FsUploaderImplOptions =
  | FsUploaderCosOptions
  | FsUploaderAliossOptions
  | FsUploaderQiniuOptions
  | FsUploaderFormOptions
  | FsUploaderS3Options;

export type FsUploaderCommonOptions = {
  keepName?: boolean;
  successHandle?: FsUploaderSuccessHandle;
  buildKey?: (context: FsUploaderBuildKeyContext) => Promise<string>;

  /**
   * 额外的参数
   */
  [key: string]: any;
};

export type FsUploaderDoUploadOptions = {
  file: File;
  fileName: string;
  onProgress: (progress: { percent: number }) => void;
  options?: FsUploaderImplOptions;

  successHandle?: FsUploaderSuccessHandle;
};

export type FsUploaderFormRequestOptions = {
  file: File;
  onProgress: (progress: { percent: number }) => void;
  timeout: number;
} & FsUploaderImplOptions;

export type FsUploaderLib = {
  upload(context: FsUploaderDoUploadOptions): Promise<FsUploaderResult>;
};
export type FsUploaderAlioss = {
  getSts(config: FsUploaderGetAuthContext): Promise<FsUploaderAliossSTS>;
  getOssClient(options: FsUploaderAliossOptions, key: string, file: File): Promise<any>;
} & FsUploaderLib;

export type FsUploaderAliossSTS = {
  accessKeyId: string;
  accessKeySecret: string;
  expiration?: string;
  securityToken: string;
  expiresTime?: number;
  key?: string;
};

export type FsUploaderCos = {
  getOssClient(options: FsUploaderCosOptions): Promise<any>;
} & FsUploaderLib;

export type FsUploaderQiniu = {
  getToken(file: File, fileName: string, key: string, config: FsUploaderQiniuOptions): Promise<string>;
} & FsUploaderLib;

export type FsUploaderS3 = {
  buildSignedUrl(options: FsUploaderS3Options, key: string, type: FsUploaderS3SignedUrlType): Promise<string>;
  uploadUsingSignedUrl(props: FsUploaderDoUploadOptions, key: string): Promise<any>;
} & FsUploaderLib;

export type FsUploaderForm = {} & FsUploaderLib;
