import {
  computed,
  defineComponent,
  getCurrentInstance,
  nextTick,
  onMounted,
  Ref,
  ref,
  resolveDynamicComponent,
  toRaw,
  unref,
  useSlots
} from "vue";
import { omit, forEach, sortBy } from "lodash-es";
import { useI18n } from "../../locale";
import { uiContext } from "../../ui";
import { Constants } from "../../utils/util.constants";
import "./fs-form-wrapper.less";
import { useCompute, useDrag, useMerge } from "../../use";
import {
  FormProps,
  FormScopeContext,
  FormWrapperContext,
  FormWrapperProps,
  OpenDialogProps,
  SetFormDataOptions,
  WriteableSlots
} from "../../d";
import utils from "../../utils";

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
    utils.trace("fs-form-wrapper");
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
    const beforeCloseCustom: Ref = ref();
    const title: Ref<string> = ref();
    const formWrapperId = props.id || Math.floor(Math.random() * 1000000) + "";
    const formWrapperIdClass = "fs-form-wrapper_" + formWrapperId;

    const formWrapperSlots: Ref<WriteableSlots> = ref({});

    function buildEvent(): FormWrapperContext {
      return {
        formWrapperId,
        formWrapperIdClass,
        close,
        doClose,
        onClosed,
        onOpened,
        open,
        title,
        fullscreenEnabled,
        fullscreen,
        formWrapperIs,
        formWrapperOpen,
        formWrapperBind,
        computedButtons,
        onValueChange,
        innerBind,
        formWrapperSlots,
        wrapper: formWrapperBind.value,
        options: formOptions.value,
        formRef: formRef.value,
        form: getFormData(),
        wrapperBindRef: formWrapperBind,
        formOptionsRef: formOptions,
        setFormData,
        getFormData,
        reset,
        loading,
        toggleFullscreen,
        submit,
        mode: formOptions.value?.mode
      };
    }

    const open = async (opts: OpenDialogProps) => {
      //提取formrapper的配置
      const { wrapper } = opts;
      if (wrapper.onOpen) {
        wrapper.onOpen(opts);
      }
      title.value = unref(wrapper.title);
      formWrapperIs.value = opts.wrapper.is;
      formWrapperOpts.value = wrapper;
      const customClassKey = ui.formWrapper.customClass(formWrapperIs.value as string);
      const customClass = `fs-form-wrapper ${formWrapperIdClass} ${wrapper[customClassKey] || ""} `;

      formWrapperBind.value = {
        ...omit(wrapper, "title", "onOpen", "onClosed", "onOpened", "is", "inner", "beforeClose"),
        [customClassKey]: customClass
      };

      //form的配置
      formOptions.value = {
        ...omit(opts, "wrapper", "slots"),
        slots: {
          ...props.slots,
          ...opts.slots,
          ...ctx.slots
        }
      };

      formWrapperSlots.value = {
        ...props.slots,
        ...opts.wrapper?.slots,
        ...ctx.slots
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

      beforeCloseCustom.value = wrapper.beforeClose;

      if (wrapper.fullscreen != null) {
        fullscreen.value = wrapper.fullscreen;
      }

      /**
       * 是否内部打开对话框
       */
      ctx.emit("inner-change", !!formWrapperOpts.value.inner);

      // 打开表单对话框
      await nextTick();
      formWrapperOpen.value = true;
      await nextTick();
      // opened事件
      onOpened();
      // 修复open执行完之后无返回的bug
      return buildEvent();
    };

    async function doSaveRemind() {
      const saveRemind = formWrapperOpts.value.saveRemind;
      const isDirty = formRef.value?.isDirty();
      if (isDirty && saveRemind) {
        let needSave = false;
        if (saveRemind instanceof Function) {
          needSave = await saveRemind();
        } else {
          try {
            await ui.messageBox.confirm({
              title: t("fs.form.saveRemind.title"),
              message: t("fs.form.saveRemind.content"),
              confirmButtonText: t("fs.form.saveRemind.ok"),
              cancelButtonText: t("fs.form.saveRemind.cancel")
            });
            needSave = true;
          } catch (e) {
            //用户取消
            needSave = false;
          }
        }
        //要保存
        if (needSave) {
          await submit();
        }
      }
    }

    async function beforeClose() {
      if (beforeCloseCustom.value) {
        const ret = beforeCloseCustom.value(buildEvent());
        if (ret == false) {
          return false;
        }
      }
      await doSaveRemind();
      return true;
    }

    const elementBeforeCloseFix = computed(() => {
      if (ui.type == "element") {
        return {
          beforeClose: (done: any) => {
            beforeClose().then((ret) => {
              if (ret) {
                done();
              }
            });
          }
        };
      }
      return {};
    });

    const close = async () => {
      formWrapperOpen.value = false;
    };
    const doClose = async () => {
      const ret = await beforeClose();
      if (ret == false) {
        return false;
      }
      close();
      return true;
    };

    const onClosed = () => {
      if (emitOnClosed.value) {
        emitOnClosed.value();
      }
      ctx.emit("closed");
      formOptions.value = null;
    };

    const onOpened = () => {
      if (emitOnOpened.value) {
        emitOnOpened.value();
      }
      if (formWrapperBind.value.draggable || formWrapperBind.value.dragenabled) {
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
        const success = await formRef.value.submit();
        if (success === false) {
          return;
        }
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

    const { doComputed } = useCompute();

    function getComputeContext() {
      return {
        row: formOptions.value?.initialForm,
        form: getFormData(),
        index: formOptions.value?.index,
        mode: formOptions.value?.mode,
        attrs: formOptions.value,
        getComponentRef(...args) {
          formRef.value?.getComponentRef(...args);
        }
      } as FormScopeContext;
    }
    const computedCustomButtons = doComputed(() => {
      return formWrapperBind.value?.buttons;
    }, getComputeContext);

    const computedButtons = computed(() => {
      const defBtns = {
        cancel: {},
        reset: {},
        ok: {
          loading: loading.value
        }
      };
      const buttons = merge(defBtns, computedCustomButtons.value);
      const buttonsArr: any = [];
      forEach(buttons, (value, key) => {
        value.key = key;
        buttonsArr.push(value);
        if (value.onClick == null && value.click != null) {
          value.onClick = () => {
            value.click(buildEvent());
          };
        }
      });
      return sortBy(buttonsArr, (item) => {
        return item.order ?? Constants.orderDefault;
      });
    });

    onMounted(async () => {
      if (props.options != null) {
        await open(props.options);
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
          if (formWrapperOpts.value.innerContainerSelector) {
            const container = document.querySelector(formWrapperOpts.value.innerContainerSelector);
            if (container) {
              container.classList.add("fs-form-inner-wrapper");
              return container;
            } else {
              console.error(`找不到选择器为${formWrapperOpts.value.innerContainerSelector}的元素`);
            }
          }
          return props.innerWrapper;
        }
      });
    });

    ctx.expose({
      formWrapperId,
      formWrapperIdClass,
      close,
      doClose,
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
      reset,
      computedButtons,
      loading,
      getFormData,
      setFormData,
      onValueChange,
      innerBind,
      formWrapperSlots,
      form: getFormData(),
      wrapperBindRef: formWrapperBind,
      formOptionsRef: formOptions,
      mode: formOptions.value?.mode
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
            forEach(computedButtons.value, (item: any) => {
              if (item.show === false) {
                return;
              }
              buttons.push(<fs-button {...item} />);
            });
            return (
              <div class={"fs-form-wrapper-body"}>
                <div class={"fs-form-body"}>
                  {slotsRender("form-body-top", scope)}
                  <div class={"fs-form-content"}>
                    {slotsRender("form-body-left", scope)}
                    <fs-form ref={formRef} {...formOptions.value} onValueChange={onValueChange} />
                    {slotsRender("form-body-right", scope)}
                  </div>

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
        ["onUpdate:" + visible]: async (value: any) => {
          if (value === false && formWrapperOpen.value) {
            return await doClose();
          }
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
          {...elementBeforeCloseFix.value}
          v-slots={children}
        />
      );
    };
  }
});
