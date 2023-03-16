import _ from "lodash-es";
import { FsUploaderImplOptions } from "@/uploader/d.ts/type";
export async function buildKey(file: File, fileName: string, config: FsUploaderImplOptions) {
  return config.buildKey({
    fileName,
    file,
    ...config
  });
}
export function useUploader(vm: any) {
  function getDefaultType() {
    const config = vm.$fs_uploader_config;
    return config?.defaultType;
  }
  function getUploaderImpl(type: string) {
    return `FsUploader${_.upperFirst(type)}`;
  }
  function getConfig(type: string) {
    if (type == null) {
      type = getDefaultType();
    }
    const defaultConfig = vm.$fs_uploader_config || {};
    const config = defaultConfig[type];
    if (config.buildKey == null) {
      config.buildKey = defaultConfig.buildKey;
    }
    return config;
  }

  return {
    getConfig,
    getDefaultType,
    getUploaderImpl
  };
}
