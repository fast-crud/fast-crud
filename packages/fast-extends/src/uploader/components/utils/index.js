import _ from "lodash-es";
export async function buildKey(file, fileName, config) {
  return config.buildKey({
    fileName,
    file,
    ...config
  });
}
export function useUploader(vm) {
  function getDefaultType() {
    const config = vm.$fs_uploader_config;
    return config?.defaultType;
  }
  function getUploaderImpl(type) {
    return `FsUploader${_.upperFirst(type)}`;
  }
  function getConfig(type) {
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
