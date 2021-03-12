
if (!ArrayBuffer.prototype.slice) {
  // eslint-disable-next-line no-extend-native
  ArrayBuffer.prototype.slice = function (start, end) {
    var i
    var that = new Uint8Array(this)
    if (end === undefined) {
      end = that.length
    }
    var result = new ArrayBuffer(end - start)
    var resultArray = new Uint8Array(result)
    for (i = 0; i < resultArray.length; i++) {
      resultArray[i] = that[i + start]
    }
    return result
  }
}

function sha1Engine () {}

sha1Engine.prototype.processBlock = function (input) {
  var A = this.current[0]
  var B = this.current[1]
  var C = this.current[2]
  var D = this.current[3]
  var E = this.current[4]

  var W = [
    input[0] << 24 | input[1] << 16 | input[2] << 8 | input[3],
    input[4] << 24 | input[5] << 16 | input[6] << 8 | input[7],
    input[8] << 24 | input[9] << 16 | input[10] << 8 | input[11],
    input[12] << 24 | input[13] << 16 | input[14] << 8 | input[15],
    input[16] << 24 | input[17] << 16 | input[18] << 8 | input[19],
    input[20] << 24 | input[21] << 16 | input[22] << 8 | input[23],
    input[24] << 24 | input[25] << 16 | input[26] << 8 | input[27],
    input[28] << 24 | input[29] << 16 | input[30] << 8 | input[31],
    input[32] << 24 | input[33] << 16 | input[34] << 8 | input[35],
    input[36] << 24 | input[37] << 16 | input[38] << 8 | input[39],
    input[40] << 24 | input[41] << 16 | input[42] << 8 | input[43],
    input[44] << 24 | input[45] << 16 | input[46] << 8 | input[47],
    input[48] << 24 | input[49] << 16 | input[50] << 8 | input[51],
    input[52] << 24 | input[53] << 16 | input[54] << 8 | input[55],
    input[56] << 24 | input[57] << 16 | input[58] << 8 | input[59],
    input[60] << 24 | input[61] << 16 | input[62] << 8 | input[63]
  ]
  var T
  var i

  for (i = 16; i < 80; i++) {
    W.push((((W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16]) << 1) | ((W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16]) >>> 31)))
  }

  for (i = 0; i < 80; i++) {
    T = ((A << 5) | (A >>> 27)) + E + W[i]
    if (i < 20) {
      T += ((B & C) | (~B & D)) + 0x5A827999 | 0
    } else if (i < 40) {
      T += (B ^ C ^ D) + 0x6ED9EBA1 | 0
    } else if (i < 60) {
      T += ((B & C) | (B & D) | (C & D)) + 0x8F1BBCDC | 0
    } else {
      T += (B ^ C ^ D) + 0xCA62C1D6 | 0
    }
    E = D
    D = C
    C = ((B << 30) | (B >>> 2))
    B = A
    A = T
  }

  this.current[0] += A
  this.current[1] += B
  this.current[2] += C
  this.current[3] += D
  this.current[4] += E
  this.currentLen += 64
}

sha1Engine.prototype.doPadding = function () {
  var datalen = (this.inLen + this.currentLen) * 8
  var msw = 0 // FIXME
  var lsw = datalen & 0xFFFFFFFF
  var zeros = this.inLen <= 55 ? 55 - this.inLen : 119 - this.inLen
  var pad = new Uint8Array(new ArrayBuffer(zeros + 1 + 8))
  pad[0] = 0x80
  pad[pad.length - 1] = lsw & 0xFF
  pad[pad.length - 2] = (lsw >>> 8) & 0xFF
  pad[pad.length - 3] = (lsw >>> 16) & 0xFF
  pad[pad.length - 4] = (lsw >>> 24) & 0xFF
  pad[pad.length - 5] = msw & 0xFF
  pad[pad.length - 6] = (msw >>> 8) & 0xFF
  pad[pad.length - 7] = (msw >>> 16) & 0xFF
  pad[pad.length - 8] = (msw >>> 24) & 0xFF
  return pad
}

sha1Engine.prototype.getDigest = function () {
  var rv = new Uint8Array(new ArrayBuffer(20))
  rv[3] = this.current[0] & 0xFF
  rv[2] = (this.current[0] >>> 8) & 0xFF
  rv[1] = (this.current[0] >>> 16) & 0xFF
  rv[0] = (this.current[0] >>> 24) & 0xFF
  rv[7] = this.current[1] & 0xFF
  rv[6] = (this.current[1] >>> 8) & 0xFF
  rv[5] = (this.current[1] >>> 16) & 0xFF
  rv[4] = (this.current[1] >>> 24) & 0xFF
  rv[11] = this.current[2] & 0xFF
  rv[10] = (this.current[2] >>> 8) & 0xFF
  rv[9] = (this.current[2] >>> 16) & 0xFF
  rv[8] = (this.current[2] >>> 24) & 0xFF
  rv[15] = this.current[3] & 0xFF
  rv[14] = (this.current[3] >>> 8) & 0xFF
  rv[13] = (this.current[3] >>> 16) & 0xFF
  rv[12] = (this.current[3] >>> 24) & 0xFF
  rv[19] = this.current[4] & 0xFF
  rv[18] = (this.current[4] >>> 8) & 0xFF
  rv[17] = (this.current[4] >>> 16) & 0xFF
  rv[16] = (this.current[4] >>> 24) & 0xFF
  return rv.buffer
}

