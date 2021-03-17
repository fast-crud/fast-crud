import _ from "lodash-es";
import { useMerge } from "./use-merge";
import logger from "../utils/util.log";
import { reactive } from "vue";
const { merge, NotMerge } = useMerge();

function setDictRequest(request) {
  dictRequest = request;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
let dictRequest = async (dict) => {
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

class Dict extends NotMerge {
  url: undefined | String | Function = undefined;
  getData: undefined | Function = undefined;
  value = "value";
  label = "label";
  children = "children";
  color = "color";
  isTree = false;
  cache = true;
  data = [];
  dataMap = {};
  loaded = false;
  custom = {};
  getNodes: undefined | Function = undefined;
  cacheNodes = {};
  constructor(dict) {
    super();
    merge(this, dict);
    if (!this.isDynamic()) {
      this.loadDict();
    }
  }

  isDynamic() {
    return this.url instanceof Function || this.getData instanceof Function;
  }

  setData(data) {
    this.data = data;
    this.toMap();
  }

  async loadDict(context?) {
    if (this.loaded) {
      return;
    }
    const data = await this.getRemoteDictData(context);
    this.setData(data);
    return this.data;
  }

  async reloadDict(context?) {
    this.loaded = false;
    return this.loadDict(context);
  }

  async getRemoteDictData(context?) {
    const url = this.url;
    let dictData: Array<any> = [];
    if (this.getData != null) {
      // @ts-ignore
      dictData = await this.getData(this, context);
    } else if (url) {
      dictData = await dictRequest(this);
    }
    return dictData;
  }

  toMap() {
    const map = {};
    if (this.data) {
      _.forEach(this.data, (item) => {
        map[item[this.value]] = item;
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

  getNodesByValue(value, context) {
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
