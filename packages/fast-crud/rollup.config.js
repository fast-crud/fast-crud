import vue from 'rollup-plugin-vue'
import esbuild from 'rollup-plugin-esbuild'
import css from 'rollup-plugin-css-only'
import postcss from 'rollup-plugin-postcss' // v4.0.0
import typescript from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel'
export default {
  input: 'src/index.js',
  output: {
    format: 'esm',
    file: 'dist/fast-crud.esm.js'
  },
  exclude: ['node_modules/**'],
  external: ['vue', 'core-js', '@babel/runtim=[]'],
  plugins: [
    // esbuild({ // 对所有的js及ts进行编译，编译为ie支持的js(目标为es6)
    //   include: /\.[jt]s$/,
    //   minify: process.env.NODE_ENV === 'production',
    //   target: 'es2020'
    // }),
    // css(),
    typescript({
      tsconfig: false,
      // experimentalDecorators: true,
      module: 'es2020'
    }),
    vue({
      css: false,
      preprocessStyles: true
    }),
    // https://github.com/rollup/plugins/tree/master/packages/babel
    // https://www.babeljs.cn/docs/babel-plugin-transform-runtime
    babel({ babelHelpers: 'runtime' }),
    postcss()
  ]
}
