<template>
    <fs-component-render v-if="computedComponent?.show!==false"
                         :modelValue="get(scope.row,prop)"
                         @update:modelValue="set(scope.row,prop,$event)"
                         v-bind="computedComponent"  :scope="getContextFn()"/>
</template>
<script>
import _ from 'lodash-es'
import { defineComponent, inject } from 'vue'
import { ComputeValue } from '@/components/fast-crud/core/compute-value'
export default defineComponent({
  name: 'fs-cell',
  components: { },
  props: {
    prop: {},
    column: {},
    scope: {}
  },
  setup (props) {
    const getColumns = inject('get:columns')

    function getContextFn () {
      return {
        ...props.scope,
        column: props.column,
        getColumns,
        getColumn (key) {
          return getColumns(key)
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
