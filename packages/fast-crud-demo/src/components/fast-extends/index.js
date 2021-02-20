import FsValuesFormat from './components/fs-values-format'

export { FsValuesFormat }

export default {
  install (app) {
    console.log('install fs extends')
    app.component('fs-values-format', FsValuesFormat)
  }
}
