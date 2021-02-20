<template>
  <div class="fs-form">
    <el-form class="fs-form-grid" ref="formRef" :model="form" v-bind="options">
      <template  v-for="(item,key) in computedColumns" :key="key" >
        <el-form-item :key="key" v-if="item.show!==false" v-bind="item">
          <fs-slot-render v-if="slots && slots['form-' + key]" :slots="slots['form-' + key]" :scope="{key,...scope}"/>
          <template v-else>
            <fs-component-render v-if="item.component?.show!==false"
                                 :ref="el => { if (el) componentRefs[key] = el }"
                                 v-bind="item.component"
                                 :modelValue="get(form,key)"
                                 @update:modelValue="set(form,key,$event)"
                                  :scope="{key,...scope}"/>
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
    initial: {
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

    const form = reactive({})
    // 初始数据赋值
    _.each(props.columns, (item, key) => {
      form[key] = props.initial[key]
    })

    const componentRefs = ref({})
    function getComponentRef (key) {
      return componentRefs.value[key]
    }

    const scope = ref({
      row: props.initial,
      form,
      index: ctx.attrs.index,
      mode: ctx.attrs.mode,
      attrs: ctx.attrs,
      getComponentRef
    })

    function getContextFn () {
      return scope.value
    }

    const computedColumns = computed(() => {
      return ComputeValue.buildBindProps(props.columns, getContextFn)
    })

    async function getFormRef () {
      return formRef.value
    }
    async function reset () {
      formRef.value.resetFields()
      if (props.doReset) {
        const ret = scope.value
        await props.doReset(ret)
      }
      ctx.emit('reset')
    }

    async function submit () {
      const valid = await formRef.value.validate()
      const ret = scope.value
      if (valid) {
        if (props.doSubmit) {
          await props.doSubmit(ret)
        }
        ctx.emit('submit', ret)
      } else {
        ctx.emit('validationError', ret)
      }

      return valid
    }

    function getFormData () {
      return form.value
    }
    function setFormData (form) {
      form.value = form
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
      form,
      componentRefs,
      getFormData,
      setFormData,
      getComponentRef
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
