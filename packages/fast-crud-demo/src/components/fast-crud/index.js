import { ComputeValue, compute } from './core/compute-value'
import useCrud from './use/use-crud'
import defaultCrudOptions from './use/default-crud-options'
import _ from 'lodash-es'
import * as components from './components'
export * as components from './components'
export {
  ComputeValue,
  compute,
  useCrud
}
export default {
  install (app, options) {
    _.merge(defaultCrudOptions, options)
    for (const key in components) {
      const com = components[key]
      app.component(com.name, com)
    }
  }
}
