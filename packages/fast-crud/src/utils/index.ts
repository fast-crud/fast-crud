import logger from "./util.log";
import strings from "./util.string";
import { trace } from "./util.trace";
import vite from "./util.vite";
import store from "./util.store";
import { deepdash } from "./deepdash";
import dash from "./util.dash";
export * from "./util.log";

export const utils = {
  logger,
  strings,
  trace: trace,
  vite,
  store,
  deepdash,
  dash
};

export default utils;
