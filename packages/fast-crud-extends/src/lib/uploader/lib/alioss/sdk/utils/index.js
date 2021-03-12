import base64js from 'base64-js'
import Digest from '../vendor/digest'
import log from '../../../../../utils/util.log'
function isDate (obj) {
  return obj && Object.prototype.toString.call(obj) === '[object Date]' && obj.toString !== 'Invalid Date'
}

function unix (date) {
  let d
  if (date) {
    d = new Date(date)
  }
  if (!isDate(d)) {
    d = new Date()
  }
  return Math.round(d.getTime() / 1000)
}

function blobToBuffer (blob) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = () => {
      const result = new Uint8Array(fr.result)
      resolve(result)
    }
    fr.onerror = () => {
      reject(fr.error)
    }
    fr.readAsArrayBuffer(blob)
  })
}

function assertOptions (options) {
  const {
    accessKeyId,
    accessKeySecret,
    bucket,
    endpoint
  } = options
  if (!accessKeyId) {
    throw new Error('need accessKeyId')
  }
  if (!accessKeySecret) {
    throw new Error('need accessKeySecret')
  }
  if (!bucket && !endpoint) {
    throw new Error('need bucket or endpoint')
  }
}

function getCanonicalizedOSSHeaders (headers) {
  let result = ''
  let headerNames = Object.keys(headers)

  headerNames = headerNames.map(name => name.toLowerCase())
  headerNames.sort()

  headerNames.forEach((name) => {
    if (name.indexOf('x-oss-') === 0) {
      result += `${name}:${headers[name]}\n`
    }
  })

  return result
}

function getCanonicalizedResource (bucket = '', objectName = '', parameters) {
  let resourcePath = ''
  if (bucket) {
    resourcePath += `/${bucket}`
  }
  if (objectName) {
    if (objectName.charAt(0) !== '/') {
      resourcePath += '/'
    }
    resourcePath += objectName
  }

  let canonicalizedResource = `${resourcePath}`
  let separatorString = '?'

  if (parameters) {
    const compareFunc = (entry1, entry2) => {
      if (entry1[0] > entry2[0]) {
        return 1
      } if (entry1[0] < entry2[0]) {
        return -1
      }
      return 0
    }
    const processFunc = (key) => {
      canonicalizedResource += separatorString + key
      if (parameters[key]) {
        canonicalizedResource += `=${parameters[key]}`
      }
      separatorString = '&'
    }
    Object.keys(parameters).sort(compareFunc).forEach(processFunc)
  }

  return canonicalizedResource
}

function getSignature (options = {}) {
  const {
    type = 'header',
    verb = '',
    contentMd5 = '',
    expires = unix() + 3600,
    bucket,
    objectName,
    accessKeySecret,
    headers = {},
    subResource
  } = options
  const date = headers['x-oss-date'] || ''
  const contentType = headers['Content-Type'] || ''
  const data = [
    verb,
    contentMd5,
    contentType
  ]

  if (type === 'header') {
    data.push(date)
  } else {
    data.push(expires)
  }

  const canonicalizedOSSHeaders = getCanonicalizedOSSHeaders(headers)
  const canonicalizedResource = getCanonicalizedResource(bucket, objectName, subResource)

  data.push(`${canonicalizedOSSHeaders}${canonicalizedResource}`)
  const text = data.join('\n')
  log.debug('text', text, accessKeySecret)
  const hmac = new Digest.HMAC_SHA1()
  hmac.setKey(accessKeySecret)
  hmac.update(text)
  const hashBuf = new Uint8Array(hmac.finalize())
  const signature = base64js.fromByteArray(hashBuf)
  return signature
}

export {
  unix,
  blobToBuffer,
  assertOptions,
  getCanonicalizedOSSHeaders,
  getCanonicalizedResource,
  getSignature
}
