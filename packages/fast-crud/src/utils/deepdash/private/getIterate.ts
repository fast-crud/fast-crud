import getPathToString from "./getPathToString.js";
const rxVarName = /^[a-zA-Z_$]+([\w_$]*)$/;
const rxQuot = /"/g;
const has = Object.prototype.hasOwnProperty;

export function isObject(value: any) {
  const type = typeof value;
  return value != null && (type == "object" || type == "function");
}

export default function getIterate(_: any) {
  const pathToString = getPathToString(_);

  function iterate(item: any) {
    const { options, obj, callback } = item;
    options.pathFormatArray = options.pathFormat == "array";
    item.depth = 0;

    let broken = false;
    const breakIt = () => {
      broken = true;
      return false;
    };

    while (item) {
      if (broken) break;
      if (!item.inited) {
        item.inited = true;
        item.info = describeValue(item.value, options.ownPropertiesOnly);

        if (options.checkCircular) {
          item.circularParentIndex = -1;
          item.circularParent = null;
          item.isCircular = false;
          if (item.info.isObject && !item.info.isEmpty) {
            let parent = item.parent;
            while (parent) {
              if (parent.value === item.value) {
                item.isCircular = true;
                item.circularParent = parent;
                item.circularParentIndex = item.depth - parent.depth - 1;
                break;
              }
              parent = parent.parent;
            }
          }
        }

        item.children = [];
        if (options.childrenPath) {
          options.childrenPath.forEach((cp: any, i: any) => {
            const children = _.get(item.value, cp);
            const info: any = describeValue(children, options.ownPropertiesOnly);
            if (!info.isEmpty) {
              item.children.push([cp, options.strChildrenPath[i], children, info]);
            }
          });
        }

        item.isLeaf =
          item.isCircular ||
          (options.childrenPath !== undefined && !item.children.length) ||
          !item.info.isObject ||
          item.info.isEmpty;

        item.needCallback = (item.depth || options.includeRoot) && (!options.leavesOnly || item.isLeaf);

        if (item.needCallback) {
          const contextReader = new ContextReader(obj, options, breakIt);
          contextReader.setItem(item, false);
          try {
            item.res = callback(item.value, item.key, item.parent && item.parent.value, contextReader);
          } catch (err: any) {
            if (err.message) {
              err.message += "\ncallback failed before deep iterate at:\n" + pathToString(item.path);
            }

            throw err;
          }
        }

        if (broken) {
          break;
        }

        if (item.res !== false) {
          if (!broken && !item.isCircular && item.info.isObject) {
            if (options.childrenPath !== undefined && (item.depth || !options.rootIsChildren)) {
              item.childrenItems = [];
              if (item.children.length) {
                item.children.forEach(([cp, scp, children, info]: any) => {
                  item.childrenItems = [
                    ...item.childrenItems,
                    ...(info.isArray
                      ? getElements(item, children, options, cp, scp)
                      : getOwnChildren(item, children, options, cp, scp))
                  ];
                });
              }
            } else {
              item.childrenItems = item.info.isArray
                ? getElements(item, item.value, options, [], "")
                : getOwnChildren(item, item.value, options, [], "");
            }
          }
        }

        item.currentChildIndex = -1;
      }
      if (item.childrenItems && item.currentChildIndex < item.childrenItems.length - 1) {
        item.currentChildIndex++;
        item.childrenItems[item.currentChildIndex].parentItem = item;
        item = item.childrenItems[item.currentChildIndex];
        continue;
      }

      if (item.needCallback && options.callbackAfterIterate) {
        const contextReader = new ContextReader(obj, options, breakIt);
        contextReader.setItem(item, true);

        try {
          callback(item.value, item.key, item.parent && item.parent.value, contextReader);
        } catch (err: any) {
          if (err.message) {
            err.message += "\ncallback failed after deep iterate at:\n" + pathToString(item.path);
          }

          throw err;
        }
      }
      item = item.parentItem;
    }
  }

  return iterate;

  function getElements(item: any, children: any, options: any, childrenPath: any, strChildrenPath: any) {
    let strChildPathPrefix;
    if (!options.pathFormatArray) {
      strChildPathPrefix = item.strPath || "";

      if (strChildrenPath && strChildPathPrefix && !strChildrenPath.startsWith("[")) {
        strChildPathPrefix += ".";
      }
      strChildPathPrefix += strChildrenPath || "";
    }
    const res = [];
    for (let i = 0; i < children.length; i++) {
      const val = children[i];
      if (val === undefined && !(i in children)) {
        continue;
      }
      let strChildPath;
      const pathFormatString = !options.pathFormatArray;
      if (pathFormatString) {
        strChildPath = `${strChildPathPrefix}[${i}]`;
      }
      res.push({
        value: val,
        key: i + "",
        path: [...(item.path || []), ...childrenPath, i + ""],
        strPath: strChildPath,
        depth: item.depth + 1,
        parent: {
          value: item.value,
          key: item.key,
          path: pathFormatString ? item.strPath : item.path,
          parent: item.parent,
          depth: item.depth,
          info: item.info
        },
        childrenPath: (childrenPath.length && childrenPath) || undefined,
        strChildrenPath: strChildrenPath || undefined
      });
    }
    return res;
  }

  function getOwnChildren(item: any, children: any, options: any, childrenPath: any, strChildrenPath: any) {
    let strChildPathPrefix;
    if (!options.pathFormatArray) {
      strChildPathPrefix = item.strPath || "";

      if (strChildrenPath && strChildPathPrefix && !strChildrenPath.startsWith("[")) {
        strChildPathPrefix += ".";
      }
      strChildPathPrefix += strChildrenPath || "";
    }
    const res = [];
    const pathFormatString = !options.pathFormatArray;
    for (const childKey in children) {
      if (options.ownPropertiesOnly && !has.call(children, childKey)) {
        continue;
      }

      let strChildPath;
      if (pathFormatString) {
        if (rxVarName.test(childKey)) {
          if (strChildPathPrefix) {
            strChildPath = `${strChildPathPrefix}.${childKey}`;
          } else {
            strChildPath = `${childKey}`;
          }
        } else {
          strChildPath = `${strChildPathPrefix}["${childKey.replace(rxQuot, '\\"')}"]`;
        }
      }

      res.push({
        value: children[childKey],
        key: childKey,
        path: [...(item.path || []), ...childrenPath, childKey],
        strPath: strChildPath,
        depth: item.depth + 1,
        parent: {
          value: item.value,
          key: item.key,
          path: pathFormatString ? item.strPath : item.path,
          parent: item.parent,
          depth: item.depth,
          info: item.info
        },
        childrenPath: (childrenPath.length && childrenPath) || undefined,
        strChildrenPath: strChildrenPath || undefined
      });
    }

    return res;
  }
}

