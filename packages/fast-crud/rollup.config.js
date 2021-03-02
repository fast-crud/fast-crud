import vue from 'rollup-plugin-vue'
// import esbuild from 'rollup-plugin-esbuild'
// import css from 'rollup-plugin-css-only'
import postcss from 'rollup-plugin-postcss' // v4.0.0
import typescript from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
// import resolve from '@rollup/plugin-node-resolve'

export default {
  input: 'src/index.js',
  output: [{
    format: 'cjs',
    file: 'dist/bundle.cjs.js'
  }, {
    format: 'esm',
    file: 'dist/bundle.esm.js'
  }, {
    file: 'dist/bundle.esm.min.js',
    format: 'esm',
    plugins: [terser()],
    sourcemap: true
  }],
  external: ['vue', 'lodash-es', 'core-js', '@babel/runtime', 'dayjs', 'vue-i18n'],
  plugins: [
    // esbuild({ // 对所有的js及ts进行编译，编译为ie支持的js(目标为es6)
    //   include: /\.[jt]s$/,
    //   minify: process.env.NODE_ENV === 'production',
    //   target: 'es2020'
    // }),
    // css(),
    typescript({
      tsconfig: false,
      experimentalDecorators: true,
      target: 'ES5',
      module: 'ES2020',
      allowSyntheticDefaultImports: true
    }),
    vue({
      css: false,
      preprocessStyles: true
    }),
    commonjs({
      include: 'node_modules/**'
    }),
    // https://github.com/rollup/plugins/tree/master/packages/babel
    // https://www.babeljs.cn/docs/babel-plugin-transform-runtime
    babel({
      babelHelpers: 'runtime'
    }),
    postcss()
  ]
}
