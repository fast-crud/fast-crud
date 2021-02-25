<script>
import { ref, resolveComponent } from 'vue'
import FsButton from '../basic/fs-button'
import traceUtil from '../../utils/util.trace'
export default {
  name: 'fs-form-wrapper',
  // eslint-disable-next-line vue/no-unused-components
  components: { FsButton },
  emits: ['reset', 'submit', 'validationError'],
  props: {
    slots: {}
  },
  render () {
    if (!this.formWrapper) {
      return null
    }
    let children = {}
    const _slots = { ...this.$slots, ...this.slots }
    const slotsRender = (key, scope, slots = _slots) => {
      if (!slots[key]) {
        return null
      }
      return slots[key](scope)
    }
    const scope = { _self: this, ...this.formProps }
    if (this.formProps) {
      children = {
        default: () => {
          return <div>
            {slotsRender('form-body-before', scope)}
            <fs-form ref="formRef" {...this.formProps} />
            {slotsRender('form-body-after', scope)}
            <div className="fs-form-footer-btns">
              {slotsRender('form-footer-prefix', scope)}
              <fs-button text="确定" onClick={this.submit} loading={this.loading}/>
              {slotsRender('form-footer-append', scope)}
            </div>
          </div>
        }
      }
    }

    const is = this.formWrapperIs || 'el-dialog'
    const comp = resolveComponent(is)
    const visible = this.$fsui.dialog.visible
    console.log('visible', visible)
    const vModel = {
      [visible]: this.formWrapperOpen,
      ['onUpdate:' + visible]: (value) => {
        this.formWrapperOpen = value
      }
    }
    return <comp custom-class="fs-form-wrapper"
      {...this.formWrapper}
      {...vModel}
      onCancel={this.close}
      onClosed={this.closed} v-slots={children}>
    </comp>
  },
  setup () {
    traceUtil.trace('fs-from-wrapper')
    const formWrapperOpen = ref(false)
    const formWrapperIs = ref()
    const formProps = ref()
    const formWrapper = ref()
    const loading = ref(false)
    const open = (opts) => {
      formWrapper.value = {
        ...opts.wrapper
      }
      delete formWrapper.value.is
      formWrapperIs.value = opts.wrapper.is
      formProps.value = {
        ...opts
      }
      delete formProps.value.wrapper

      formWrapperOpen.value = true
    }
    const close = () => {
      formWrapperOpen.value = false
      formProps.value = null
    }
    const closed = () => {
      formProps.value = null
    }

    const formRef = ref()

    async function submit () {
      loading.value = true
      try {
        await formRef.value.submit()
        close()
      } catch (e) {
        console.warn('submit error', e)
      } finally {
        loading.value = false
      }
    }

    function getFormData () {
      return formRef.value.getFormData()
    }
    function setFormData (form) {
      formRef.value = form
    }

    return {
      close,
      closed,
      open,
      formProps,
      formWrapperIs,
      formWrapperOpen,
      formWrapper,
      formRef,
      submit,
      loading,
      getFormData,
      setFormData
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
