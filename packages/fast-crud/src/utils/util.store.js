export default class TableStore {
  constructor ({ $router, tableName, keyType }) {
    this.key = this.getItemKey($router, keyType)
    this.tableId = this.getTableId(tableName)
  }

  getTableId (name) {
    let storeName = 'd2CrudPlus'
    if (process.env.VUE_APP_D2P_STORE_NAME) {
      storeName = process.env.VUE_APP_D2P_STORE_NAME
    }
    const prefix = process.env.NODE_ENV + '.' + storeName
    if (name && (typeof name) === 'string') {
      return prefix + '.' + name
    }
    return prefix
  }

  getTable () {
    const saved = localStorage.getItem(this.tableId)
    if (saved == null) {
      return
    }
    return JSON.parse(saved)
  }

  saveTable (table) {
    localStorage.setItem(this.tableId, JSON.stringify(table))
  }

  clearTable () {
    localStorage.setItem(this.tableId, null)
  }

  updateTableValue (value, key) {
    let table = this.getTable()
    if (table == null) {
      table = {}
    }

    if (key == null) {
      key = this.key
    }
    table[key] = value
    this.saveTable(table)
  }

  getItemKey ($route, keyType) {
    let key = location.href
    if ($route) {
      key = $route.path
    }
    if (keyType == null || typeof keyType !== 'string') {
      return key
    }
    return key + '.' + keyType
  }

  getTableValue (key) {
    const table = this.getTable()
    if (table == null) {
      return null
    }
    if (key == null) {
      key = this.key
    }
    return table[key]
  }

  clearTableValue (key) {
    const table = this.getTable()
    if (table == null) {
      return
    }
    if (key == null) {
      key = this.key
    }
    delete table[key]
    this.saveTable(table)
  }
}
