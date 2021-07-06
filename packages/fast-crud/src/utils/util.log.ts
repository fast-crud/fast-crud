const DEBUG_WITH_CALLER = true;
function getCallerInfo() {
  const e = new Error();
  return e.stack?.split("\n")[3];
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
  if (DEBUG_WITH_CALLER) {
    console.log("[debug]", ...args, "\n", callerInfo);
  } else {
    console.log("[debug]", ...args);
  }
};
const logger = {
  debug: blank,
  info: blank,
  warn: blank,
  error: blank
};

export default logger;
export function setLogger(opts: any = {}) {
  const level = opts?.level || "info";
  logger.debug = blank;
  logger.info = blank;
  logger.warn = blank;
  logger.error = blank;
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
