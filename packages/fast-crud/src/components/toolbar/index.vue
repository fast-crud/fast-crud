<template>
  <div class="fs-toolbar" >
    <slot name="toolbar-prefix"/>
    <template v-for="(item,key) of _buttons" :key="key">
      <fs-button v-if="item?.show!==false" v-bind="item" @click="doClick(item)"/>
    </template>
    <slot name="toolbar-append"/>
    <fs-table-columns-filter v-if="columns" ref="columnsFilterRef"
                             :columns="columns"
                             @update:columns="$emit('update:columns',$event)"
                             :storage="storage"/>

  </div>
</template>

<script>
import FsTableColumnsFilter from './fs-table-columns-filter/component'
import FsButton from '../basic/fs-button'
import _ from 'lodash-es'
import { ref } from 'vue'
import traceUtil from '../../utils/util.trace'
export default {
  name: 'fs-toolbar',
  components: { FsTableColumnsFilter, FsButton },
  emits: ['refresh', 'update:search', 'update:compact', 'update:columns'],
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
      type: Object,
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
  setup () {
    const columnsFilterRef = ref()
    traceUtil.trace()
    return {
      columnsFilterRef
    }
  },
  computed: {
    _buttons () {
      const defaultButtons = {
        refresh: {
          type: 'primary',
          icon: 'el-icon-refresh',
          title: '刷新',
          circle: true,
          click: () => {
            this.doRefresh()
          }
        },
        search: {
          type: 'primary',
          icon: 'el-icon-search',
          title: '查询显示',
          circle: true,
          click: () => {
            this.doSearch()
          }
        },
        compact: {
          type: 'primary',
          icon: 'el-icon-rank',
          title: '紧凑模式',
          circle: true,
          click: () => {
            this.doCompact()
          }
        },
        export: {
          type: 'primary',
          icon: 'el-icon-upload2',
          title: '导出',
          circle: true,
          click: () => {
            this.doExport()
          }
        },
        columns: {
          type: 'success',
          icon: 'el-icon-set-up',
          title: '列设置',
          circle: true,
          click: () => {
            this.doColumnsFilter()
          }
        }
      }

      _.merge(defaultButtons, this.buttons)
      if (defaultButtons.search) {
        defaultButtons.search.type = this.search ? 'primary' : 'default'
      }
      if (defaultButtons.compact) {
        defaultButtons.compact.type = this.compact ? 'primary' : 'default'
      }
      return defaultButtons
    }
  },
  methods: {
    doClick (item) {
      item.click()
    },
    doRefresh () {
      this.$emit('refresh')
    },
    doSearch () {
      this.$emit('update:search', !this.search)
    },
    doCompact () {
      this.$emit('update:compact', !this.compact)
    },
    doColumnsFilter () {
      this.columnsFilterRef.start()
    },
    doExport () {
      this.$emit('export')
    }
  }
}
</script>