class ContextReader {
  private _item: any;
  private obj: any;
  private _options: any;
  private afterIterate: any;
  constructor(obj: any, options: any, breakIt: any) {
    this.obj = obj;
    this._options = options;
    // @ts-ignore
    this["break"] = breakIt;
  }
  setItem(item: any, afterIterate: any) {
    this._item = item;
    this.afterIterate = afterIterate;
  }
  get path() {
    return this._options.pathFormatArray ? this._item.path : this._item.strPath;
  }

  get parent() {
    return this._item.parent;
  }

  get parents() {
    if (!this._item._parents) {
      this._item._parents = [];
      let curParent = this._item.parent;
      while (curParent) {
        this._item._parents[curParent.depth] = curParent;
        curParent = curParent.parent;
      }
    }
    return this._item._parents;
  }
  get depth() {
    return this._item.depth;
  }

  get isLeaf() {
    return this._item.isLeaf;
  }

  get isCircular() {
    return this._item.isCircular;
  }

  get circularParentIndex() {
    return this._item.circularParentIndex;
  }

  get circularParent() {
    return this._item.circularParent;
  }

  get childrenPath() {
    return (
      (this._options.childrenPath !== undefined &&
        (this._options.pathFormatArray ? this._item.childrenPath : this._item.strChildrenPath)) ||
      undefined
    );
  }

  get info() {
    return this._item.info;
  }
}

function isObjectEmpty(value: any, ownPropertiesOnly: any) {
  for (const key in value) {
    if (!ownPropertiesOnly || has.call(value, key)) {
      return false;
    }
  }
  return true;
}

function describeValue(value: any, ownPropertiesOnly: any) {
  const res: any = { isObject: isObject(value) };
  res.isArray = res.isObject && Array.isArray(value);
  res.isEmpty = res.isArray ? !value.length : res.isObject ? isObjectEmpty(value, ownPropertiesOnly) : true;

  return res;
}
