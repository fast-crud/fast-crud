<style lang="less" scoped>
.d2-table-columns-fixed-controller {
  .d2p-button {
    padding: 2px;
    font-size: 10px;
  }
}
</style>

<template>
  <el-button-group class="d2-table-columns-fixed-controller">
    <d2p-button
      v-for="option of options"
      :key="option.icon"
      :type="value === option.value ? 'primary' : 'default'"
      :icon="option.icon"
      @click="submit(option.value)"/>
  </el-button-group>
</template>

<script>
import d2pButton from '../../basic/d2p-button/component'
export default {
  name: 'd2-table-columns-fixed-controller',
  components: {
    d2pButton
  },
  props: {
    value: {
      default: false
    }
  },
  data () {
    return {
      options: [
        {
          value: 'left',
          icon: 'el-icon-arrow-left'
        },
        {
          value: false,
          icon: 'el-icon-close'
        },
        {
          value: 'right',
          icon: 'el-icon-arrow-right'
        }
      ]
    }
  },
  methods: {
    submit (value) {
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}
</script>
