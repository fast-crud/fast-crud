<template>
  <component class="fs-form-wrapper" v-if="formWrapper" :is="formWrapper.is || 'el-dialog'" :title="formWrapper?.title" v-model="formWrapperOpen" v-bind="formWrapper">
     <fs-form  v-if="formProps" ref="formRef" v-bind="formProps"></fs-form>

     <div class="fs-form-footer-btns">
       <fs-button @click="submit"  text="确定"></fs-button>
     </div>
  </component>
</template>

<script>
import { ref } from 'vue'
import FsButton from '../basic/fs-button'
export default {
  name: 'fs-form-wrapper',
  components: { FsButton },
  emits: ['reset', 'submit', 'validationError'],
  props: {
  },
  setup (props, ctx) {
    const formWrapperOpen = ref(false)
    const formProps = ref()
    const formWrapper = ref()
    const open = (opts) => {
      formWrapperOpen.value = true
      formProps.value = {
        ...opts
      }
      delete formProps.value.wrapper
      formWrapper.value = opts.wrapper

      console.log('formProps', formProps.value)
    }
    const close = () => {
      formWrapperOpen.value = false
      formProps.value = null
    }

    const formRef = ref()

    async function submit () {
      await formRef.value.submit()
    }
    return {
      close,
      open,
      formProps,
      formWrapperOpen,
      formWrapper,
      formRef,
      submit
    }
  }
}
</script>
<style lang="less">
.fs-form-wrapper{
  .fs-form-footer-btns{
    text-align: right;
    margin-top:20px;
  }

  .el-dialog__header {
    padding: 20px 20px ;
    border-bottom: 1px #eee solid;
  }
  .el-dialog__body {
    padding: 20px 20px;
  }

  .el-drawer__body{
    padding: 20px 20px;
  }

  .el-drawer__header {
    margin-bottom: 0px;
    padding: 20px 20px;
    border-bottom: 1px #eee solid;
  }
}

</style>
