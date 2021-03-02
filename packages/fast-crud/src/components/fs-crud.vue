<template>
  <fs-container ref="containerRef" v-bind="container" class="fs-crud-container" :class="{compact:toolbar.compact!==false}">
    <template #header>
      <div class="fs-crud-header">
        <slot name="header-before"/>
        <div class="fs-crud-search">
          <fs-search ref="searchRef" v-bind="search" @search="onSearchSubmit" @reset="onSearchReset"
                     :slots="computedSearchSlots"/>
        </div>
        <slot name="header-middle"/>

        <div class="fs-crud-actionbar" v-if="actionbar && actionbar.show!==false">
          <slot name="actionbar-prefix"/>
          <fs-actionbar v-bind="actionbar" @action="onActionHandle"></fs-actionbar>
          <slot name="actionbar-append"/>
        </div>

        <div class="fs-crud-toolbar" v-if="toolbar && toolbar.show!==false">
          <slot name="toolbar-prefix"/>
          <fs-toolbar v-bind="toolbar"
                      :search="search.show"
                      @update:search="$emit('update:search',$event)"
                      :compact="toolbar.compact"
                      @update:compact="$emit('update:compact',$event)"
                      :columns="columns"
                      @update:columns="$emit('update:columns',$event)"
                      @refresh="$emit('refresh')"
                      @action="onToolbarHandle"/>
          <slot name="toolbar-append"/>
        </div>

        <slot name="header-after"/>
      </div>
    </template>
    <!-- 默认插槽 -->
    <slot/>
    <!-- table -->
    <fs-table ref="tableRef" class="fs-crud-table" v-bind="computedTable"
              :columns="columns" :rowHandle="rowHandle"
              :data="data" slots="computedCellSlots"
              @rowHandle="onRowHandle"
    />
    <!-- 编辑对话框 -->
    <fs-form-wrapper ref="formWrapperRef" :slots="computedFormSlots"/>

    <template #footer>
      <div class="fs-crud-footer">
        <slot name="footer-before"/>
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
        <slot name="footer-after"/>
      </div>
    </template>

  </fs-container>
</template>
<script>
import { defineComponent, computed, provide, ref, toRef, getCurrentInstance, reactive, nextTick, onMounted } from 'vue'
import _ from 'lodash-es'
import FsContainer from './container/fs-container.vue'
import FsRowHandle from './crud/fs-row-handle.vue'
import FsFormWrapper from './crud/fs-form-wrapper.js'
import FsActionbar from './actionbar/index.vue'
import FsToolbar from './toolbar/index.vue'
import FsTable from './crud/fs-table.js'
import traceUtil from '../utils/util.trace'
import { uiContext } from '../ui'
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

function useFixedHeight (props, ctx, { tableRef, containerRef }) {
  const ui = uiContext.get()
  if (!ui.table.fixedHeaderNeedComputeBodyHeight) {
    return {}
  }
  const fixedOptions = reactive({ scroll: {} })

  function computeBodyHeight () {
    const tableDom = tableRef.value.$el
    if (tableDom == null) {
      return
    }
    const headDom = tableDom.querySelector('.ant-table-thead')
    if (headDom == null) {
      return
    }
    const tableHeight = tableDom.getBoundingClientRect().height
    const headHeight = headDom.getBoundingClientRect().height
    fixedOptions.scroll.y = tableHeight - headHeight - 2
  }

  function watchBodyHeightChange () {
    const containerDom = containerRef.value.$el
    if (containerDom == null) {
      return
    }
    const tableWrapperDom = containerDom.querySelector('.inner .body')
    const observer = new ResizeObserver(function (entries) {
      // 每次被观测的元素尺寸发生改变这里都会执行
      if (entries.length > 0 && entries[0].contentRect.height > 0) {
        computeBodyHeight()
      }
    })
    observer.observe(tableWrapperDom) // 观测DOM元素
  }
  onMounted(async () => {
    await nextTick()
    await nextTick()
    watchBodyHeightChange()
  })
  return { fixedOptions, computeBodyHeight }
}

function useTable (props, ctx) {
  const tableRef = ref()
  const containerRef = ref()
  const fixedHeightRet = useFixedHeight(props, ctx, { tableRef, containerRef })
  const computedTable = computed(() => {
    // antdv 高度自适应， 如果用户有配置scroll，则优先使用用户配置的
    const fixedHeight = _.merge({}, fixedHeightRet.fixedOptions, { scroll: ctx.attrs.scroll })
    return { ...props.table, ...ctx.attrs, ...fixedHeight }
  })

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
    tableRef,
    containerRef,
    computedTable,
    computedToolbar,
    computedColumns,
    computedCellSlots,
    onRowHandle,
    onActionHandle,
    onToolbarHandle,
    formWrapperRef,
    computedFormSlots,
    computedSearchSlots,
    computeBodyHeight: fixedHeightRet.computeBodyHeight
  }
}

export default defineComponent({
  name: 'fs-crud',
  inheritAttrs: false,
  emits: ['search-submit', 'search-reset', 'refresh', 'update:search', 'update:compact', 'update:columns'],
  components: { FsTable, FsRowHandle, FsContainer, FsFormWrapper, FsActionbar, FsToolbar },
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
    request: {},
    container: {}
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

      .fs-pagination-prefix{
        margin-right:10px;
      }

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
