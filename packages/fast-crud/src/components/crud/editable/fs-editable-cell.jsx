import { computed } from "vue";
import "./fs-editable-cell.less";
import { uiContext } from "../../../ui";
import { useCompute } from "../../../use/use-compute";
/**
 * 可编辑单元格组件
 */
export default {
  name: "FsEditableCell",
  inheritAttrs: false,
  props: {
    /**
     * 组件配置
     */
    item: {},
    /**
     * 获取scope参数方法
     */
    getScope: {
      type: Function
    },
    index: {},
    columnKey: {},
    editable: {}
  },
  setup(props, ctx) {
    const ui = uiContext.get();
    // const getEditable = inject("get:editable");
    const { doComputed } = useCompute();

    // let editable = getEditable(props.index, props.columnKey);
    if (props.index === -1) {
      return () => {};
    }
    let computedForm = doComputed(props.editable?.getForm(), props.getScope);

    let computedIsEditable = computed(() => {
      return computedForm.value.show !== false && props.editable?.isEditable();
    });
    function active() {
      if (computedIsEditable.value) {
        props.editable.active();
      }
    }
    return () => {
      if (!computedIsEditable.value) {
        return <fs-cell ref={"targetRef"} item={props.item} getScope={props.getScope} {...ctx.attrs} />;
      }
      const editable = props.editable;

      if (editable.isEditing) {
        return (
          <div class={"fs-cell-edit"}>
            <div class={"fs-cell-edit-input"}>
              <fs-component-render ref={"targetInputRef"} {...computedForm.value.component} {...ctx.attrs} />
            </div>
            <div class={"fs-cell-edit-action"}>
              <fs-icon size={"mini"} icon={ui.icons.check} onClick={editable.inactive} />
              <fs-icon size={"mini"} icon={ui.icons.close} onClick={editable.resume} />
            </div>
          </div>
        );
      }

      let dirty = null;
      if (editable.isChanged && editable.isChanged()) {
        dirty = <div class={"fs-cell-edit-dirty"} />;
      }

      return (
        <div class={"fs-cell-edit"} onClick={active}>
          <div class={"fs-cell-edit-input"}>
            {dirty}
            <fs-cell ref={"targetRef"} item={props.item} getScope={props.getScope} {...ctx.attrs} />
          </div>

          <div class={"fs-cell-edit-action fs-cell-edit-icon"}>
            <fs-icon icon={ui.icons.edit} />
          </div>
        </div>
      );
    };
  },
  methods: {
    getTargetRef() {
      return this.$refs.targetRef?.getTargetRef();
    }
  }
};
