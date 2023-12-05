const DEBUG_WITH_CALLER = true;
function getCallerInfo() {
  const e = new Error();
  return e.stack?.split("\n")[3];
}

const blank = (...args: any) => {};

function logInfo(...args: any) {
  // @ts-ignore
  // eslint-disable-next-line prefer-rest-params
  console["log"].apply(this, arguments);
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
  logError("%c [error]", "font-weight: 600;", ...args);
};
const warn = (...args: any) => {
  logWarn("%c [warn]", "font-weight: 600;", ...args);
};
const info = (...args: any) => {
  logInfo("%c [info]", "font-weight: 600;", ...args);
};
const debug = (...args: any) => {
  if (!console.log) {
    return;
  }
  const callerInfo = getCallerInfo();
  if (DEBUG_WITH_CALLER) {
    const log = ["%c [debug]", "font-weight: 600;", ...args];
    logInfo(...log);
    const caller = ["%c " + callerInfo, "color:#999"];
    logInfo(...caller);
  } else {
    const log = ["%c [debug]", "font-weight: 600;", ...args];
    logInfo(...log);
  }
};
const logger = {
  debug: blank,
  info: blank,
  warn: blank,
  error: blank,
  log: blank
};

export default logger;
export function setLogger(opts: any = {}) {
  const level = opts?.level || "info";
  logger.debug = blank;
  logger.info = blank;
  logger.warn = blank;
  logger.error = blank;
  logger.log = blank;
  switch (level) {
    case "debug":
      logger.debug = debug;
    case "info":
      logger.info = info;
      logger.log = info;
    case "warn":
      logger.warn = warn;
    case "error":
      logger.error = error;
      break;
  }
}
setLogger();
