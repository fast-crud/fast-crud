import { ComputeValue, compute } from './core/compute-value'
import useCrud from './use/use-crud'
import defaultCrudOptions from './use/default-crud-options'
import * as components from './components'
import utils from './utils'
import { setDictRequest, dict } from './core/dict'
export * as components from './components'
export {
  ComputeValue,
  compute,
  dict,
  useCrud,
  utils
}
export default {
  install (app, options) {
    console.log('options', options)
    if (options?.commonOptions) {
      defaultCrudOptions.commonOptions = options.commonOptions
    }
    if (options.dictRequest) {
      setDictRequest(options.dictRequest)
    }
    for (const key in components) {
      const com = components[key]
      app.component(key, com)
    }
  }
}
