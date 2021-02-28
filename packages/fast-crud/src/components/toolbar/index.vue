<template>
  <div class="fs-toolbar" >
    <slot name="toolbar-prefix"/>
    <template v-for="(item,key) of computedButtons" :key="key">
      <fs-button v-if="item.show!==false" v-bind="item" @click="item.click()"/>
    </template>
    <slot name="toolbar-append"/>
    <fs-table-columns-filter v-if="columns" ref="columnsFilterRef"
                             :columns="columns"
                             @update:columns="$emit('update:columns',$event)"
                             :storage="storage"/>

  </div>
</template>

<script>
import FsTableColumnsFilter from './fs-table-columns-filter/component.vue'
import FsButton from '../basic/fs-button'
import _ from 'lodash-es'
import { ref, computed, getCurrentInstance } from 'vue'
import traceUtil from '../../utils/util.trace'
import { useI18n } from '../../local'
export default {
  name: 'fs-toolbar',
  // eslint-disable-next-line vue/no-unused-components
  components: { FsTableColumnsFilter, FsButton },
  emits: ['refresh', 'update:search', 'update:compact', 'update:columns', 'export'],
  props: {
    buttons: {
      type: Object
    },
    /**
     * 是否显示查询
     * 传null，则不显示按钮
     */
    search: {
      type: Boolean
    },
    /**
     * 紧凑模式按钮
     * 传null，则不显示按钮
     */
    compact: {
      type: Boolean,
      default: true
    },
    /**
     * 列配置
     */
    columns: {
      type: Array,
      default: undefined
    },
    /**
     * 是否保存用户列设置
     * 传string则表示传入缓存的主key
     */
    storage: {
      type: [String, Boolean],
      default: true
    }
  },
  setup (props, ctx) {
    const { t } = useI18n()
    const columnsFilterRef = ref()
    traceUtil.trace('fs-toolbar')
    const { proxy } = getCurrentInstance()
    console.log('fsui', proxy.$fsui)
    const computedButtons = computed(() => {
      const defaultButtons = {
        refresh: {
          type: 'primary',
          icon: proxy.$fsui.icons.refresh,
          title: t('fs.toolbar.refresh.text'), // '刷新',
          circle: true,
          click: () => {
            ctx.emit('refresh')
          }
        },
        search: {
          type: 'primary',
          icon: proxy.$fsui.icons.search,
          title: t('fs.toolbar.search.title'), // '查询显示',
          circle: true,
          click: () => {
            ctx.emit('update:search', !props.search)
          }
        },
        compact: {
          type: 'primary',
          icon: proxy.$fsui.icons.compact,
          title: t('fs.toolbar.compact.title'), // '紧凑模式',
          circle: true,
          click: () => {
            ctx.emit('update:compact', !props.compact)
          }
        },
        export: {
          type: 'primary',
          icon: proxy.$fsui.icons.export,
          title: t('fs.toolbar.export.title'), // '导出',
          circle: true,
          click: () => {
            ctx.emit('export')
          }
        },
        columns: {
          type: 'primary',
          icon: proxy.$fsui.icons.columnsFilter,
          title: t('fs.toolbar.columns.title'), // '列设置',
          circle: true,
          click: () => {
            columnsFilterRef.value.start()
          }
        }
      }

      _.merge(defaultButtons, props.buttons)
      if (defaultButtons.search) {
        defaultButtons.search.type = props.search ? 'primary' : 'default'
      }
      if (defaultButtons.compact) {
        defaultButtons.compact.type = props.compact ? 'primary' : 'default'
      }
      return defaultButtons
    })
    return {
      columnsFilterRef,
      computedButtons
    }
  }
}
</script>
<style lang="less">
.fs-toolbar{
  display: flex;
  .fs-button{
    margin-left:5px;
  }
}
</style>
