import _ from 'lodash-es'
import logger from '../utils/util.log'

import { ref } from 'vue'
let dictRequest = async () => {
  logger.warn('请在 app.use(FsCrud,{dictRequest:()=>{ 你的字典请求方法 }})')
}
let def = {
  value: 'value',
  label: 'label',
  children: 'children',
  cache: true
}
const cache = new Map()
export class Dict {
  constructor (opts) {
    const options = _.merge(def, opts)
    const { url, data, cache, getData, value, label, children } = options
    this.value = value
    this.label = label
    this.children = children
    if (this.data) {
      this.dataMap = Dict.toMap(this, this.data)
    }
    this.loaded = false
    this.url = url
    this._CustomGetDataFunc = getData

    this.data = data
    this.cache = cache
    // this.init()
  }

  static toMap (dict, data) {
    const map = {}
    if (data) {
      _.forEach(data, (item) => {
        map[item[dict.value]] = item
      })
    }
    return map
  }

  static async getRemoteDictData (dict, scope) {
    let dictData
    if (dict._CustomGetDataFunc) {
      dictData = await dict._CustomGetDataFunc({ dict, ...scope })
    } else if (dict.url) {
      dictData = await dictRequest({ dict, ...scope })
    } else {
      return
    }
    return dictData
  }

  static create (opts) {
    return new Dict(opts)
  }

  static async getDictData (dict, scope) {
    if (dict.data) {
      return {
        data: dict.data,
        dataMap: dict.dataMap
      }
    }

    const cacheEnabled = dict.url && dict.cache
    let cached = null
    if (cacheEnabled) {
      cached = cache.get(dict.url)
      if (cached) {
        if (cached.loaded) {
          return {
            data: cached.data,
            dataMap: cached.dataMap
          }
        } else {
          // 还在load
          return new Promise(resolve => {
            cached.callbacks.push((ret) => {
              resolve(ret)
            })
          })
        }
      } else {
        cached = { loaded: false, callbacks: [] }
        cache.set(dict.url, cached)
      }
    }

    const dictData = await Dict.getRemoteDictData(dict, scope)

    const ret = {
      data: dictData,
      dataMap: Dict.toMap(dict, dictData)
    }

    if (cached) {
      cached.loaded = true
      cached.data = ret.data
      cached.dataMap = ret.dataMap
      _.forEach(cached.callbacks, cb => {
        cb(ret)
      })
    }

    return ret
  }
}

export function setDictRequest (request) {
  dictRequest = request
}

export function setDictDefaultOptions (defaultOpts) {
  def = defaultOpts
}

export function useDict (props, ctx) {
  const dictData = ref([])
  const dictMap = ref({})
  const dictLoading = ref(false)
  const loadDict = async () => {
    dictLoading.value = true
    try {
      const ret = await Dict.getDictData(props.dict, { ...ctx.attrs })
      dictData.value = ret.data
      dictMap.value = ret.dataMap
    } finally {
      dictLoading.value = false
    }
  }

  loadDict()

  const clearDict = () => {
    dictData.value = []
    dictMap.value = {}
  }

  const reloadDict = () => {
    clearDict()
    loadDict()
  }

  return {
    dictData,
    dictMap,
    loadDict,
    reloadDict,
    clearDict,
    dictLoading
  }
}

export function dict (opts) {
  return Dict.create(opts)
}
