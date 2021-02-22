<style lang="less" scoped>
.fs-table-columns-fixed-controller {
  .fs-button {
    padding: 2px;
    font-size: 10px;
    min-height: auto;
  }
}
</style>

<template>
  <el-button-group class="fs-table-columns-fixed-controller">
    <fs-button
      v-for="option of options"
      :key="option.icon"
      :type="modelValue === option.value ? 'primary' : 'default'"
      :icon="option.icon"
      size="small"
      @click="submit(option.value)"/>
  </el-button-group>
</template>

<script>
import FsButton from '../../basic/fs-button'
export default {
  name: 'fs-table-columns-fixed-controller',
  emits: ['update:modelValue', 'change'],
  components: {
    FsButton
  },
  props: {
    modelValue: {
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
      this.$emit('update:modelValue', value)
      this.$emit('change', value)
    }
  }
}
</script>
