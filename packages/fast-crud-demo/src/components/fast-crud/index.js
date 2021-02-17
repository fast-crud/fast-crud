import components from './components'
import { ComputeValue, compute } from './core/compute-value'
export default {
  ...components,
  ComputeValue,
  compute,
  install (app) {
    for (const key in components) {
      const com = components[key]
      app.component(com.name, com)
    }
  }
}
