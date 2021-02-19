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
    this.options = _.merge(def, opts)
    this.data = this.options.data || []
    this.loading = false
  }

  async getDictData (scope) {
    if (this.loading === true) {
      return
    }
    this.loading = true
    try {
      const dictData = await dictRequest({ ...this.options, ...scope })
      if (dictData) {
        this.data = dictData
      }
    } finally {
      this.loading = false
    }
  }

  setData (data) {
    this.data = data
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
  return Dict.create(opts)
}
