import { ref, resolveComponent, computed } from 'vue'
import FsButton from '../basic/fs-button'
import traceUtil from '../../utils/util.trace'
import _ from 'lodash-es'
import { useI18n } from '../../local'
export default {
  name: 'fs-form-wrapper',
  // eslint-disable-next-line vue/no-unused-components
  components: { FsButton },
  emits: ['reset', 'submit', 'validationError'],
  props: {
    slots: {},
    customClass: { default: '' },
    buttons: {}
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
          const buttons = []
          _.forEach(this.computedButtons, (item, key) => {
            if (item.show === false) {
              return
            }
            buttons.push(<fs-button {...item} />)
          })
          return <div>
            {slotsRender('form-body-before', scope)}
            <fs-form ref="formRef" {...this.formProps} />
            {slotsRender('form-body-after', scope)}
            <div className="fs-form-footer-btns">
              {slotsRender('form-footer-prefix', scope)}
              {buttons}
              {slotsRender('form-footer-append', scope)}
            </div>
          </div>
        }
      }
    }

    const is = this.formWrapperIs || 'el-dialog'

    const visible = this.$fsui.formWrapper.visible
    const vModel = {
      [visible]: this.formWrapperOpen,
      ['onUpdate:' + visible]: (value) => {
        this.formWrapperOpen = value
      }
    }
    const onClosed = this.$fsui.formWrapper.buildOnClosedBind(is, this.closed)
    const customClass = {
      [this.$fsui.formWrapper.customClass]: 'fs-form-wrapper ' + this.customClass
    }

    const formWrapperComp = resolveComponent(is)
    return <formWrapperComp
      {...customClass}
      {...this.formWrapper}
      {...vModel}
      {...onClosed} v-slots={children}>
    </formWrapperComp>
  },
  setup (props) {
    traceUtil.trace('fs-from-wrapper')
    const { t } = useI18n()
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
        ...opts,
        wrapper: null
      }
      delete formProps.value.wrapper

      formWrapperOpen.value = true
    }
    const close = () => {
      formWrapperOpen.value = false
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

    const computedButtons = computed(() => {
      // TODO i18n
      const defBtns = {
        cancel: {
          text: t('fs.form.cancel'),
          onClick: () => {
            close()
          }
        },
        ok: {
          text: t('fs.form.ok'),
          type: 'primary',
          onClick: () => {
            submit()
          },
          loading: loading.value
        }
      }
      return _.merge(defBtns, props.buttons)
    })

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
      computedButtons,
      loading,
      getFormData,
      setFormData
    }
  }
}
