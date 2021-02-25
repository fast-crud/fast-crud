<template>
  <fs-container class="fs-crud-container" :class="{compact:toolbar.compact!==false}">
    <template #header>
      <div class="fs-crud-header">
        <slot name="header-before"/>
        <div class="fs-crud-search">
          <fs-search ref="searchRef" v-bind="search" @search="onSearchSubmit" @reset="onSearchReset"
                     :slots="computedSearchSlots"/>
        </div>
        <div class="fs-crud-actionbar" v-if="actionbar?.show!==false">
          <slot name="actionbar-prefix"/>
          <fs-actionbar v-bind="actionbar" @action="onActionHandle"></fs-actionbar>
          <slot name="actionbar-append"/>
        </div>

        <div class="fs-crud-toolbar" v-if="toolbar?.show!==false">
          <slot name="toolbar-prefix"/>
          <fs-toolbar v-bind="toolbar"
                      :search="search.show"
                      @update:search="$emit('update:search',$event)"
                      :compact="toolbar.compact"
                      @update:compact="$emit('update:compact',$event)"
                      :columns="columns"
                      @update:columns="$emit('update:columns',$event)"
                      @refresh="$emit('refresh')"
                      @action="onToolbarHandle"></fs-toolbar>
          <slot name="toolbar-append"/>
        </div>
        <slot name="header-after"/>
      </div>
    </template>
    <slot :scope="{data}"/>
    <fs-table class="fs-crud-table" v-bind="computedTable"
              :columns="columns" :rowHandle="rowHandle"
              :data="data" slots="computedCellSlots"
              @rowHandle="onRowHandle"
    />
<!--    <component :is="$fsui.table.name" v-if="computedTable?.show!==false" class="fs-crud-table" v-bind="computedTable" :data="data">-->
<!--&lt;!&ndash;      v-loading="computedTable.loading"&ndash;&gt;-->
<!--      <template  v-for="(item) of computedColumns" :key="item.key">-->
<!--        <fs-column v-bind="item" :prop="item.key" :slots="computedCellSlots"></fs-column>-->
<!--      </template>-->

<!--&lt;!&ndash;      <el-table-column&ndash;&gt;-->
<!--&lt;!&ndash;        v-for="(item,key) of columns"  v-bind="item" :key="key" :prop="key"&ndash;&gt;-->
<!--&lt;!&ndash;      >&ndash;&gt;-->
<!--&lt;!&ndash;        <template #default="scope">&ndash;&gt;-->
<!--&lt;!&ndash;          {{scope.row[key]}}&ndash;&gt;-->
<!--&lt;!&ndash;        </template>&ndash;&gt;-->
<!--&lt;!&ndash;      </el-table-column>&ndash;&gt;-->

<!--      <component :is="$fsui.tableColumn.name"-->
<!--          v-if="rowHandle && rowHandle.show!==false"-->
<!--          v-bind="rowHandle" :label="rowHandle.title"-->
<!--          prop="rowHandle"-->
<!--      >-->
<!--        <template #default="scope">-->
<!--          <fs-row-handle v-bind="rowHandle" :scope="scope" @handle="onRowHandle"></fs-row-handle>-->
<!--        </template>-->
<!--      </component>-->
<!--    </component>-->

    <fs-form-wrapper ref="formWrapperRef" :slots="computedFormSlots"/>

    <template #footer>
      <div class="fs-crud-footer">
        <slot name="footerBefore"/>
        <div class="fs-crud-pagination">
          <div class="fs-pagination-prefix">
            <slot name="pagination-prefix"/>
          </div>
          <div class="fs-pagination">
            <component :is="$fsui.pagination.name" v-bind="pagination"/>
          </div>
          <div class="fs-pagination-append">
            <slot name="pagination-append"/>
          </div>
        </div>
        <slot name="footerAfter"/>
      </div>
    </template>

  </fs-container>