sha1Engine.prototype.reset = function () {
  this.currentLen = 0
  this.inLen = 0
  this.current = new Uint32Array(new ArrayBuffer(20))
  this.current[0] = 0x67452301
  this.current[1] = 0xEFCDAB89
  this.current[2] = 0x98BADCFE
  this.current[3] = 0x10325476
  this.current[4] = 0xC3D2E1F0
}

sha1Engine.prototype.blockLen = 64
sha1Engine.prototype.digestLen = 20

/* Input utility functions */

var fromASCII = function (s) {
  var buffer = new ArrayBuffer(s.length)
  var b = new Uint8Array(buffer)
  var i
  for (i = 0; i < s.length; i++) {
    b[i] = s.charCodeAt(i)
  }
  return b
}

var fromInteger = function (v) {
  var buffer = new ArrayBuffer(1)
  var b = new Uint8Array(buffer)
  b[0] = v
  return b
}

var convertToUint8Array = function (input) {
  if (input.constructor === Uint8Array) {
    return input
  } else if (input.constructor === ArrayBuffer) {
    return new Uint8Array(input)
  } else if (input.constructor === String) {
    return fromASCII(input)
  } else if (input.constructor === Number) {
    if (input > 0xFF) {
      // eslint-disable-next-line no-throw-literal
      throw 'For more than one byte, use an array buffer'
    } else if (input < 0) {
      // eslint-disable-next-line no-throw-literal
      throw 'Input value must be positive'
    }
    return fromInteger(input)
  } else {
    // eslint-disable-next-line no-throw-literal
    throw 'Unsupported type'
  }
}

// eslint-disable-next-line no-unused-vars
var convertToUInt32 = function (i) {
  var tmp = new Uint8Array(new ArrayBuffer(4))
  tmp[0] = (i & 0xFF000000) >> 24
  tmp[1] = (i & 0x00FF0000) >> 16
  tmp[2] = (i & 0x0000FF00) >> 8
  tmp[3] = (i & 0x000000FF)
  return tmp
}

/* Digest implementation */
var dg = function (Constructor) {
  var update = function (input) {
    var len = input.length
    var offset = 0
    while (len > 0) {
      var copyLen = this.blockLen - this.inLen
      if (copyLen > len) {
        copyLen = len
      }
      var tmpInput = input.subarray(offset, offset + copyLen)
      this.inbuf.set(tmpInput, this.inLen)
      offset += copyLen
      len -= copyLen
      this.inLen += copyLen
      if (this.inLen === this.blockLen) {
        this.processBlock(this.inbuf)
        this.inLen = 0
      }
    }
  }

  var finalize = function () {
    var padding = this.doPadding()
    this.update(padding)
    var result = this.getDigest()
    this.reset()
    return result
  }

  var engine = (function () {
    if (!Constructor) {
      // eslint-disable-next-line no-throw-literal
      throw 'Unsupported algorithm: ' + Constructor.toString()
    }
    Constructor.prototype.update = update
    Constructor.prototype.finalize = finalize
    var engine = new Constructor()
    engine.inbuf = new Uint8Array(new ArrayBuffer(engine.blockLen))
    engine.reset()
    return engine
  }())

  return {
    update: function (input) {
      engine.update(convertToUint8Array(input))
    },

    finalize: function () {
      return engine.finalize()
    },

    digest: function (input) {
      engine.update(convertToUint8Array(input))
      return engine.finalize()
    },

    reset: function () {
      engine.reset()
    },

    digestLength: function () {
      return engine.digestLen
    }
  }
}

/* HMAC implementation */
var hmac = function (digest) {
  var initialized = false
  var key, ipad, opad
  var init = function () {
    var i, kbuf
    if (initialized) {
      return
    }
    if (key === undefined) {
      // eslint-disable-next-line no-throw-literal
      throw 'MAC key is not defined'
    }
    if (key.byteLength > 64) { /* B = 64 */
      kbuf = new Uint8Array(digest.digest(key))
    } else {
      kbuf = new Uint8Array(key)
    }
    ipad = new Uint8Array(new ArrayBuffer(64))
    for (i = 0; i < kbuf.length; i++) {
      ipad[i] = 0x36 ^ kbuf[i]
    }
    for (i = kbuf.length; i < 64; i++) {
      ipad[i] = 0x36
    }
    opad = new Uint8Array(new ArrayBuffer(64))
    for (i = 0; i < kbuf.length; i++) {
      opad[i] = 0x5c ^ kbuf[i]
    }
    for (i = kbuf.length; i < 64; i++) {
      opad[i] = 0x5c
    }
    initialized = true
    digest.update(ipad.buffer)
  }

  var resetMac = function () {
    initialized = false
    key = undefined
    ipad = undefined
    opad = undefined
    digest.reset()
  }

  var finalizeMac = function () {
    var result = digest.finalize()
    digest.reset()
    digest.update(opad.buffer)
    digest.update(result)
    result = digest.finalize()
    resetMac()
    return result
  }

  var setKeyMac = function (k) {
    key = k
  }

  return {
    setKey: function (key) {
      setKeyMac(convertToUint8Array(key))
      init()
    },

    update: function (input) {
      digest.update(input)
    },

    finalize: function () {
      return finalizeMac()
    },

    mac: function (input) {
      this.update(input)
      return this.finalize()
    },

    reset: function () {
      resetMac()
    },

    hmacLength: function () {
      return digest.digestLength()
    }
  }
}

var Digest = {
  SHA1: function () {
    return dg(sha1Engine)
  },

  HMAC_SHA1: function () {
    return hmac(dg(sha1Engine))
  }
}
export default Digest
