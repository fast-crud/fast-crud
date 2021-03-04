import { forEach, merge } from "lodash-es";
import logger from "../utils/util.log";
let dictRequest = async () => {
  logger.warn("请配置 app.use(FsCrud,{dictRequest:()=>{ 你的字典请求方法 }})");
};
let def = {
  value: "value",
  label: "label",
  children: "children",
  color: "color",
  cache: true,
};
const cache = new Map();

function toMap(dictOpts, data) {
  const map = {};
  if (data) {
    forEach(data, (item) => {
      map[item[dictOpts.value]] = item;
    });
  }
  return map;
}
export function dict(opts) {
  const dictOpts = merge({}, def, opts);

  if (dictOpts.data) {
    dictOpts.dataMap = toMap(dictOpts, dictOpts.data);
  }

  return dictOpts;
}

async function getRemoteDictData(dict, scope) {
  let dictData;
  if (dict.getData) {
    dictData = await dict.getData({ dict, ...scope });
  } else if (dict.url) {
    dictData = await dictRequest({ dict, ...scope });
  } else {
    return;
  }
  return dictData;
}

export async function getDictData(dict, scope) {
  if (dict.data) {
    return {
      data: dict.data,
      dataMap: dict.dataMap,
    };
  }

  const cacheEnabled = dict.url && dict.cache;
  let cached = null;
  if (cacheEnabled) {
    cached = cache.get(dict.url);
    if (cached) {
      if (cached.loaded) {
        return {
          data: cached.data,
          dataMap: cached.dataMap,
        };
      } else {
        // 还在load
        return new Promise((resolve) => {
          cached.callbacks.push((ret) => {
            resolve(ret);
          });
        });
      }
    } else {
      cached = { loaded: false, callbacks: [] };
      cache.set(dict.url, cached);
    }
  }

  const dictData = await getRemoteDictData(dict, scope);

  const ret = {
    data: dictData,
    dataMap: toMap(dict, dictData),
  };

  if (cached) {
    cached.loaded = true;
    cached.data = ret.data;
    cached.dataMap = ret.dataMap;
    forEach(cached.callbacks, (cb) => {
      cb(ret);
    });
  }

  return ret;
}

export function setDictRequest(request) {
  dictRequest = request;
}

export function setDictDefaultOptions(defaultOpts) {
  def = defaultOpts;
}
