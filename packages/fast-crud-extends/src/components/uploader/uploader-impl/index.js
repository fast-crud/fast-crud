import _ from "lodash-es";

export function useUploader(vm) {
  function getDefaultType() {
    const config = vm.$fs_uploader_config;
    return config?.defaultType;
  }
  function getUploaderImpl(type) {
    return `Fs${_.capitalize(type)}Uploader`;
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
    getUploaderImpl,
  };
}
