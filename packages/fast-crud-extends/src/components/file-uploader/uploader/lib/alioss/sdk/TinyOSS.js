import objectAssign from 'object-assign'
import ajax from './utils/ajax'
import {
  unix,
  assertOptions,
  getSignature
} from './utils'

export default class TinyOSS {
  constructor (options = {}) {
    assertOptions(options)

    this.opts = objectAssign({
      region: 'oss-cn-hangzhou',
      internal: false,
      cname: false,
      secure: false,
      timeout: 60000
    }, options)

    const {
      bucket,
      region,
      endpoint,
      internal
    } = this.opts

    this.host = ''

    if (endpoint) {
      this.host = endpoint
    } else {
      let host = bucket
      if (internal) {
        host += '-internal'
      }
      host += `.${region}.aliyuncs.com`
      this.host = host
    }
  }

  put (objectName, blob) {
    return new Promise((resolve, reject) => {
      const {
        accessKeyId,
        accessKeySecret,
        stsToken,
        bucket
      } = this.opts
      const verb = 'PUT'
      // const contentMd5 = getContentMd5(buf)
      const contentType = blob.type
      const headers = {
        // 'Content-Md5': contentMd5,
        'Content-Type': contentType,
        'x-oss-date': new Date().toGMTString()
      }

      if (stsToken) {
        headers['x-oss-security-token'] = stsToken
      }

      const signature = getSignature({
        verb,
        // contentMd5,
        headers,
        bucket,
        objectName,
        accessKeyId,
        accessKeySecret
      })

      headers.Authorization = `OSS ${accessKeyId}:${signature}`
      const protocol = this.opts.secure ? 'https' : 'http'
      const url = `${protocol}://${this.host}/${objectName}`
      return ajax(url, {
        method: verb,
        headers,
        data: blob,
        timeout: this.opts.timeout
      }).then(resolve)
        .catch(reject)
    })
  }

  signatureUrl (objectName, options = {}) {
    const {
      expires = 1800,
      method,
      process,
      response
    } = options
    const {
      accessKeyId,
      accessKeySecret,
      stsToken,
      bucket
    } = this.opts
    const headers = {}
    const subResource = {}

    if (process) {
      const processKeyword = 'x-oss-process'
      subResource[processKeyword] = process
    }

    if (response) {
      Object.keys(response).forEach((k) => {
        const key = `response-${k.toLowerCase()}`
        subResource[key] = response[k]
      })
    }

    Object.keys(options).forEach((key) => {
      const lowerKey = key.toLowerCase()
      const value = options[key]
      if (lowerKey.indexOf('x-oss-') === 0) {
        headers[lowerKey] = value
      } else if (lowerKey.indexOf('content-type') === 0) {
        headers[key] = value
      } else if (lowerKey !== 'expires' && lowerKey !== 'response' && lowerKey !== 'process' && lowerKey !== 'method') {
        subResource[lowerKey] = value
      }
    })

    const securityToken = options['security-token'] || stsToken
    if (securityToken) {
      subResource['security-token'] = securityToken
    }

    const expireUnix = unix() + expires
    const signature = getSignature({
      type: 'url',
      verb: method || 'GET',
      accessKeyId,
      accessKeySecret,
      bucket,
      objectName,
      headers,
      subResource,
      expires: expireUnix
    })
    const protocol = this.opts.secure ? 'https' : 'http'
    let url = `${protocol}://${this.host}/${objectName}`
    url += `?OSSAccessKeyId=${accessKeyId}`
    url += `&Expires=${expireUnix}`
    url += `&Signature=${encodeURIComponent(signature)}`
    Object.keys(subResource).forEach((k) => {
      url += `&${k}=${encodeURIComponent(subResource[k])}`
    })

    return url
  }
}
