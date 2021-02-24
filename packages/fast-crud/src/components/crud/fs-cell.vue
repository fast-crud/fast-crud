<template>
    <template  v-if="computedComponent?.show!==false">
      <fs-render v-if="computedComponent.render"
                           v-bind="computedComponent" :renderFunc="computedComponent.render"  :scope="getContextFn()"/>
      <fs-component-render v-else
                           :modelValue="get(scope.row,prop)"
                           @update:modelValue="set(scope.row,prop,$event)"
                           v-bind="computedComponent"  :scope="scope"/>
    </template>

</template>
<script>
import _ from 'lodash-es'
import { defineComponent, inject, toRef } from 'vue'
import { ComputeValue } from '../../core/compute-value'
import FsRender from '../render/fs-render'
import FsComponentRender from '../render/fs-component-render'
import traceUtil from '../../utils/util.trace'
export default defineComponent({
  name: 'fs-cell',
  // eslint-disable-next-line vue/no-unused-components
  components: { FsRender, FsComponentRender },
  props: {
    prop: {},
    component: {},
    scope: {}
  },
  setup (props) {
    traceUtil.trace('fs-cell')
    const getColumns = inject('get:columns')

    function getContextFn () {
      return {
        key: props.prop,
        scope: props.scope,
        ...props.scope, // 展开el-table-column的scope
        getColumns,
        getColumn (key) {
          return getColumns()[key]
        }
      }
    }

    const computedComponent = ComputeValue.computed(props.component, getContextFn)
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
