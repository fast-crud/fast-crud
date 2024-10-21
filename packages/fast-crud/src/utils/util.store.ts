import { FsRemoteStorage } from "../d";

export default class TableStore {
  key: string;
  tableId: string;
  remoteStorage?: FsRemoteStorage;
  constructor(opts: { $router: any; tableName: string; keyType: string | boolean; remoteStorage: FsRemoteStorage }) {
    const { $router, tableName, keyType } = opts;
    this.key = this.getItemKey($router, keyType);
    this.tableId = this.getTableId(tableName);
    this.remoteStorage = opts.remoteStorage;
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
    if (this.remoteStorage) {
      await this.remoteStorage.set(key, value);
      return;
    }

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
    if (keyType == null || typeof keyType !== "string" || !keyType) {
      return key;
    }
    return key + "." + keyType;
  }

  async getTableValue(key: string = this.key) {
    if (this.remoteStorage) {
      return await this.remoteStorage.get(key);
    }
    const table = await this.getTable();
    if (table == null) {
      return null;
    }
    return table[key];
  }

  async clearTableValue(key: string = this.key) {
    if (this.remoteStorage) {
      await this.remoteStorage.remove(key);
      return;
    }
    const table = await this.getTable();
    if (table == null) {
      return;
    }
    delete table[key];
    await this.saveTable(table);
  }
}
