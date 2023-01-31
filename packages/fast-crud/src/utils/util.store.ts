export default class TableStore {
  key: string;
  tableId: string;
  constructor(opts: { $router: any; tableName: string; keyType: string }) {
    const { $router, tableName, keyType } = opts;
    this.key = this.getItemKey($router, keyType);
    this.tableId = this.getTableId(tableName);
  }

  getTableId(name: string) {
    const prefix = "fs-crud";
    if (name && typeof name === "string") {
      return prefix + "." + name;
    }
    return prefix;
  }

  getTable() {
    const saved = localStorage.getItem(this.tableId);
    if (saved == null) {
      return;
    }
    return JSON.parse(saved);
  }

  saveTable(table: any) {
    localStorage.setItem(this.tableId, JSON.stringify(table));
  }

  clearTable() {
    localStorage.removeItem(this.tableId);
  }

  updateTableValue(value: any, key = this.key) {
    let table = this.getTable();
    if (table == null) {
      table = {};
    }
    table[key] = value;
    this.saveTable(table);
  }

  getItemKey($route: any, keyType: any) {
    let key = location.href;
    if ($route) {
      key = $route.path;
    }
    if (keyType == null || typeof keyType !== "string") {
      return key;
    }
    return key + "." + keyType;
  }

  getTableValue(key?: string) {
    const table = this.getTable();
    if (table == null) {
      return null;
    }
    if (key == null) {
      key = this.key;
    }
    return table[key];
  }

  clearTableValue(key?: string) {
    const table = this.getTable();
    if (table == null) {
      return;
    }
    if (key == null) {
      key = this.key;
    }
    delete table[key];
    this.saveTable(table);
  }
}
