<template>
    <fs-component-render v-if="computedComponent?.show!==false"
                         :modelValue="get(scope.row,prop)"
                         @update:modelValue="set(scope.row,prop,$event)"
                         v-bind="computedComponent"  :scope="computeContext"/>
</template>
<script>
import _ from 'lodash-es'
import { defineComponent, computed, inject } from 'vue'
import { ComputeValue } from '@/components/fast-crud/core/compute-value'
export default defineComponent({
  name: 'fs-cell',
  components: { },
  props: {
    prop: {},
    column: {},
    scope: {}
  },
  setup (props, ctx) {
    const getColumns = inject('get:columns')
    const computeContext = {
      ...props.scope,
      column: props.column,
      getColumns,
      getColumn (key) {
        return getColumns(key)
      }
    }
    function getContextFn () {
      return computeContext
    }

    const computedComponent = computed(() => {
      const target = props.column.component
      console.log('recomputed')
      return ComputeValue.buildBindProps(target, getContextFn)
    })

    return {
      get: _.get,
      set: _.set,
      computedComponent,
      computeContext
    }
  }
})
</script>
<style lang="less">

</style>
