<template>
    <template  v-if="computedComponent?.show!==false">
      <fs-render v-if="computedComponent.render"
                           v-bind="computedComponent" :renderFunc="computedComponent.render"  :scope="getContextFn()"/>
      <fs-component-render v-else
                           :modelValue="get(scope.row,prop)"
                           @update:modelValue="set(scope.row,prop,$event)"
                           v-bind="computedComponent"  :scope="getContextFn()"/>
    </template>

</template>
<script>
import _ from 'lodash-es'
import { defineComponent, inject } from 'vue'
import { ComputeValue } from '../../core/compute-value'
import FsRender from '../render/fs-render'
import FsComponentRender from '../render/fs-component-render'
export default defineComponent({
  name: 'fs-cell',
  components: { FsRender, FsComponentRender },
  props: {
    prop: {},
    column: {},
    scope: {}
  },
  setup (props) {
    const getColumns = inject('get:columns')

    function getContextFn () {
      return {
        ...props.scope, // 展开el-table-column的scope
        getColumns,
        getColumn (key) {
          return getColumns()[key]
        }
      }
    }

    const computedComponent = ComputeValue.computed(props.column.component, getContextFn)
    return {
      get: _.get,
      set: _.set,
      computedComponent,
      getContextFn
    }
  }
})
</script>
<style lang="less">

</style>
