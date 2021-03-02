import vue from '@vitejs/plugin-vue'
import path from 'path'
// https://vitejs.dev/config/
export default {
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'fast-crud'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', 'lodash-es', 'dayjs', 'vue-i18n', 'vuedraggable'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
          'lodash-es': '_',
          dayjs: 'dayjs',
          'vue-i18n': 'VueI18n',
          vuedraggable: 'vuedraggable'
        }
      }
    }
  }
}
