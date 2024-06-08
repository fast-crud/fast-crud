export default class TableStore {
  key: string;
  tableId: string;
  constructor(opts: { $router: any; tableName: string; keyType: string | boolean }) {
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

  async getTable() {
    const saved = localStorage.getItem(this.tableId);
    if (saved == null) {
      return;
    }
    return JSON.parse(saved);
  }

  async saveTable(table: any) {
    localStorage.setItem(this.tableId, JSON.stringify(table));
  }

  async clearTable() {
    localStorage.removeItem(this.tableId);
  }

  async updateTableValue(value: any, key = this.key) {
    let table = await this.getTable();
    if (table == null) {
      table = {};
    }
    table[key] = value;
    await this.saveTable(table);
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

  async getTableValue(key?: string) {
    const table = await this.getTable();
    if (table == null) {
      return null;
    }
    if (key == null) {
      key = this.key;
    }
    return table[key];
  }

  async clearTableValue(key?: string) {
    const table = await this.getTable();
    if (table == null) {
      return;
    }
    if (key == null) {
      key = this.key;
    }
    delete table[key];
    await this.saveTable(table);
  }
}
