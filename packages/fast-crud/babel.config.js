module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    // '@babel/plugin-proposal-optional-chaining',
    '@vue/babel-plugin-jsx',
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: false,
        corejs: false,
        helpers: true,
        regenerator: true
      }
    ]
  ]
}
