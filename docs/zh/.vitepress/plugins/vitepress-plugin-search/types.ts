interface indexOption {
  /**The <a href="https://github.com/nextapps-de/flexsearch#presets"> configuration profile </a> as a shortcut or as a base for your custom settings. */
  preset?: "memory" | "performance" | "match" | "score" | "default";
  tokenize?: "strict" | "forward" | "reverse" | "full" | TokenizeFunction;
  cache?: boolean | number;
  resolution?: number;
  context?: boolean | Context;
  optimize?: boolean;
  boost?: Boost;
  language?: string;
}

interface Boost {
  (boost: string[], term: string, index: number): number;
}

interface Context {
  resolution: number;
  depth: number;
  bidirectional: true;
}

interface TokenizeFunction {
  (str: string): string[];
}
export interface Options extends indexOption {
  previewLength: number;
  buttonLabel: string;
  placeholder: string;
  allow: (string | RegExp)[];
  ignore: (string | RegExp)[];
}
