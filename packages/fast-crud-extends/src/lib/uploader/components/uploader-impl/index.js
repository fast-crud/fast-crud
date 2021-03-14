import _ from "lodash-es";
import defaultConfig from "./config";

export function useUploader() {
  function setConfig(config) {
    _.merge(defaultConfig, config);
  }
  function getDefaultType() {
    return defaultConfig.defaultType;
  }
  function getUploaderImpl(type) {
    return `Fs${_.capitalize(type)}Uploader`;
  }
  function getConfig(type) {
    if (type == null) {
      type = getDefaultType();
    }
    const config = defaultConfig[type];
    if (config.buildKey == null) {
      config.buildKey = defaultConfig.buildKey;
    }
    return config;
  }

  return {
    getConfig,
    getDefaultType,
    setConfig,
    getUploaderImpl,
  };
}
