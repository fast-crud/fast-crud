import _ from "lodash-es";
import { useMerge } from "./use-merge";
import logger from "../utils/util.log";
import { reactive, watch } from "vue";
import LRU from "lru-cache";
const DictGlobalCache = new LRU<string, any>({
  max: 500,
  maxSize: 5000,
  ttl: 1000 * 60 * 30,
  sizeCalculation: (value, key) => {
    // return an positive integer which is the size of the item,
    // if a positive integer is not returned, will use 0 as the size.
    return 1;
  }
}); //全局cache， sets just the max size

const { UnMergeable } = useMerge();

function setDictRequest(request: any) {
  dictRequest = request;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
let dictRequest = async (opts: any): Promise<any> => {
  logger.warn("请配置 app.use(FsCrud,{dictRequest:(context)=>{ 你的字典请求方法 }})");
  return [];
};

/**
 *
 * @param url
 * @param context = {dict, scope}
 * @returns {Promise<*>}
 */
class Dict extends UnMergeable {
  cache = false; // 获取到结果是否进行全局缓存
  prototype = false; // 是否原型配置
  immediate = true; //是否立即请求
  url: undefined | String | Function = undefined;
  getData: undefined | Function = undefined;
  value = "value";
  label = "label";
  children = "children";
  color = "color";
  isTree = false;
  data: null | Array<any> = null;
  originalData: undefined | Array<any> = undefined;
  dataMap: any = {};
  loading = false;
  custom = {};
  getNodesByValues: undefined | Function = undefined;
  cacheNodes = {};
  onReady: undefined | Function = undefined;
  notifies: Array<any> = []; //loadDict成功后的通知
  constructor(dict: any) {
    super();

    // 设置为不可枚举,就不会在clone的时候复制值，导致不会loadDict的bug
    Object.defineProperty(this, "loading", {
      value: false,
      enumerable: false
    });
    Object.defineProperty(this, "notifies", {
      value: false,
      enumerable: false
    });
    Object.defineProperty(this, "originalData", {
      value: null,
      enumerable: false
    });
    this.loading = false;
    _.merge(this, dict);
    if (dict.data != null) {
      this.originalData = dict.data;
      this.setData(dict.data);
    }
  }

  isDynamic() {
    return this.url instanceof Function || this.getData instanceof Function || this.prototype;
  }

  setData(data: any[]) {
    this.data = data;
    this.toMap();
  }

  /**
   * 加载字典
   * @param context 当prototype=true时会传入
   */
  async loadDict(context?: any) {
    let notify: Function | null = null;
    if (this.loading) {
      //如果正在加载中，则等待加载完成
      const ret = new Promise((resolve) => {
        notify = (data: any) => {
          resolve(data);
        };
      });
      if (!this.notifies) {
        this.notifies = [];
      }
      this.notifies.push(notify);
      return ret;
    }
    if (this.data) {
      return this.data;
    }
    let data: Array<any> = [];
    if (this.getNodesByValues) {
      if (context == null) {
        logger.warn("您配置了getNodesByValues，根据value值获取节点数据需要dict.prototype=true");
        return [];
      }

      if (context.value) {
        let cacheKey = null;
        if (this.cache && this.url) {
          cacheKey = this.url + context.value;
        }
        let cached = null;

        if (cacheKey) {
          // @ts-ignore
          cached = DictGlobalCache.get(cacheKey);
        }
        if (cached) {
          data = cached;
        } else {
          data = await this.getNodesByValues(context.value, context);
          if (cacheKey) {
            DictGlobalCache.set(cacheKey, data);
          }
        }
      }
    } else if (this.originalData) {
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
    // notify
    if (this.notifies && this.notifies.length > 0) {
      _.forEach(this.notifies, (call) => {
        call(this.data);
      });
      this.notifies.length = 0;
    }
  }

  async reloadDict(context?: any) {
    this.clear();
    return this.loadDict(context);
  }

  clear() {
    this.data = null;
    this.dataMap = {};
  }

  async getRemoteDictData(context?: any) {
    let getFromRemote;
    let cacheKey;
    let url: any;
    if (this.url) {
      url = this.url;
      if (url instanceof Function) {
        url = url({ ...context, dict: this });
      }
      cacheKey = url;
    }
    if (this.getData != null) {
      getFromRemote = async () => {
        // @ts-ignore
        return await this.getData({ url, dict: this, ...context });
      };
    } else if (url) {
      getFromRemote = async () => {
        return await dictRequest({ url, dict: this });
      };
    } else {
      return [];
    }
    if (this.cache && cacheKey) {
      let cached = DictGlobalCache.get(cacheKey);

      if (cached == null) {
        cached = {
          loaded: false,
          loading: true,
          data: undefined,
          callback: []
        };
        DictGlobalCache.set(cacheKey, cached);
      } else if (cached.loaded) {
        return cached.data;
      } else if (cached.loading) {
        return new Promise((resolve) => {
          const callback = (data: any) => {
            resolve(data);
          };
          cached.callback.push(callback);
        });
      }

      try {
        cached.loaded = false;
        cached.loading = true;
        const dictData = await getFromRemote();
        cached.data = dictData;
        cached.loaded = true;
        cached.loading = false;
        for (const callback of cached.callback) {
          callback(dictData);
        }
        cached.callback = [];
        return dictData;
      } catch (e) {
        cached.loading = false;
        cached.loaded = false;
        logger.error("load dict error:", e);
      }
    }

    return await getFromRemote();
  }

  toMap() {
    const map = {};
    if (this.data) {
      this.buildMap(map, this.data);
    }
    // if (this.getNodesByValues) {
    //   _.merge(this.dataMap, map);
    // }
    this.dataMap = map;
  }
  buildMap(map: any, list: any) {
    _.forEach(list, (item) => {
      map[this.getValue(item)] = item;
      if (this.isTree && this.getChildren(item)) {
        this.buildMap(map, this.getChildren(item));
      }
    });
  }

  getValue(item: any) {
    return item[this.value];
  }
  getLabel(item: any) {
    return item[this.label];
  }
  getChildren(item: any) {
    return item[this.children];
  }
  getColor(item: any) {
    return item[this.color];
  }
  getDictData() {
    return this.data;
  }

  getDictMap() {
    return this.dataMap;
  }

  getNodeByValue(value: any) {
    return this.dataMap[value];
  }

  getNodesFromDataMap(value: any) {
    if (value == null) {
      return [];
    }
    if (!_.isArray(value)) {
      value = [value];
    }
    //本地获取
    const nodes: Array<any> = [];
    _.forEach(value, (item) => {
      const node = this.dataMap[item];
      if (node) {
        nodes.push(node);
      } else {
        nodes.push({ [this.value]: item });
      }
    });
    return nodes;
  }
}

function dict(config: any) {
  const ret = reactive(new Dict(config));
  if (!ret.prototype && ret.immediate) {
    ret.loadDict();
  }
  watch(
    () => {
      return ret.data;
    },
    () => {
      ret.toMap();
    },
    { deep: true }
  );
  return ret;
}
export function useDictDefine() {
  return {
    dict,
    setDictRequest,
    Dict
  };
}
