import _ from "lodash-es";
import { useMerge } from "./use-merge";
import logger from "../utils/util.log";
import { reactive } from "vue";
const { UnMergeable } = useMerge();

function setDictRequest(request) {
  dictRequest = request;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
let dictRequest = async ({ url, dict }) => {
  logger.warn(
    "请配置 app.use(FsCrud,{dictRequest:(context)=>{ 你的字典请求方法 }})"
  );
  return [];
};

/**
 *
 * @param url
 * @param context = {dict, scope}
 * @returns {Promise<*>}
 */

class Dict extends UnMergeable {
  url: undefined | String | Function = undefined;
  getData: undefined | Function = undefined;
  value = "value";
  label = "label";
  children = "children";
  color = "color";
  isTree = false;
  cache = true;
  data: undefined | Array<any> = undefined;
  originalData: undefined | Array<any> = undefined;
  dataMap = {};
  loading = false;
  custom = {};
  getNodes: undefined | Function = undefined;
  cacheNodes = {};
  onReady: undefined | Function = undefined;
  constructor(dict) {
    super();

    _.merge(this, dict);
    if (dict.data != null) {
      this.originalData = dict.data;
      this.setData(dict.data);
    }

    if (!this.isDynamic()) {
      this.loadDict();
    }
  }

  isDynamic() {
    return this.url instanceof Function || this.getData instanceof Function;
  }

  _pickItemProp(item, key) {
    if (key instanceof Function) {
      return key(item);
    }
    return _.get(item, key);
  }

  setData(data) {
    const formatData: Array<any> = [];
    data = _.cloneDeep(data);
    _.forEach(data, (item) => {
      const value = this._pickItemProp(item, this.value);
      const label = this._pickItemProp(item, this.label);
      const children = this._pickItemProp(item, this.children);
      const color = this._pickItemProp(item, this.color);

      item.value = value;
      item.label = label;
      if (children) {
        item.children = children;
      }

      if (color) {
        item.color = color;
      }
      formatData.push(item);
    });
    this.data = formatData;
    this.toMap();
  }

  async loadDict(context?) {
    if (this.data && this.cache) {
      return this.data;
    }
    let data: Array<any>;
    if (this.originalData) {
      data = this.originalData;
    } else {
      this.loading = true;
      try {
        data = await this.getRemoteDictData(context);
      } finally {
        this.loading = false;
      }
    }
    this.setData(data);
    if (this.onReady) {
      this.onReady({ dict: this, ...context });
    }
    return this.data;
  }

  async reloadDict(context?) {
    this.data = undefined;
    return this.loadDict(context);
  }

  async getRemoteDictData(context?) {
    let dictData: Array<any> = [];
    if (this.getData != null) {
      // @ts-ignore
      dictData = await this.getData({ dict: this, ...context });
    } else if (this.url) {
      let url = this.url;
      if (url instanceof Function) {
        url = url({ ...context, dict: this });
      }
      dictData = await dictRequest({ url, dict });
    }
    return dictData;
  }

  toMap() {
    const map = {};
    if (this.data) {
      _.forEach(this.data, (item) => {
        map[item.value] = item;
      });
    }
    this.dataMap = map;
  }

  getDictData() {
    return this.data;
  }

  getDictMap() {
    return this.dataMap;
  }

  getNodeByValue(value) {
    return this.dataMap[value];
  }

  getNodesByValues(value, context) {
    if (value == null) {
      return [];
    }
    if (!_.isArray(value)) {
      value = [value];
    }

    if (this.getNodes) {
      const valueKey = value.toString();
      const cached = this.cacheNodes[valueKey];
      //要远程获取
      if (cached) {
        return cached;
      }
      const nodes = this.getNodes(value, context);
      this.cacheNodes[valueKey] = cached;
      return nodes;
    }

    //本地获取
    const nodes: Array<any> = [];
    _.forEach(value, (item) => {
      const node = this.dataMap[item];
      if (node) {
        nodes.push(node);
      }
    });
    return nodes;
  }
}

function dict(config) {
  return reactive(new Dict(config));
}
export function useDictDefine() {
  return {
    dict,
    setDictRequest,
    Dict,
  };
}
