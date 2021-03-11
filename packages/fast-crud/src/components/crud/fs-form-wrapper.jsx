import {
  ref,
  resolveDynamicComponent,
  computed,
  nextTick,
  onMounted,
} from "vue";
import FsButton from "../basic/fs-button";
import traceUtil from "../../utils/util.trace";
import _ from "lodash-es";
import { useI18n } from "../../local";
import "./fs-form-wrapper.less";
import logger from "../../utils/util.log";
export default {
  name: "FsFormWrapper",
  // eslint-disable-next-line vue/no-unused-components
  components: { FsButton },
  props: {
    //默认打开配置，如果配置了options，则默认根据options自动打开
    options: {},
    slots: {},
  },
  emits: [
    "reset",
    "submit",
    "validationError",
    "value-change",
    "open",
    "opened",
    "closed",
  ],
  setup(props, ctx) {
    traceUtil.trace("fs-form-wrapper");
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
      const { wrapper } = opts;
      if (wrapper.onOpen) {
        wrapper.onOpen(opts);
      }
      title.value = wrapper.title;
      formWrapper.value = {
        ..._.omit(wrapper, "title", "onOpen", "onClosed", "onOpened"),
      };
      delete formWrapper.value.is;
      formWrapperIs.value = opts.wrapper.is;
      formOptions.value = {
        ..._.omit(opts, "wrapper"),
      };

      // 打开表单对话框
      formWrapperOpen.value = true;

      // 发射打开事件
      function buildEvent() {
        return {
          wrapper: formWrapper.value,
          options: formOptions.value,
          formRef: formRef.value,
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
      return formRef.value.getFormData();
    }
    function setFormData(form) {
      formRef.value = form;
    }

    const computedButtons = computed(() => {
      // TODO i18n
      const defBtns = {
        cancel: {
          text: t("fs.form.cancel"),
          onClick: () => {
            close();
          },
        },
        ok: {
          text: t("fs.form.ok"),
          type: "primary",
          onClick: () => {
            submit();
          },
          loading: loading.value,
        },
      };
      return _.merge(defBtns, formWrapper.value.buttons);
    });

    onMounted(() => {
      if (props.options != null) {
        open(props.options);
      }
    });

    const fullscreen = ref(false);
    function toggleFullscreen() {
      fullscreen.value = !fullscreen.value;
    }

    return {
      close,
      onClosed,
      onOpened,
      open,
      title,
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
      onValueChange,
    };
  },
  render() {
    if (!this.formWrapper) {
      return null;
    }
    logger.debug("formWrapper", this.formWrapper);
    let children = {};
    const _slots = { ...this.$slots, ...this.slots };
    const slotsRender = (key, scope, slots = _slots) => {
      if (!slots[key]) {
        return null;
      }
      return slots[key](scope);
    };
    const scope = { _self: this, ...this.formOptions };
    if (this.formOptions) {
      children = {
        title: () => {
          return (
            <div class={"fs-wrapper-title"}>
              {this.title}
              <div class={"fs-wrapper-title-right"}>
                <fs-icon
                  onClick={this.toggleFullscreen}
                  icon={this.fullscreen ? "CompressOutlined" : "ExpandOutlined"}
                />
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
                {slotsRender("form-body-before", scope)}
                <fs-form
                  ref="formRef"
                  {...this.formOptions}
                  onValueChange={this.onValueChange}
                />
                {slotsRender("form-body-after", scope)}
              </div>
              <div className="fs-form-footer-btns">
                {slotsRender("form-footer-prefix", scope)}
                {buttons}
                {slotsRender("form-footer-append", scope)}
              </div>
            </div>
          );
        },
      };
    }

    const is = this.formWrapperIs || "el-dialog";

    const visible = this.$fsui.formWrapper.visible;
    const vModel = {
      [visible]: this.formWrapperOpen,
      ["onUpdate:" + visible]: (value) => {
        this.formWrapperOpen = value;
      },
    };
    const vClosed = this.$fsui.formWrapper.buildOnClosedBind(is, this.onClosed);
    const vCustomClass = {
      [this.$fsui.formWrapper.customClass]: `fs-form-wrapper ${
        this.formWrapper.customClass || ""
      }  ${this.fullscreen ? "fs-fullscreen" : ""}`,
    };

    const formWrapperComp = resolveDynamicComponent(is);
    return (
      <formWrapperComp
        {...vCustomClass}
        {...this.formWrapper}
        {...vModel}
        {...vClosed}
        v-slots={children}
      />
    );
  },
};
