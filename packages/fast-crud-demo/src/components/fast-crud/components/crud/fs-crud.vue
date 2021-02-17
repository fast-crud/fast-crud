<template>
<fs-container class="fs-crud-container" :class="{impact:toolbar.impact}">
  <template #header>
    <slot name="header-before"></slot>
    <div class="fs-crud-header">
      <div class="fs-crud-search">
        <slot name="searchPrefix"></slot>
        <fs-search v-bind="search">
          <slot name="search"></slot>
        </fs-search>
        <slot name="search-append"></slot>
      </div>
      <div class="fs-crud-toolbar">
          <slot name="toolbar-prefix"></slot>
<!--          <fs-toolbar></fs-toolbar>-->
          <slot name="toolbar-append"></slot>
      </div>
    </div>
    <slot name="headerAfter"></slot>
  </template>
  <el-table class="fs-crud-table" v-bind="computedTable"  :data="data">
    <fs-column v-for="(item,key) of columns"  :column="item" :key="key" :prop="key" :slots="cellSlots"></fs-column>

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

  <fs-form-wrapper ref="formWrapperRef"  ></fs-form-wrapper>

  <template #footer>
    <slot name="footerBefore"></slot>
    <div class="fs-crud-pagination">
      <div class="fs-pagination-prefix">
        <slot name="pagination-prefix"></slot>
      </div>
      <div class="fs-pagination">
        <el-pagination v-bind="pagination"></el-pagination>
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
import { defineComponent, computed, provide, ref } from 'vue'
import _ from 'lodash-es'
import FsContainer from '@/components/fast-crud/components/container/fs-container'
import FsColumn from './fs-column'
import FsRowHandle from '@/components/fast-crud/components/crud/fs-row-handle'
import FsFormWrapper from '@/components/fast-crud/components/crud/fs-form-wrapper'

function useProviders (props, ctx) {
  provide('get:columns', () => {
    return props.columns
  })
  provide('update:columns', (columns) => {
    ctx.emit('update:columns', columns)
  })
}

export default defineComponent({
  name: 'fs-crud',
  components: { FsRowHandle, FsContainer, FsColumn, FsFormWrapper },
  props: {
    table: {},
    columns: { type: Object },
    data: {
      type: Array
    },
    rowHandle: {},
    search: {},
    toolbar: {},
    addForm: {},
    editForm: {},
    viewForm: {},
    pagination: {}
  },
  setup (props, ctx) {
    console.log('ctx', ctx)
    const computedTable = computed(() => {
      const def = {
        height: '100%',
        rowKey: 'id',
        stripe: true,
        border: true
      }
      return _.merge(def, props.table)
    })

    const computedToolbar = computed(() => {
      const def = {
        impact: true
      }
      return _.merge(def, props.toolbar)
    })

    const cellSlots = computed(() => {
      return ctx.slots || {}
    })

    const onRowHandle = ({ key, row, $index }) => {
      console.log('handle', key, row, $index)
      if (key === 'edit') {
        formWrapperRef.value.open({ ...props.editForm, formData: row, index: $index, slots: ctx.slots })
      } else if (key === 'view') {
        formWrapperRef.value.open({ ...props.viewForm, formData: row, index: $index, slots: ctx.slots })
      } else if (key === 'remove') {
        // TODO 删除
      }
    }

    const formWrapperRef = ref()

    useProviders()
    return {
      computedTable,
      computedToolbar,
      cellSlots,
      onRowHandle,
      formWrapperRef
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
