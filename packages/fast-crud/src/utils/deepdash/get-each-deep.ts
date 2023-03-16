import getIterate from "./private/getIterate.js";
import _ from "lodash-es";
export function getEachDeep(_: any): ForEachDeep {
  const iterate = getIterate(_);

  function eachDeep(obj: any, callback: any, options: any) {
    if (callback === undefined) callback = _.identity;
    options = _.merge(
      {
        includeRoot: !Array.isArray(obj),
        pathFormat: "string",
        checkCircular: false,
        leavesOnly: false,
        ownPropertiesOnly: true //
      },
      options || {}
    );
    if (options.childrenPath !== undefined) {
      if (!options.includeRoot && options.rootIsChildren === undefined) {
        options.rootIsChildren = Array.isArray(obj);
      }
      if (!_.isString(options.childrenPath) && !Array.isArray(options.childrenPath)) {
        throw Error("childrenPath can be string or array");
      } else {
        if (_.isString(options.childrenPath)) {
          options.childrenPath = [options.childrenPath];
        }
        options.strChildrenPath = options.childrenPath;
        options.childrenPath = [];
        for (let i = options.strChildrenPath.length - 1; i >= 0; i--) {
          options.childrenPath[i] = _.toPath(options.strChildrenPath[i]);
        }
      }
    }
    iterate({
      value: obj,
      callback,
      options,
      obj
    });
    return obj;
  }
  return eachDeep;
}

export type ForEachDeep = (obj: any, callback: any, options: any) => any;
export const forEachDeep: ForEachDeep = getEachDeep(_);
