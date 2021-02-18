import components from './components'
import { ComputeValue, compute } from './core/compute-value'
import useCrud from './use/use-crud'
export default {
  ...components,
  ComputeValue,
  compute,
  useCrud,
  install (app) {
    for (const key in components) {
      const com = components[key]
      app.component(com.name, com)
    }
  }
}
