import { computed, ComputedRef, defineComponent, defineExpose, PropType, ref } from "vue";
import { uiContext } from "../../../ui";
import { useCompute } from "../../../use/use-compute";
import { EditableCell, EditableProps, EditableUpdateCellRequest } from "../../../d";
/**
 * 可编辑单元格组件
 */
export default defineComponent({
  name: "FsEditableCell",
  inheritAttrs: false,
  props: {
    /**
     * 组件配置
     */
    item: {},
    scope: {},
    index: {},
    editableId: {},
    columnKey: {},
    editableCell: {
      type: Object as PropType<EditableCell>
    },
    editableOpts: {
      type: Object as PropType<EditableProps>
    },
    slots: {},
    disabled: {},
    readonly: {}
  },
  setup(props: any, ctx: any) {
    const ui = uiContext.get();
    // const getEditable = inject("get:editable");
    const { doComputed } = useCompute();

    // let editable = getEditable(props.index, props.columnKey);
    if (props.index === -1) {
      //fix element plus
      return () => {};
    }

    const getFormRefFunc = () => {
      return props.editableCell?.getForm();
    };

    const computedForm = doComputed(getFormRefFunc, () => {
      return props.scope;
    });

    const computedIsEditable: ComputedRef<EditableUpdateCellRequest> = computed(() => {
      return computedForm.value && computedForm.value.show !== false && props.editableCell?.isEditable();
    });

    function editingUpdate(active: boolean) {
      if (active) {
        if (computedIsEditable.value) {
          props.editableCell.active();
        }
      }
    }
    async function onSubmit() {
      if (props.editableOpts?.mode === "free") {
        await props.editableCell.persist();
        return;
      }
      await props.editableCell.save();
    }
    function onCancel() {
      props.editableCell.cancel();
    }

    const showAction: ComputedRef<boolean> = computed(() => {
      // console.log(props.editableOpts?.mode, props.editableOpts.showAction, props.editableCell.showAction);
      return (
        (props.editableOpts?.mode === "cell" || props.editableOpts?.mode === "free") &&
        props.editableCell.showAction !== false
      );
    });
    const isDirty: ComputedRef<boolean> = computed(() => {
      return props.editableCell.isChanged && props.editableCell.isChanged();
    });

    const scopeFunc = () => {
      return props.scope;
    };

    //拦截v-model
    const slots = {
      default: () => {
        return <fs-cell ref={"targetRef"} item={props.item} scope={props.scope} slots={props.slots} {...ctx.attrs} />;
      },
      edit: () => {
        let inputComponent: any = null;
        if (props.editableCell?.isEditing) {
          if (computedForm.value.blank === false || computedForm.value.component?.show === false) {
            inputComponent = null;
          } else if (
            computedForm.value.conditionalRender &&
            computedForm.value.conditionalRender.match &&
            computedForm.value.conditionalRender.match(scopeFunc())
          ) {
            inputComponent = (
              <fs-render render-func={computedForm.value.conditionalRender.render} scope={scopeFunc()} {...ctx.attrs} />
            );
          } else if (computedForm.value.render) {
            inputComponent = <fs-render render-func={computedForm.value.render} scope={scopeFunc()} {...ctx.attrs} />;
          } else {
            inputComponent = (
              <fs-component-render
                ref={"targetInputRef"}
                {...computedForm.value.component}
                {...ctx.attrs}
                scope={props.scope}
              />
            );
          }
        }
        return inputComponent;
      }
    };

    return () => {
      if (!computedIsEditable.value || props.disabled || props.readonly) {
        return <fs-cell ref={"targetRef"} item={props.item} scope={props.scope} {...ctx.attrs} />;
      }
      const editableCell: EditableCell = props.editableCell;
      const trigger = showAction.value ? props.editableOpts?.activeTrigger : false;
      return (
        <fs-editable
          ref={"editableRef"}
          class={"fs-editable-cell"}
          editing={editableCell?.isEditing}
          showAction={showAction.value}
          dirty={isDirty.value}
          v-slots={slots}
          onUpdate:editing={editingUpdate}
          onSubmit={onSubmit}
          onCancel={onCancel}
          loading={editableCell?.loading}
          trigger={trigger}
          validateErrors={editableCell?.validateErrors}
        />
      );
    };
  },
  methods: {
    getTargetRef() {
      //@ts-ignore
      return this.$refs.targetInputRef?.getTargetRef() || this.$refs.targetRef;
    }
  }
});
