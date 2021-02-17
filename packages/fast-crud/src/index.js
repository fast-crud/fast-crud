import FsCrud from './fs-crud'
import components from './components'

export default {
  FsCrud,
  ...components,
  install (app) {
    app.component(FsCrud.name, FsCrud)

    for (const key in components) {
      const com = components[key]
      console.log('com', com)
      app.component(com.name, com)
    }
  }
}
