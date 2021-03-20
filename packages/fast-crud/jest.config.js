module.exports = {
  transformIgnorePatterns: ["!node_modules/lodash-es"],
  moduleFileExtensions: ["js", "ts", "json", "vue"],
  transform: {
    "^.+\\.tsx?$": [
      "esbuild-jest",
      {
        sourcemap: true,
        loaders: {
          ".spec.ts": "tsx",
        },
      },
    ],
    "^.+\\.js?$": [
      "esbuild-jest",
      {
        sourcemap: true,
      },
    ],
    "^.+\\.ts$": "ts-jest",
    "^.+\\.vue$": "vue-jest",
  },
};
