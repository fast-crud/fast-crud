var rxArrIndex = /\D/;
var rxVarName = /^[a-zA-Z_$]+([\w_$]*)$/;
var rxQuot = /"/g;

function joinPaths(...paths) {
  return paths.reduce((acc, p) => (acc ? (!p || p.startsWith("[") ? `${acc}${p}` : `${acc}.${p}`) : p), "");
}

export default function getPathToString(_) {
  function pathToString(path, ...prefixes) {
    prefixes = prefixes.filter((p) => p !== undefined);
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
