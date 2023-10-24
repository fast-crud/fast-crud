import {
  computed,
  defineComponent,
  getCurrentInstance,
  nextTick,
  onMounted,
  Ref,
  ref,
  resolveDynamicComponent,
  useSlots
} from "vue";
import _ from "lodash-es";
import { useI18n } from "../../locale";
import { uiContext } from "../../ui";
import { Constants } from "../../utils/util.constants";
import "./fs-form-wrapper.less";
import { useDrag, useMerge } from "../../use";
import {
  FormProps,
  FormWrapperContext,
  FormWrapperProps,
  OpenDialogProps,
  SetFormDataOptions,
  WriteableSlots
} from "../../d";

/**
 * 表单对话框|抽屉
 * 暴露方法：
 * open(options)
 */
export default defineComponent({
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
    innerWrapper: {},

    id: {},

    zIndex: {}
  },
  emits: ["reset", "submit", "validationError", "value-change", "open", "opened", "mounted", "closed", "inner-change"],
  setup(props: any, ctx: any) {
    const { t } = useI18n();
    const { merge } = useMerge();
    const formWrapperOpen: Ref<boolean> = ref(false);
    const formWrapperIs: Ref<string> = ref();
    const formOptions: Ref<FormProps> = ref();
    const formWrapperBind: Ref = ref();
    const formWrapperOpts: Ref<FormWrapperProps> = ref();
    const formRef: Ref = ref();
    const loading: Ref<boolean> = ref(false);

    const emitOnClosed: Ref = ref();
    const emitOnOpened: Ref = ref();
    const title: Ref<string> = ref();
    const formWrapperId = props.id || Math.floor(Math.random() * 1000000) + "";
    const formWrapperIdClass = "fs-form-wrapper_" + formWrapperId;

    const formWrapperSlots: Ref<WriteableSlots> = ref({});

    function buildEvent(): FormWrapperContext {
      return {
        wrapper: formWrapperBind.value,
        options: formOptions.value,
        formRef: formRef.value,
        form: getFormData(),
        wrapperBindRef: formWrapperBind,
        formOptionsRef: formOptions,
        setFormData,
        getFormData,
        close,
        toggleFullscreen,
        submit
      };
    }

    const open = async (opts: OpenDialogProps) => {
      //提取formrapper的配置
      const { wrapper } = opts;
      if (wrapper.onOpen) {
        wrapper.onOpen(opts);
      }
      title.value = wrapper.title;
      formWrapperIs.value = opts.wrapper.is;
      formWrapperOpts.value = wrapper;
      const customClassKey = ui.formWrapper.customClass(formWrapperIs.value as string);
      const customClass = `fs-form-wrapper ${formWrapperIdClass} ${wrapper[customClassKey] || ""} `;

      formWrapperBind.value = {
        ..._.omit(wrapper, "title", "onOpen", "onClosed", "onOpened", "is", "inner"),
        [customClassKey]: customClass
      };

      //form的配置
      formOptions.value = {
        ..._.omit(opts, "wrapper", "slots"),
        slots: {
          ...props.slots,
          ...opts.slots
        }
      };

      formWrapperSlots.value = {
        ...props.slots,
        ...opts.wrapper?.slots
      };

      // 发射打开事件
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

      /**
       * 是否内部打开对话框
       */
      ctx.emit("inner-change", !!formWrapperOpts.value.inner);

      // 打开表单对话框
      return new Promise(async (resolve, reject) => {
        await nextTick();
        formWrapperOpen.value = true;
        await nextTick();
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
      ctx.emit("closed");
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

    const onValueChange = (e: any) => {
      ctx.emit("value-change", e);
    };

    async function submit() {
      loading.value = true;
      try {
        await formRef.value.submit();
        close();
      } finally {
        loading.value = false;
      }
    }

    async function reset() {
      await formRef.value.reset();
    }

    function getFormData() {
      return formRef.value?.getFormData();
    }
    function setFormData(form: any, options?: SetFormDataOptions) {
      formRef.value?.setFormData(form, options);
    }

    const computedButtons = computed(() => {
      const defBtns = {
        cancel: {
          text: t("fs.form.cancel"),
          onClick: () => {
            close();
          }
        },
        reset: {
          text: t("fs.form.reset"),
          onClick: () => {
            reset();
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
      const buttons = merge(defBtns, formWrapperBind.value?.buttons);
      const buttonsArr: any = [];
      _.forEach(buttons, (value, key) => {
        value.key = key;
        buttonsArr.push(value);
        if (value.onClick == null && value.click != null) {
          value.onClick = () => {
            value.click(buildEvent());
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
      ctx.emit("mounted", getCurrentInstance().exposed);
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

    ctx.expose({
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
      innerBind,
      formWrapperSlots
    });

    const slots = useSlots();

    return () => {
      if (!formWrapperBind.value) {
        return null;
      }
      const ui = uiContext.get();
      let children = {};
      const _slots: any = { ...slots, ...formWrapperSlots.value };
      const slotsRender = (key: string, scope: any, slots = _slots) => {
        if (!slots[key]) {
          return null;
        }
        return slots[key](scope);
      };
      const is = formWrapperIs.value || "el-dialog";
      if (formOptions.value) {
        const { index, mode } = formOptions.value || {};
        const scope = { _self: this, index, mode, getFormData: getFormData };
        children = {
          [ui.formWrapper.titleSlotName]: () => {
            let fullScreenIcon = null;
            if (fullscreenEnabled.value) {
              fullScreenIcon = (
                <fs-icon
                  class="fs-fullscreen-icon"
                  onClick={toggleFullscreen}
                  icon={fullscreen.value ? ui.icons.fullScreen : ui.icons.unFullScreen}
                />
              );
            }
            return (
              <div class={"fs-form-header"}>
                <div class={"fs-form-header-left"}>
                  {slotsRender("form-header-left", scope)}
                  {title.value}
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
            const buttons: any[] = [];
            _.forEach(computedButtons.value, (item: any) => {
              if (item.show === false) {
                return;
              }
              buttons.push(<fs-button {...item} />);
            });
            return (
              <div class={"fs-form-wrapper-body"}>
                <div class={"fs-form-body"}>
                  {slotsRender("form-body-top", scope)}
                  <fs-form ref={formRef} {...formOptions.value} onValueChange={onValueChange} />
                  {slotsRender("form-body-bottom", scope)}
                </div>
                <div class={"fs-form-footer-btns"}>
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
        [visible]: formWrapperOpen.value,
        ["onUpdate:" + visible]: (value: any) => {
          formWrapperOpen.value = value;
        }
      };
      const vClosed = ui.formWrapper.buildOnClosedBind(is, onClosed);

      const customClassKey = ui.formWrapper.customClass(is);
      const fullscreenClassKey = fullscreen.value ? "fs-fullscreen" : "";
      const customClass = `${fullscreenClassKey} ${formWrapperBind.value[customClassKey] || ""}`;
      const vCustomClass = {
        [customClassKey]: customClass
      };

      const vFullScreen = {
        fullscreen: fullscreen.value
      };

      const vStyle = {
        zIndex: formWrapperBind.value.zIndex || props.zIndex
      };

      const formWrapperComp = resolveDynamicComponent(is);
      return (
        <formWrapperComp
          {...formWrapperBind.value}
          {...vCustomClass}
          {...vModel}
          {...vClosed}
          {...vFullScreen}
          {...innerBind.value}
          {...vStyle}
          v-slots={children}
        />
      );
    };
  }
});
