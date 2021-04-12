import { forEach, merge, cloneDeep } from "lodash-es";
import logger from "../utils/util.log";
let dictRequest = async () => {
  logger.warn("请配置 app.use(FsCrud,{dictRequest:()=>{ 你的字典请求方法 }})");
};
let def = {
  value: "value",
  label: "label",
  children: "children",
  color: "color",
  cache: true
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

/**
 *
 * @param url
 * @param context = {dict, scope}
 * @returns {Promise<*>}
 */
async function getRemoteDictData(url, context) {
  let dictData;
  const dict = context.dict;
  if (dict.getData) {
    dictData = await dict.getData({ url, ...context });
  } else if (url) {
    dictData = await dictRequest({ url, ...context });
  } else {
    return;
  }
  return dictData;
}

export async function getDictData(context) {
  const dict = context.dict;
  if (dict == null) {
    logger.warn("dict 不能为空");
    return;
  }
  if (dict.value == null) {
    logger.warn("dict.value不能为空,dict必须通过dict({})方式进行配置");
  }

  function ready(ret) {
    if (dict.clone) {
      const data = cloneDeep(ret.data);
      ret = {
        data,
        dataMap: toMap(dict, data)
      };
    }
    if (dict.onReady) {
      dict.onReady({ ...ret, ...context });
    }
    return ret;
  }

  if (dict.data) {
    return ready({
      data: dict.data,
      dataMap: dict.dataMap
    });
  }

  let dictUrl = dict.url;
  if (dict.url instanceof Function) {
    dictUrl = dict.url(context);
  }
  const cacheEnabled = dictUrl && dict.cache;
  if (dictUrl == null && cacheEnabled) {
    logger.warn("开启缓存时，dict.url必须配置，如果你是自定义getData，也要配置任意字符串作为缓存key");
  }
  let cached = null;
  if (cacheEnabled) {
    cached = cache.get(dictUrl);
    if (cached) {
      if (cached.loaded) {
        return ready({
          data: cached.data,
          dataMap: cached.dataMap
        });
      } else {
        // 还在load
        return new Promise((resolve) => {
          cached.callbacks.push((ret) => {
            ready(ret);
            resolve(ret);
          });
        });
      }
    } else {
      //没有缓存过
      cached = { loaded: false, callbacks: [] };
      cache.set(dictUrl, cached);
    }
  }

  const dictData = await getRemoteDictData(dictUrl, context);
  const ret = {
    data: dictData,
    dataMap: toMap(dict, dictData)
  };

  if (cached) {
    cached.loaded = true;
    cached.data = ret.data;
    cached.dataMap = ret.dataMap;
    forEach(cached.callbacks, (cb) => {
      cb(ret);
    });
  }

  return ready(ret);
}

export function setDictRequest(request) {
  dictRequest = request;
}

export function setDictDefaultOptions(defaultOpts) {
  def = defaultOpts;
}

export const defaultDict = def;
