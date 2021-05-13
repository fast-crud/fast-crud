import { inject } from "vue";
import "./fs-editable-cell.less";
import { uiContext } from "../../../ui";
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
    component: {},
    /**
     * 获取scope参数方法
     */
    getScope: {
      type: Function
    },
    index: {},
    columnKey: {}
  },
  setup(props, ctx) {
    const ui = uiContext.get();
    const getEditable = inject("get:editable");
    let editable = getEditable(props.index, props.columnKey);

    return () => {
      if (editable.isEditing) {
        return (
          <div class={"fs-cell-edit"}>
            <div class={"fs-cell-edit-input"}>
              <fs-component-render ref={"targetInputRef"} {...editable.getForm().component} {...ctx.attrs} />
            </div>
            <div class={"fs-cell-edit-action"}>
              <fs-button size={"mini"} icon={ui.icons.check} onClick={editable.inActive} />
              <fs-button size={"mini"} icon={ui.icons.close} onClick={editable.resume} />
            </div>
          </div>
        );
      }
      let dirty = null;
      if (editable.isChanged && editable.isChanged()) {
        dirty = <div class={"fs-cell-edit-dirty"} />;
      }
      return (
        <div class={"fs-cell-format"} onClick={editable.active}>
          {dirty}
          <fs-cell ref={"targetRef"} component={props.component} getScope={props.getScope} {...ctx.attrs} />
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
