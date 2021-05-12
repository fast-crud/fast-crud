import { inject } from "vue";
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
    key: {}
  },
  setup(props, ctx) {
    const getEditable = inject("get:editable");
    let editable = getEditable(props.index, props.key);

    console.log("cell editable", editable);
    return () => {
      if (editable.isEditing) {
        return <fs-component-render ref={"targetInputRef"} {...editable.getForm().component} {...ctx.attrs} />;
      }
      return (
        <div onClick={editable.activeEditMode}>
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
