import { FsRemoteStorage } from "../d";

export default class TableStore {
  remoteStorage?: FsRemoteStorage;
  $router: any;
  tableName: string;
  keyType: string | boolean;
  id?: string;
  constructor(opts: {
    $router: any;
    tableName: string;
    keyType: string | boolean;
    remoteStorage: FsRemoteStorage;
    id?: string;
  }) {
    this.remoteStorage = opts.remoteStorage;
    this.$router = opts.$router;
    this.tableName = opts.tableName;
    this.keyType = opts.keyType;
    this.id = opts.id;
  }

  getTableId() {
    const tableName = this.tableName;

    let prefix = "fs-crud";
    if (this.id) {
      prefix = prefix + "." + this.id;
    }

    if (tableName && typeof tableName === "string") {
      return prefix + "." + tableName;
    }
    return prefix;
  }

  async getTable() {
    const tableId = this.getTableId();
    const saved = localStorage.getItem(tableId);
    if (saved == null) {
      return;
    }
    return JSON.parse(saved);
  }

  async saveTable(table: any) {
    const tableId = this.getTableId();
    localStorage.setItem(tableId, JSON.stringify(table));
  }

  async clearTable() {
    const tableId = this.getTableId();
    localStorage.removeItem(tableId);
  }

  async updateTableValue(value: any, key?: string) {
    if (key == null) {
      key = this.getItemKey();
    }
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

  getItemKey() {
    const $route = this.$router;
    const keyType = this.keyType;
    let key = location.href;
    if ($route) {
      key = $route.path;
    }
    if (this.id) {
      key = key + "." + this.id;
    }
    if (keyType == null || typeof keyType !== "string" || !keyType) {
      return key;
    }
    return key + "." + keyType;
  }

  async getTableValue(key?: string) {
    if (key == null) {
      key = this.getItemKey();
    }
    if (this.remoteStorage) {
      return await this.remoteStorage.get(key);
    }
    const table = await this.getTable();
    if (table == null) {
      return null;
    }
    return table[key];
  }

  async clearTableValue(key?: string) {
    if (key == null) {
      key = this.getItemKey();
    }
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
