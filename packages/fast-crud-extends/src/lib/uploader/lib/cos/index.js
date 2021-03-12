// 初始化实例
import COS from 'cos-js-sdk-v5'
import lodash from 'lodash'
import log from '../../utils/util.log'
function newClient (options) {
  let client = null
  const secretId = options.secretId
  const secretKey = options.secretKey
  const getAuthorization = options.getAuthorization
  if (secretId != null && secretId !== '' && secretKey != null && secretKey !== '') {
    client = new COS({
      SecretId: secretId,
      SecretKey: secretKey
    })
  } else {
    client = new COS({
      // 必选参数
      getAuthorization (options, callback) { // 不传secretKey代表使用临时签名模式,此时此参数必传（安全，生产环境推荐）
        getAuthorization(options).then(data => {
          // eslint-disable-next-line standard/no-callback-literal
          callback(data)
        })
      }
    })
  }
  return client
}
/**
 * config {
      getToken(custom,fileName),
      buildKey(fileName, custom),
      custom:{},
      domain:xxx,
      bucket,
      region,
      secretId,
      secretKey,
      getAuthorization()
    }
 */
export default {
  client: undefined,
  options: undefined,
  init (options) {
    this.options = options
    this.client = newClient(options)
  },
  getClient () {
    return this.client
  },
  async upload ({ file, fileName, onProgress, onError, config }) {
    const options = lodash.cloneDeep(this.options)
    lodash.merge(options, config)
    config = options
    log.debug('-----------开始上传----------', fileName)
    let key = config.buildKey(fileName, {
      file,
      ...(config.custom || {})
    })
    if (key instanceof Promise) {
      key = await key
    }
    // TODO 大文件需要分片上传
    const cos = this.getClient()
    return new Promise((resolve, reject) => {
      // onProgress({
      //   total: 0,
      //   percent: 0
      // })
      cos.putObject({
        Bucket: config.bucket,
        Region: config.region,
        Key: key,
        Body: file,
        onProgress (progressEvent) {
          const e = progressEvent
          if (e.total > 0) {
            e.percent = Math.floor(e.loaded / e.total * 100)
          }
          onProgress(e)
        }
      }, async function (err, data) {
        if (err != null) {
          onError(err)
          log.debug(err)
          reject(err)
        } else {
          log.debug('上传成功', data)
          let result = { url: config.domain + '/' + key, key: key }
          if (config.successHandle) {
            result = await config.successHandle(result)
            resolve(result)
            return
          }
          resolve(result)
        }
      })
    })
  }
}
