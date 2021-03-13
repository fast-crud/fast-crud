import ajax from "./ajax";
import _ from "lodash-es";
import { utils } from "@fast-crud/fast-crud";
const logger = utils.logger;
export default {
  options: undefined,
  init(options) {
    this.options = options;
  },
  /**
   *
   * @param option {file,filename,action,data,headers}
   * @param config
   * @returns {Promise<unknown>}
   */
  async upload({ file, fileName, onProgress, onError, config }) {
    const options = _.cloneDeep(this.options);
    _.merge(options, config);
    config = options;
    const option = {
      file,
      onProgress,
      onError,
      ...config
    };
    let key = config.buildKey(fileName, {
      file,
      ...(config.custom || {})
    });
    if (key instanceof Promise) {
      key = await key;
    }
    if (options.data == null) {
      options.data = {};
    }
    options.data.key = key;
    logger.debug("upload option ", options);
    return new Promise((resolve, reject) => {
      // onProgress({
      //   total: 0,
      //   percent: 0
      // })
      ajax(
        option,
        async res => {
          try {
            const url = await config.successHandle(res, option);
            if (url && typeof url === "object" && url.key == null) {
              url.key = key;
            }
            resolve(url);
          } catch (e) {
            onError(e);
            reject(e);
          }
        },
        e => {
          onError(e);
          reject(e);
        }
      );
    });
  }
};
