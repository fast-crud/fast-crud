import { ref, resolveDynamicComponent, computed, nextTick, onMounted } from "vue";
import _ from "lodash-es";
import { useI18n } from "../../locale";
import { uiContext } from "../../ui";
import { Constants } from "../../utils/util.constants";
import "./fs-form-wrapper.less";
import { useDrag } from "../../use";

/**
 * 表单对话框|抽屉
 * 暴露方法：
 * open(options)
 */
export default {
  name: "FsFormWrapper",
  props: {
    /**
     * 表单配置
     * {
     *     wrapper:{ //表单包装配置
     *         is: 'el-dialog'//el-dialog|a-modal|el-drawer|a-drawer,
     *         draggable: false, //是否支持拖动
     *         inner:false //是否在页面内部打开
     *     }
     *     ...FsForm配置
     * }
     */
    options: {},
    /**
     * 插槽
     */
    slots: {},
    /**
     * 是否在内部打开对话框
     */
    inner: {},
    /**
     * 内部打开对话框的wrapper
     */
    innerWrapper: {}
  },
  emits: ["reset", "submit", "validationError", "value-change", "open", "opened", "closed", "inner-change"],
  setup(props, ctx) {
    const { t } = useI18n();
    const formWrapperOpen = ref(false);
    const formWrapperIs = ref();
    const formOptions = ref();
    const formWrapperBind = ref();
    const formWrapperOpts = ref();
    const formRef = ref();
    const loading = ref(false);

    const emitOnClosed = ref();
    const emitOnOpened = ref();
    const title = ref();
    const formWrapperId = parseInt(Math.random() * 1000000);
    const formWrapperIdClass = "fs-form-wrapper_" + formWrapperId;
    const open = (opts) => {
      //提取formrapper的配置
      const { wrapper } = opts;
      if (wrapper.onOpen) {
        wrapper.onOpen(opts);
      }
      title.value = wrapper.title;
      formWrapperIs.value = opts.wrapper.is;
      formWrapperOpts.value = wrapper;
      const customClassKey = ui.formWrapper.customClass(formWrapperIs.value);
      let customClass = `fs-form-wrapper ${formWrapperIdClass} ${wrapper[customClassKey] || ""} `;

      formWrapperBind.value = {
        ..._.omit(wrapper, "title", "onOpen", "onClosed", "onOpened", "is", "inner"),
        [customClassKey]: customClass
      };

      //form的配置
      formOptions.value = {
        ..._.omit(opts, "wrapper"),
        slots: props.slots
      };

      // 打开表单对话框
      formWrapperOpen.value = true;

      // 发射打开事件
      function buildEvent() {
        return {
          wrapper: formWrapperBind.value,
          options: formOptions.value,
          formRef: formRef.value
        };
      }

      emitOnClosed.value = () => {
        if (wrapper.onClosed) {
          wrapper.onClosed(buildEvent());
        }
      };
      emitOnOpened.value = () => {
        if (wrapper.onOpened) {
          wrapper.onOpened(buildEvent());
        }
      };

      nextTick(() => {
        onOpened();
      });

      /**
       * 是否内部打开对话框
       */
      ctx.emit("inner-change", !!formWrapperOpts.value.inner);
    };
    const close = () => {
      formWrapperOpen.value = false;
    };
    const onClosed = () => {
      formOptions.value = null;
      if (emitOnClosed.value) {
        emitOnClosed.value();
      }
    };

    const onOpened = () => {
      if (emitOnOpened.value) {
        emitOnOpened.value();
      }
      if (formWrapperBind.value.draggable) {
        const { dragModal } = useDrag();
        dragModal({
          getModal: () => {
            return document.querySelector(`.${formWrapperIdClass}`);
          }
        });
      }
    };

    const onValueChange = (e) => {
      ctx.emit("value-change", e);
    };

    async function submit() {
      loading.value = true;
      try {
        await formRef.value.submit();
        close();
      } catch (e) {
        console.warn("submit error", e);
      } finally {
        loading.value = false;
      }
    }

    function getFormData() {
      return formRef.value?.getFormData();
    }
    function setFormData(form) {
      formRef.value?.setFormData(form);
    }

    const computedButtons = computed(() => {
      const defBtns = {
        cancel: {
          text: t("fs.form.cancel"),
          onClick: () => {
            close();
          }
        },
        ok: {
          text: t("fs.form.ok"),
          type: "primary",
          onClick: async () => {
            await submit();
          },
          loading: loading.value
        }
      };
      const buttons = _.merge(defBtns, formWrapperBind.value?.buttons);
      const buttonsArr = [];
      _.forEach(buttons, (value, key) => {
        value.key = key;
        buttonsArr.push(value);
        if (value.onClick == null && value.click != null) {
          value.onClick = () => {
            value.click(value);
          };
        }
      });
      return _.sortBy(buttonsArr, (item) => {
        return item.order ?? Constants.orderDefault;
      });
    });

    onMounted(() => {
      if (props.options != null) {
        open(props.options);
      }
    });

    const fullscreen = ref(false);
    const fullscreenEnabled = computed(() => {
      return !formWrapperIs.value?.endsWith("drawer");
    });
    function toggleFullscreen() {
      fullscreen.value = !fullscreen.value;
    }

    const ui = uiContext.get();
    //内部打开dialog配置
    const innerBind = computed(() => {
      if (!formWrapperOpts.value.inner) {
        return {};
      }
      return ui.formWrapper.buildInnerBind({
        getInnerWrapper() {
          return props.innerWrapper;
        }
      });
    });

    return {
      formWrapperId,
      formWrapperIdClass,
      close,
      onClosed,
      onOpened,
      open,
      title,
      fullscreenEnabled,
      fullscreen,
      toggleFullscreen,
      formOptions,
      formWrapperIs,
      formWrapperOpen,
      formWrapperBind,
      formRef,
      submit,
      computedButtons,
      loading,
      getFormData,
      setFormData,
      onValueChange,
      innerBind
    };
  },
  render() {
    if (!this.formWrapperBind) {
      return null;
    }
    const ui = uiContext.get();
    let children = {};
    const _slots = { ...this.$slots, ...this.slots };
    const slotsRender = (key, scope, slots = _slots) => {
      if (!slots[key]) {
        return null;
      }
      return slots[key](scope);
    };
    const is = this.formWrapperIs || "el-dialog";
    if (this.formOptions) {
      const { index, mode } = this.formOptions || {};
      const scope = { _self: this, index, mode, getFormData: this.getFormData };
      children = {
        [ui.formWrapper.titleSlotName]: () => {
          let fullScreenIcon = null;
          if (this.fullscreenEnabled) {
            fullScreenIcon = (
              <fs-icon
                class="fs-fullscreen-icon"
                onClick={this.toggleFullscreen}
                icon={this.fullscreen ? ui.icons.fullScreen : ui.icons.unFullScreen}
              />
            );
          }
          return (
            <div class={"fs-form-header"}>
              <div class={"fs-form-header-left"}>
                {slotsRender("form-header-left", scope)}
                {this.title}
                {slotsRender("form-header-right", scope)}
              </div>
              <div class={"fs-form-header-action"}>
                {slotsRender("form-header-action-left", scope)}
                {fullScreenIcon}
                {slotsRender("form-header-action-right", scope)}
              </div>
            </div>
          );
        },
        default: () => {
          const buttons = [];
          _.forEach(this.computedButtons, (item) => {
            if (item.show === false) {
              return;
            }
            buttons.push(<fs-button {...item} />);
          });
          return (
            <div class={"fs-form-wrapper-body"}>
              <div class={"fs-form-body"}>
                {slotsRender("form-body-top", scope)}
                <fs-form ref="formRef" {...this.formOptions} onValueChange={this.onValueChange} />
                {slotsRender("form-body-bottom", scope)}
              </div>
              <div className="fs-form-footer-btns">
                {slotsRender("form-footer-left", scope)}
                {buttons}
                {slotsRender("form-footer-right", scope)}
              </div>
            </div>
          );
        }
      };
    }

    if (ui.formWrapper.hasContentWrap) {
      const contentWrap = ui.formWrapper.hasContentWrap(is);
      const subChildren = children;
      if (contentWrap) {
        const contentWrapComp = resolveDynamicComponent(contentWrap);
        children = {
          default: () => {
            return <contentWrapComp>{subChildren}</contentWrapComp>;
          }
        };
      }
    }

    const visible = ui.formWrapper.visible;
    const vModel = {
      [visible]: this.formWrapperOpen,
      ["onUpdate:" + visible]: (value) => {
        this.formWrapperOpen = value;
      }
    };
    const vClosed = ui.formWrapper.buildOnClosedBind(is, this.onClosed);

    const customClassKey = ui.formWrapper.customClass(is);
    const fullscreenClassKey = this.fullscreen ? "fs-fullscreen" : "";
    const customClass = `${fullscreenClassKey} ${this.formWrapperBind[customClassKey] || ""}`;
    const vCustomClass = {
      [customClassKey]: customClass
    };

    const vFullScreen = {
      fullscreen: this.fullscreen
    };

    const formWrapperComp = resolveDynamicComponent(is);
    return (
      <formWrapperComp
        {...this.formWrapperBind}
        {...vCustomClass}
        {...vModel}
        {...vClosed}
        {...vFullScreen}
        {...this.innerBind}
        v-slots={children}
      />
    );
  }
};
