<template>
  <span class="d2p-toolbar" >
    <slot name="ToolbarPreSlot"></slot>
    <el-button v-if="refresh"  size="small" icon="el-icon-refresh" circle :title="_text.refreshBtn" @click="doRefresh"/>
    <el-button v-if="search!=null" :type="search?'primary':''"  size="small" icon="el-icon-search" circle :title="_text.searchBtn" @click="doSearch"/>
    <el-button v-if="compact!=null" :type="compact?'primary':''"  size="small" icon="el-icon-rank" circle :title="_text.compactBtn" @click="doCompact"/>
    <el-button v-if="_export" :type="_export?'primary':''"  size="small" icon="el-icon-upload2" circle :title="_text.exportBtn" @click="doExport"/>
    <el-button v-if="columns!=null" type="success" size="small" icon="el-icon-set-up" circle :title="_text.columnsSetBtn"  @click="doColumnsFilter"/>
    <slot name="ToolbarAppendSlot"></slot>
    <d2-table-columns-filter v-if="columns!=null" ref="columnsSetup"
                             v-model="columnsFilter.value"
                             :options="columnsFilter.options"
                             :storage="storage"
                             :text="_text.columnsSet"
                             @change="handleColumnsFilterChanged"/>

  </span>
</template>

<script>
import D2TableColumnsFilter from './d2-table-columns-filter/component'
import lodash from 'lodash'
export default {
  name: 'crud-toolbar',
  components: { D2TableColumnsFilter },
  props: {
    /**
     * 是否显示查询
     * 传null，则不显示按钮
     */
    search: {
      type: Boolean,
      default: undefined
    },
    /**
     * 是否显示刷新
     */
    refresh: {
      type: Boolean,
      default: true
    },
    /**
     * 是否显示紧凑模式
     * 传null，则不显示按钮
     */
    compact: {
      type: Boolean,
      default: undefined
    },
    /**
     * 导出 , true 开启 | false 关闭
     */
    export: {
      type: [Boolean, Object],
      default: false
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
    },
    /**
     * 文本配置
     `
     {
        refreshBtn: '刷新列表',
        searchBtn: '显示/隐藏查询',
        compactBtn: '紧凑型页面',
        exportBtn: '导出数据',
        columnsSetBtn: '列设置',
        columnsSet: {
          title: '列设置',
          fixed: '固定',
          order: '排序',
          reset: '还原',
          confirm: '确定',
          unnamed: '未命名'
        }
      }
     `
     */
    text: {
      type: Object,
      default: undefined
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
    _export () {
      return this.export
    },
    _text () {
      const def = {
        refreshBtn: '刷新列表',
        searchBtn: '显示/隐藏查询',
        compactBtn: '紧凑型页面',
        exportBtn: '导出数据',
        columnsSetBtn: '列设置',
        columnsSet: {}
      }
      lodash.merge(def, this.text)
      return def
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
      this.columnsFilter.options = lodash.cloneDeep(columns)
      this.columnsFilter.value = lodash.cloneDeep(columns)
    }
  }
}
</script>
<style lang="less">
  .d2p-toolbar {
    float: right;
  }
</style>
