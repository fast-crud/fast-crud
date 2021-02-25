<template>
  <component :is="$fsui.select.name" :placeholder="placeHolderDefault">
    <component :is="$fsui.option.name" v-for="item of dictData" :key="item.value" :value="item.value" :label="item.label"
               :title="item.label">{{item.label}}</component>
  </component>
</template>
<script>
import { useDict } from '../../use/use-dict'
import { computed } from 'vue'
export default {
  name: 'fs-dict-select',
  props: {
    dict: {},
    placeholder: {}
  },
  // render () {
  //   return this.renderFunc({ data: this.data, dataMap: this.dataMap, scope: this.scope, attrs: this.$attrs })
  // },
  setup (props, ctx) {
    const placeHolderDefault = computed(() => {
      return props.placeholder || '请选择'
    })
    return {
      placeHolderDefault,
      ...useDict(props, ctx)
    }
  }

}

</script>