</template>
<script>
import { defineComponent, computed, provide, ref, toRef, getCurrentInstance } from 'vue'
import _ from 'lodash-es'
import FsContainer from './container/fs-container'
import FsColumn from './crud/fs-column'
import FsRowHandle from './crud/fs-row-handle'
import FsFormWrapper from './crud/fs-form-wrapper'
import FsActionbar from './actionbar'
import FsToolbar from './toolbar'
import FsTable from './crud/fs-table'
import { ComputeValue } from '../core/compute-value'
import traceUtil from '../utils/util.trace'
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
    searchFormData.value = e.form
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

  const getSearchRef = () => {
    return searchRef.value
  }

  const getSearchFormData = () => {
    return searchFormData.value
  }

  /**
   * 设置form值
   * @param form form对象
   * @param opts = {
   *    isMerge:false 是否与原有form值合并,
   * }
   */
  function setSearchFormData ({ form, mergeForm = false }) {
    const baseForm = {}
    if (mergeForm) {
      _.merge(baseForm, searchFormData.value, form)
    } else {
      _.merge(baseForm, form)
    }
    searchFormData.value = baseForm
    if (searchRef.value) {
      searchRef.value.setForm(form)
    }
  }

  return {
    searchRef,
    searchFormData,
    onSearchSubmit,
    onSearchReset,
    getSearchRef,
    getSearchFormData,
    setSearchFormData
  }
}

function slotFilter (ctxSlots, keyPrefix) {
  if (!ctxSlots) {
    return {}
  }
  const slots = {}
  _.forEach(ctxSlots, (value, key) => {
    if (key.startsWith(keyPrefix)) {
      slots[key] = value
    }
  })
  return slots
}

function useTable (props, ctx) {
  const computedTable = toRef(props, 'table')

  const computedToolbar = toRef(props, 'toolbar')

  const computedColumns = toRef(props, 'columns')

  const computedCellSlots = computed(() => {
    return slotFilter(ctx.slots, 'cell-')
  })

  const computedFormSlots = computed(() => {
    return slotFilter(ctx.slots, 'form-')
  })
  const computedSearchSlots = computed(() => {
    return slotFilter(ctx.slots, 'search-')
  })
  const formWrapperRef = ref()

  const { proxy } = getCurrentInstance()
  const onRowHandle = (scope) => {
    const { key } = scope
    const tableColumnCI = proxy.$fsui.tableColumn
    const index = scope[tableColumnCI.index]
    const row = scope[tableColumnCI.row]

    const e = { mode: key, initial: row, slots: ctx.slots, index }
    console.log('handle', scope)
    if (key === 'edit') {
      formWrapperRef.value.open({ ...props.editForm, ...e })
    } else if (key === 'view') {
      formWrapperRef.value.open({ ...props.viewForm, ...e })
    }
  }

  const onActionHandle = (e) => {
    if (e.key === 'add') {
      formWrapperRef.value.open({ ...props.addForm, mode: 'add', initial: e.initial, slots: ctx.slots })
    }
  }

  const onToolbarHandle = (e) => {
    console.log('toolbar handle', e)
  }

  return {
    computedTable,
    computedToolbar,
    computedColumns,
    computedCellSlots,
    onRowHandle,
    onActionHandle,
    onToolbarHandle,
    formWrapperRef,
    computedFormSlots,
    computedSearchSlots
  }
}

export default defineComponent({
  name: 'fs-crud',
  inheritAttrs: false,
  emits: ['search-submit', 'search-reset', 'refresh', 'update:search', 'update:compact', 'update:columns'],
  // eslint-disable-next-line vue/no-unused-components
  components: { FsTable, FsRowHandle, FsContainer, FsColumn, FsFormWrapper, FsActionbar, FsToolbar },
  props: {
    table: {
      show: true
    },
    columns: { type: Array },
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
    traceUtil.trace('fs-crud')
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
  &.compact {
    .el-table--border {
      border-left: 0
    }
    .fs-crud-header{
      padding-left: 10px;
      padding-right: 10px;
    }
    .fs-crud-footer{
      padding-left:10px;
      padding-right: 10px;
    }
  }

  .fs-crud-header {
    display: grid;
    grid-template-columns: 50% 50%;
    padding: 10px 0;

    .fs-crud-search {
      grid-column: span 2;
      padding-bottom: 5px;
    }

    .fs-crud-actionbar {
      padding-top: 5px;
    }

    .fs-crud-toolbar {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-right: 20px;
    }
  }

  .fs-crud-table {
    height: 100%;
    width: 100%
  }

  .fs-crud-footer{
    padding:10px 0;
    .fs-crud-pagination {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      .fs-pagination-append {
        flex: 0
      }

      .fs-pagination {
        flex: 1;

        .el-pagination {
          padding-left: 0;
          padding-right: 0;
        }
      }

      .fs-pagination-append {
        flex: 0
      }
    }
  }

}
</style>
