const rxArrIndex = /\D/;
const rxVarName = /^[a-zA-Z_$]+([\w_$]*)$/;
const rxQuot = /"/g;

function joinPaths(...paths: any) {
  return paths.reduce((acc: any, p: any) => (acc ? (!p || p.startsWith("[") ? `${acc}${p}` : `${acc}.${p}`) : p), "");
}

export default function getPathToString(_: any) {
  function pathToString(path: any, ...prefixes: any) {
    prefixes = prefixes.filter((p: any) => p !== undefined);
    if (_.isString(path)) return joinPaths(...prefixes, path);
    if (!Array.isArray(path)) return undefined;
    prefixes = joinPaths(...prefixes);
    return path.reduce((acc, value) => {
      const type = typeof value;
      if (type === "number") {
        if (value < 0 || value % 1 !== 0) {
          return `${acc}["${value}"]`;
        } else {
          return `${acc}[${value}]`;
        }
      } else if (type !== "string") {
        return `${acc}["${value}"]`;
      } else if (!value) {
        return `${acc}[""]`;
      }
      if (!rxArrIndex.test(value)) {
        return `${acc}[${value}]`;
      }
      if (rxVarName.test(value)) {
        if (acc) {
          return `${acc}.${value}`;
        } else {
          return `${acc}${value}`;
        }
      }
      return `${acc}["${value.replace(rxQuot, '\\"')}"]`;
    }, prefixes);
  }
  return pathToString;
}

getPathToString.notChainable = true;
