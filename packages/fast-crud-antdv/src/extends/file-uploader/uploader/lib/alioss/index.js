import OSS from "ali-oss";
import _ from "lodash-es";
import { utils } from "@fast-crud/fast-crud";
const logger = utils.logger;
function getKey(file, fileName, config) {
  const key = config.buildKey(fileName, {
    file,
    ...(config.custom || {})
  });
  if (typeof key === "string") {
    return new Promise(resolve => {
      resolve(key);
    });
  } else {
    return key;
  }
}
export default {
  sts: undefined,
  options: undefined,
  init(options) {
    this.options = options;
  },
  getSts(config, custom) {
    if (this.sts == null || this.sts.expiresTime < new Date().getTime()) {
      // 需要重新获取sts
      return config.getAuthorization(custom).then(ret => {
        const sts = ret;
        sts.expiresTime = new Date().getTime() + parseInt(ret.expiration);
        this.sts = sts;
        return sts;
      });
    } else {
      // 不需要重新获取
      return new Promise(resolve => {
        resolve(this.sts);
      });
    }
  },
  /**
   *
   * @param config
   * {
   *   bucket,
   *   custom,
   *   secretKey,
   *   region,
   *   domain,
   *   accessKeyId,
   *   accessKeySecret,
   *   getAuthorization(custom)
   * }
   * @returns  上传结果 {url:xxx}
   */
  async upload({ file, fileName, onError, config }) {
    const options = _.cloneDeep(this.options);
    _.merge(options, config);
    config = options;
    logger.debug("-----------开始上传----------", fileName, config);
    const key = await getKey(file, fileName, config);
    let sts = null;
    if (this.options.getAuthorization !== null) {
      sts = await this.getSts(this.options, {
        key,
        file,
        ...(config.custom || {})
      });
    }
    /**
     // ret.data:{
        // private String securityToken;
        // private String accessKeySecret;
        // private String accessKeyId;
        // private String expiration;
        // }
     */
    let client = null;
    if (sts != null) {
      client = new OSS({
        region: config.region,
        accessKeyId: sts.accessKeyId,
        accessKeySecret: sts.accessKeySecret,
        stsToken: sts.securityToken,
        bucket: config.bucket,
        ...config.sdkOpts
      });
    } else {
      client = new OSS({
        region: config.region,
        accessKeyId: config.accessKeyId,
        accessKeySecret: config.accessKeySecret,
        bucket: config.bucket,
        ...config.sdkOpts
      });
    }
    return client
      .put(key, file)
      .then(async () => {
        let result = { url: config.domain + "/" + key, key: key };
        logger.debug("alioss success", result);
        if (config.successHandle) {
          result = await config.successHandle(result);
          return result;
        }
        return result;
      })
      .catch(err => {
        onError(err);
      });
    /**
     * onProgress (progressEvent) {
          logger.debug('progressEvent', progressEvent)
          let e = progressEvent
          if (e.total > 0) {
            e.percent = e.loaded / e.total * 100
          }
          option.onProgress(e)
        }
     */
  }
};
