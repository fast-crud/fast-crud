const DEBUG_WITH_CALLER = true;
function getCallerInfo() {
  const e = new Error();
  return e.stack?.split("\n")[3];
}

const blank = (...args: any) => {};

function logInfo(...args: any) {
  // @ts-ignore
  // eslint-disable-next-line prefer-rest-params
  console.log.apply(this, arguments);
}
function logWarn(...args: any) {
  // @ts-ignore
  // eslint-disable-next-line prefer-rest-params
  console.warn.apply(this, arguments);
}
function logError(...args: any) {
  // @ts-ignore
  // eslint-disable-next-line prefer-rest-params
  console.error.apply(this, arguments);
}
const error = (...args: any) => {
  logError("[error]", ...args);
};
const warn = (...args: any) => {
  logWarn("[warn]", ...args);
};
const info = (...args: any) => {
  logInfo("[info]", ...args);
};
const debug = (...args: any) => {
  if (!console.log) {
    return;
  }
  const callerInfo = getCallerInfo();
  if (DEBUG_WITH_CALLER) {
    const log = ["[debug]", ...args, "\n", callerInfo];
    logInfo(...log);
  } else {
    const log = ["[debug]", ...args];
    logInfo(...log);
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
