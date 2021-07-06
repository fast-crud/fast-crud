import { ref, resolveDynamicComponent, computed, nextTick, onMounted } from "vue";
import FsButton from "../basic/fs-button";
import _ from "lodash-es";
import { useI18n } from "../../locale";
import "./fs-form-wrapper.less";
import logger from "../../utils/util.log";
import { uiContext } from "../../ui";

/**
 * 表单对话框|抽屉
 * 暴露方法：
 * open(options)
 */
export default {
  name: "FsFormWrapper",
  // eslint-disable-next-line vue/no-unused-components
  components: { FsButton },
  props: {
    /**
     * 表单配置
     * {
     *     wrapper:{ //表单包装配置
     *         is: 'el-dialog'//el-dialog|a-modal|el-drawer|a-drawer
     *     }
     *     ...FsForm配置
     * }
     */
    options: {},
    /**
     * 插槽
     */
    slots: {}
  },
  emits: ["reset", "submit", "validationError", "value-change", "open", "opened", "closed"],
  setup(props, ctx) {
    const { t } = useI18n();
    const formWrapperOpen = ref(false);
    const formWrapperIs = ref();
    const formOptions = ref();
    const formWrapper = ref();
    const formRef = ref();
    const loading = ref(false);

    const emitOnClosed = ref();
    const emitOnOpened = ref();
    const title = ref();
    const open = (opts) => {
      //提取formrapper的配置
      const { wrapper } = opts;
      if (wrapper.onOpen) {
        wrapper.onOpen(opts);
      }
      title.value = wrapper.title;
      formWrapperIs.value = opts.wrapper.is;
      formWrapper.value = {
        ..._.omit(wrapper, "title", "onOpen", "onClosed", "onOpened", "is")
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
          wrapper: formWrapper.value,
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
      formRef.value = form;
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
      return _.merge(defBtns, formWrapper.value?.buttons);
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

    return {
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
      formWrapper,
      formRef,
      submit,
      computedButtons,
      loading,
      getFormData,
      setFormData,
      onValueChange
    };
  },
  render() {
    if (!this.formWrapper) {
      return null;
    }
    const ui = uiContext.get();
    logger.debug("formWrapper", this.formWrapper);
    let children = {};
    const _slots = { ...this.$slots, ...this.slots };
    const slotsRender = (key, scope, slots = _slots) => {
      if (!slots[key]) {
        return null;
      }
      return slots[key](scope);
    };

    if (this.formOptions) {
      const { index, mode } = this.formOptions || {};
      const scope = { _self: this, index, mode, getFormData: this.getFormData };
      children = {
        title: () => {
          let fullScreenIcon = null;
          if (this.fullscreenEnabled) {
            fullScreenIcon = (
              <fs-icon
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

    const is = this.formWrapperIs || "el-dialog";

    const visible = this.$fsui.formWrapper.visible;
    const vModel = {
      [visible]: this.formWrapperOpen,
      ["onUpdate:" + visible]: (value) => {
        this.formWrapperOpen = value;
      }
    };
    const vClosed = this.$fsui.formWrapper.buildOnClosedBind(is, this.onClosed);
    const vCustomClass = {
      [this.$fsui.formWrapper.customClass]: `fs-form-wrapper ${this.formWrapper.customClass || ""}  ${
        this.fullscreen ? "fs-fullscreen" : ""
      }`
    };

    const vFullScreen = {
      fullscreen: this.fullscreen
    };

    const formWrapperComp = resolveDynamicComponent(is);
    return (
      <formWrapperComp
        {...vCustomClass}
        {...this.formWrapper}
        {...vModel}
        {...vClosed}
        {...vFullScreen}
        v-slots={children}
      />
    );
  }
};
