<script lang="jsx">
import { ref, resolveDynamicComponent, computed, nextTick, onMounted } from "vue";
import _ from "lodash-es";
import { useI18n } from "../../locale";
import { uiContext } from "../../ui";

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
    inner:{},
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
    const open = (opts) => {
      //提取formrapper的配置
      const { wrapper } = opts;
      if (wrapper.onOpen) {
        wrapper.onOpen(opts);
      }
      title.value = wrapper.title;
      formWrapperIs.value = opts.wrapper.is;
      formWrapperOpts.value = wrapper;
      formWrapperBind.value = {
        ..._.omit(wrapper, "title", "onOpen", "onClosed", "onOpened", "is","inner")
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
      return _.merge(defBtns, formWrapperBind.value?.buttons);
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

    const visible = this.$fsui.formWrapper.visible;
    const vModel = {
      [visible]: this.formWrapperOpen,
      ["onUpdate:" + visible]: (value) => {
        this.formWrapperOpen = value;
      }
    };
    const vClosed = this.$fsui.formWrapper.buildOnClosedBind(is, this.onClosed);
    const customClass = `fs-form-wrapper ${this.formWrapperBind.customClass || ""}  ${
      this.fullscreen ? "fs-fullscreen" : ""
    }`;
    const vCustomClass = {
      [this.$fsui.formWrapper.customClass]: customClass
    };

    const vFullScreen = {
      fullscreen: this.fullscreen
    };

    const formWrapperComp = resolveDynamicComponent(is);
    return (
      <formWrapperComp
        {...vCustomClass}
        {...this.formWrapperBind}
        {...vModel}
        {...vClosed}
        {...vFullScreen}
        {...this.innerBind}
        v-slots={children}
      />
    );
  }
};
</script>
<style lang="less">
.fs-form-wrapper {
  display: flex;
  flex-direction: column;
  .fs-form-footer-btns {
    display: flex;
    margin-top: 20px;
    justify-content: flex-end;
    & > * {
      margin-left: 10px;
    }
  }

  .fs-form-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 40px;
    .fs-form-header-left {
      justify-items: flex-start;
    }
    .fs-form-header-right {
      justify-items: flex-end;
      color: #777;
      & > * {
        cursor: pointer;
      }
    }
  }
  &.fs-fullscreen {
    display: flex;
    flex-direction: column;
    .fs-form-wrapper-body {
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      padding: 24px;
      .fs-form-body {
        flex: 1;
        overflow: auto;
      }
    }
  }
}

//for antdv

.fs-form-wrapper {
  &.fs-fullscreen {
    &.ant-modal {
      width: 100% !important;
      height: 100% !important;
      top: 0 !important;
      padding: 0px;
      .ant-modal-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        .ant-modal-body {
          flex: 1;
          position: relative;
        }
      }
    }
  }
}

// for element
.fs-form-inner-wrapper {
  .el-overlay{
    position: absolute;
    .el-overlay-dialog{
      position: absolute;
    }
  }
}
.fs-form-wrapper {
  .el-dialog__header {
    padding: 20px 20px;
    border-bottom: 1px #eee solid;
  }
  .el-dialog__body {
    padding: 20px 20px;
  }

  .el-drawer__body {
    padding: 20px 20px;
  }

  .el-drawer__header {
    margin-bottom: 0px;
    padding: 20px 20px;
    border-bottom: 1px #eee solid;
  }
  .el-dialog__headerbtn {
    top: 23px;
  }

  .el-form-item__content {
    .el-input {
      width: 100%;
    }
    .el-select {
      width: 100%;
    }
  }

  &.fs-fullscreen {
    .el-dialog__body {
      position: relative;
      flex: 1;
    }
  }
}

// for naive
.n-modal-scroll-content {
  display: flex;
  flex-direction: column;
  .fs-form-wrapper.fs-fullscreen.n-modal {
    height: 100%;
    width: 100% !important;
    flex: 1;
    border-radius: 0;
  }

  .fs-form-wrapper {
    .n-card__content {
      position: relative;
    }
  }
}


// inner
// element 不需要

// naive-ui
.fs-form-inner-wrapper {
  .n-modal-container{
  position: unset;
  left: unset;
   top: unset;
   height: unset;
   width: unset
}
.n-modal-mask {
position: absolute;
}
.n-modal-body-wrapper{
position: absolute;
}
}

// antdv
.fs-form-inner-wrapper {
.ant-modal-mask {
position: absolute;
}
.ant-modal-wrap {
position: absolute;
}
}
</style>
