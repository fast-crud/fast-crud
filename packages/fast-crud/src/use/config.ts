export type LoggerConfig = {
  off?: {
    tableColumns?: boolean;
  };
};
export type GlobalConfig = {
  logger?: LoggerConfig;
};
export const GlobalConfig: GlobalConfig = {
  logger: {
    off: {
      tableColumns: false
    }
  }
};
