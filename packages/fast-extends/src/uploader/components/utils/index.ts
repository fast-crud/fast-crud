import { FsUploaderImplOptions, FsUploaderLib } from "../../d/type";
import { uploaderConfig } from "../../type/config";
import { loadUploader } from "../libs";

export async function buildKey(file: File, fileName: string, config: FsUploaderImplOptions) {
  return config.buildKey({
    fileName,
    file,
    ...config
  });
}
export function useUploader() {
  function getDefaultType(): string {
    const config = uploaderConfig;
    return config?.defaultType;
  }
  function getConfig(type: string) {
    if (type == null) {
      type = getDefaultType();
    }
    const defaultConfig = uploaderConfig;
    // @ts-ignore
    const config = uploaderConfig[type];
    if (config.buildKey == null) {
      config.buildKey = defaultConfig.buildKey;
    }
    return config;
  }

  async function getUploaderImpl(type: string): Promise<FsUploaderLib> {
    return await loadUploader<FsUploaderLib>(type || (getDefaultType() as string));
  }

  return {
    getConfig,
    getDefaultType,
    getUploaderImpl
  };
}
