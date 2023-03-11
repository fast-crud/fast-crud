export type FileItem = {
  url?: string;
  name?: string;
  md5?: string;
  previewUrl?: string;
  key?: string;
  size?: string;
};

export type UploadRequestProps = {
  action?: string;
  file: File;
  onProgress: (progress: { percent: number }) => void;
};

export type SignedUrlType = "get" | "put";
