import _ from 'lodash-es'
import logger from '../utils/util.log'
let dictRequest = async () => {
  logger.warn('请在 app.use(FsCrud,{dictRequest:()=>{ 你的字典请求方法 }})')
}
let def = {
  value: 'value',
  label: 'label',
  children: 'children'
}
export class Dict {
  constructor (opts) {
    const options = _.merge(def, opts)
    const { url, getData, value, label, children } = options
    this.value = value
    this.label = label
    this.children = children
    this.data = options.data || []
    this.loaded = false
    this.url = url
    this._CustomGetDataFunc = getData
    // this.init()
  }

  async init () {
    this.toMap()
    if (this._CustomGetDataFunc) {
      return
    }
    if (this.url) {
      await this.getRemoteDictData()
    }
  }

  toMap () {
    this.map = {}
    if (this.data) {
      _.forEach(this.data, (item) => {
        this.map[item[this.value]] = item
      })
    }
  }

  async getRemoteDictData (scope) {
    let dictData
    if (this._CustomGetDataFunc) {
      dictData = await this._CustomGetDataFunc({ dict: this, ...scope })
    } else {
      dictData = await dictRequest({ dict: this })
    }
    this.loaded = true
    return dictData
  }

  getData () {
    return this.data
  }

  setData (data) {
    this.data = data
    this.toMap()
  }

  static create (opts) {
    return new Dict(opts)
  }
}

export function setDictRequest (request) {
  dictRequest = request
}

export function setDictDefaultOptions (defaultOpts) {
  def = defaultOpts
}

export function dict (opts) {
  const dictInstance = Dict.create(opts)
  return () => {
    return {
      dict: dictInstance,
      updateDict: (dictData) => {
        dictInstance.data = dictData
        dictInstance.setData(dictData)
        console.log('onupdate dict-----', dictInstance)
      }
    }
  }
}
