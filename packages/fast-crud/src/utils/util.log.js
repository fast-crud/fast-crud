function getCallerInfo() {
  const e = new Error();
  return e.stack.split("\n")[3];
}

const blank = () => {};

const error = (...args) => {
  console.error("[error]", ...args);
};
const warn = (...args) => {
  console.warn("[warn]", ...args);
};
const info = (...args) => {
  console.log("[info]", ...args);
};
const debug = (...args) => {
  const callerInfo = getCallerInfo();
  if (VUE_APP_FS_LOG_WITH_CALLER === "true") {
    console.log("[debug]", ...args, "\n", callerInfo);
  } else {
    console.log("[debug]", ...args);
  }
};
const logger = {};

export default logger;
export function setLogger({ level } = {}) {
  logger.debug = blank;
  logger.info = blank;
  logger.warn = blank;
  logger.error = blank;
  level = level || "info";
  switch (level) {
    case "debug":
      logger.debug = debug;
    case "info":
      logger.info = info;
    case "warn":
      logger.warn = warn;
    case "error":
      logger.error = error;
      break;
  }
}
setLogger();
