<template>
<fs-container class="fs-crud-container" :class="{impact:toolbar.impact}">
  <template #header>
    <slot name="header-before"></slot>
    <div class="fs-crud-header">
      <div class="fs-crud-search">
        <slot name="search-prefix"></slot>
        <fs-search ref="searchRef" v-bind="search" v-model="searchFormData" @search="onSearchSubmit" @reset="onSearchReset">
          <slot name="search"></slot>
        </fs-search>
        <slot name="search-append"></slot>
      </div>
      <div class="fs-crud-action">
        <div class="fs-crud-actionbar" v-if="actionbar?.show!==false">
          <slot name="actionbar-prefix"></slot>
          <fs-actionbar v-bind="actionbar" @action="onActionHandle"></fs-actionbar>
          <slot name="actionbar-append"></slot>
        </div>
        <div class="fs-crud-toolbar" v-if="toolbar?.show!==false">
          <slot name="toolbar-prefix"></slot>
          <!--          <fs-toolbar></fs-toolbar>-->
          <slot name="toolbar-append"></slot>
        </div>
      </div>

    </div>
    <slot name="header-after"></slot>
  </template>
  <slot :scope="{data}"></slot>
  <el-table v-if="table?.show!==false" class="fs-crud-table" v-bind="computedTable"  :data="data" >
    <fs-column v-for="(item,key) of columns"  :column="item" :key="key" :prop="key" :slots="computedCellSlots"></fs-column>

    <el-table-column
        v-if="rowHandle"
        v-bind="rowHandle"
        prop="rowHandle"
    >
      <template  #default="scope" >
        <fs-row-handle v-bind="rowHandle" :scope="scope" @handle="onRowHandle"></fs-row-handle>
      </template>
    </el-table-column>
  </el-table>

  <fs-form-wrapper ref="formWrapperRef"  :slots="computedFormSlots"/>

  <template #footer>
    <slot name="footerBefore"></slot>
    <div class="fs-crud-pagination">
      <div class="fs-pagination-prefix">
        <slot name="pagination-prefix"></slot>
      </div>
      <div class="fs-pagination">
        <el-pagination v-bind="pagination"/>
      </div>
      <div class="fs-pagination-append">
        <slot name="pagination-append"></slot>
      </div>
    </div>
    <slot name="footerAfter"></slot>
  </template>

</fs-container>
</template>
<script>
import { defineComponent, computed, provide, ref, onMounted } from 'vue'
import _ from 'lodash-es'
import FsContainer from './container/fs-container'
import FsColumn from './crud/fs-column'
import FsRowHandle from './crud/fs-row-handle'
import FsFormWrapper from './crud/fs-form-wrapper'
import FsActionbar from './crud/fs-actionbar'

function useProviders (props, ctx) {
  provide('get:columns', () => {
    return props.columns
  })
  provide('update:columns', (columns) => {
    ctx.emit('update:columns', columns)
  })
}

function useSearch (props, ctx) {
  const searchRef = ref()
  const searchFormData = ref(_.cloneDeep(props.search.initial || {}))
  const onSearchSubmit = async (e) => {
    if (props.search.doSearch) {
      props.search.doSearch(e)
      return
    }
    ctx.emit('search-submit', e)
  }

  const onSearchReset = (e) => {
    if (props.search.doReset) {
      props.search.doReset(e)
      return
    }
    ctx.emit('search-reset', e)
  }

  return {
    searchRef,
    searchFormData,
    onSearchSubmit,
    onSearchReset
  }
}

function slotFilter (ctxSlots, keyPrefix) {
  if (!ctxSlots) {
    return {}
  }
  const slots = {}
  _.each(slots, (value, key) => {
    if (key.startsWith(keyPrefix)) {
      slots[key] = value
    }
  })
  return slots
}

function useTable (props, ctx, { searchFormData }) {
  const computedTable = computed(() => {
    const def = {
      height: '100%',
      rowKey: 'id',
      stripe: true,
      border: true,
      ...ctx.attrs
    }
    return _.merge(def, props.table)
  })

  const doRefresh = async () => {
    let page
    if (props.pagination) {
      page = { currentPage: props.pagination.currentPage, pageSize: props.pagination.pageSize }
    }
    const query = { page, form: searchFormData.value }
    let result = await props.request.pageRequest(query)
    if (props.request.transform) {
      result = props.request.transform(result)
    }
    const { currentPage, pageSize, total, records } = result
    ctx.emit()
  }

  const computedToolbar = computed(() => {
    const def = {
      impact: true
    }
    return _.merge(def, props.toolbar)
  })

  const computedCellSlots = computed(() => {
    return slotFilter(ctx.slots, 'cell-')
  })

  const computedFormSlots = computed(() => {
    return slotFilter(ctx.slots, 'form-')
  })
  const formWrapperRef = ref()

  const onRowHandle = ({ key, row, $index }) => {
    console.log('handle', key, row, $index)
    if (key === 'edit') {
      formWrapperRef.value.open({ ...props.editForm, mode: key, formData: row, index: $index, slots: ctx.slots })
    } else if (key === 'view') {
      formWrapperRef.value.open({ ...props.viewForm, mode: key, formData: row, index: $index, slots: ctx.slots })
    }
  }

  const onActionHandle = (e) => {
    if (e.key === 'add') {
      formWrapperRef.value.open({ ...props.addForm, mode: 'add', slots: ctx.slots })
    }
  }

  return {
    computedTable,
    computedToolbar,
    computedCellSlots,
    onRowHandle,
    onActionHandle,
    formWrapperRef,
    computedFormSlots
  }
}

export default defineComponent({
  name: 'fs-crud',
  inheritAttrs: false,
  emits: ['search-submit', 'search-reset'],
  components: { FsRowHandle, FsContainer, FsColumn, FsFormWrapper, FsActionbar },
  props: {
    table: {
      show: true
    },
    columns: { type: Object },
    data: {
      type: Array
    },
    rowHandle: {},
    search: {},
    toolbar: {},
    actionbar: {},
    addForm: {},
    editForm: {},
    viewForm: {},
    pagination: {},
    request: {}
  },
  setup (props, ctx) {
    console.log('ctx', ctx)

    useProviders()
    const search = useSearch(props, ctx)
    const table = useTable(props, ctx, search)
    return {
      ...search,
      ...table

    }
  }
})
</script>
<style lang="less">

.fs-crud-container {
  &.impact{
    .el-table--border{
      border-left:0
    }
  }
  .fs-crud-table {
    height: 100%;
    width:100%
  }

  .fs-crud-pagination{
    padding:10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .fs-pagination-append{
      flex:0
    }
    .fs-pagination{
      flex:1;
      .el-pagination{
        padding-left:0;
        padding-right:0;
      }
    }
    .fs-pagination-append{
      flex:0
    }
  }
}
</style>
