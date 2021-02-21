<template>
  <div class="fs-toolbar" >
    <slot name="toolbar-prefix"/>
    <template v-for="(item,key) of _buttons" :key="key">
      <fs-button v-if="item?.show!==false" v-bind="item" @click="doClick(item.click)"/>
    </template>
    <slot name="toolbar-append"/>
    <fs-table-columns-filter v-if="columns!=null" ref="columnsSetup"
                             v-model="columnsFilter.value"
                             :options="columnsFilter.options"
                             :storage="storage"
                             @change="handleColumnsFilterChanged"/>

  </div>
</template>

<script>
import FsTableColumnsFilter from './fs-table-columns-filter/component'
import FsButton from '../basic/fs-button'
import _ from 'lodash-es'

export default {
  name: 'fs-toolbar',
  components: { FsTableColumnsFilter, FsButton },
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
     * 列配置，传null隐藏按钮
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
  data () {
    return {
      columnsFilter: {
        value: [],
        options: []
      }
    }
  },
  watch: {
    columns (value) {
      this.setColumns(value)
    }
  },
  created () {
    this.setColumns(this.columns)
  },
  computed: {
    _buttons () {
      const defaultButtons = {
        refresh: {
          type: 'primary',
          icon: 'el-icon-refresh',
          title: '刷新',
          circle: true,
          click () {
            this.doRefresh()
          }
        },
        search: {
          type: 'primary',
          icon: 'el-icon-search',
          title: '刷新',
          circle: true,
          click () {
            this.doSearch()
          }
        },
        compact: {
          type: 'primary',
          icon: 'el-icon-rank',
          title: '紧凑模式',
          circle: true,
          click () {
            this.doCompact()
          }
        },
        export: {
          type: 'primary',
          icon: 'el-icon-upload2',
          title: '导出',
          circle: true,
          click () {
            this.doExport()
          }
        },
        columns: {
          type: 'success',
          icon: 'el-icon-set-up',
          title: '列设置',
          circle: true,
          click () {
            this.doColumnsFilter()
          }
        }
      }

      _.merge(defaultButtons, this.buttons)
      if (defaultButtons.search) {
        defaultButtons.search.type = this.search ? 'primary' : ''
      }
      if (defaultButtons.compact) {
        defaultButtons.compact.type = this.compact ? 'primary' : ''
      }
      return defaultButtons
    }
  },
  methods: {
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
      this.$refs.columnsSetup.start()
    },
    handleColumnsFilterChanged (event) {
      this.$emit('columns-filter-changed', event)
    },
    doExport () {
      this.$emit('export')
    },
    setColumns (columns) {
      this.columnsFilter.options = _.cloneDeep(columns)
      this.columnsFilter.value = _.cloneDeep(columns)
    }
  }
}
</script>
