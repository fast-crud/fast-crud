<template>
  <div class="fs-form">
    <el-form class="fs-form-grid" ref="formRef" :model="model" v-bind="options">
      <template  v-for="(item,key) in computedColumns" :key="key" >
        <el-form-item :key="key" v-if="item.show!==false" v-bind="item">
          <fs-slot-render v-if="slots && slots['form-' + key]" :slots="slots['form-' + key]" :scope="{key,...scope}"/>
          <template v-else>
            <fs-component-render v-if="item.component?.show!==false"
                                 :ref="el => { if (el) componentRefs[key] = el }"
                                 :modelValue="get(model,key)"
                                 @update:modelValue="set(model,key,$event)"
                                 v-bind="item.component"  :scope="{key,...scope}"/>
          </template>
        </el-form-item>
      </template>
    </el-form>
  </div>

</template>

<script>
import { computed, ref, reactive } from 'vue'
import _ from 'lodash-es'
import { ComputeValue } from '../../core/compute-value'
export default {
  name: 'fs-form',
  components: { },
  emits: ['reset', 'submit', 'validationError'],
  props: {
    options: {

    },
    // 初始数据
    formData: {
      default () {
        return {}
      }
    },
    // 字段模版
    columns: {

    },
    // 字段分组
    groups: {

    },
    doSubmit: {
      type: Function
    },
    slots: {

    }
  },
  setup (props, ctx) {
    const formRef = ref()

    const model = reactive({})
    // 初始数据赋值
    _.each(props.columns, (item, key) => {
      model[key] = props.formData[key]
    })

    const componentRefs = ref({})
    function getFormComponentRef (key) {
      return componentRefs.value[key]
    }

    const scope = ref({
      row: props.formData,
      form: model,
      ...ctx.attrs,
      getFormComponentRef
    })

    function getContextFn () {
      return {
        ...scope.value
      }
    }

    const computedColumns = computed(() => {
      return ComputeValue.buildBindProps(props.columns, getContextFn)
    })

    async function getFormRef () {
      return formRef.value
    }
    async function reset () {
      formRef.value.resetFields()
      ctx.emit('reset')
    }

    async function submit () {
      const valid = await formRef.value.validate()
      const ret = {
        ...scope.value
      }
      console.log('valid', valid, ret)
      if (valid) {
        if (props.doSubmit) {
          await props.doSubmit(ret)
          console.log('submit success')
        }
        ctx.emit('submit', ret)
      } else {
        ctx.emit('validationError', ret)
      }

      return valid
    }

    return {
      get: _.get,
      set: _.set,
      formRef,
      computedColumns,
      submit,
      reset,
      getFormRef,
      scope,
      model,
      componentRefs
    }
  }
}
</script>

<style lang="less">
.fs-form-grid{
  display: grid;
  grid-template-columns: 50% 50%;
}
</style>
