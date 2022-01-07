<script lang="jsx">
import { computed } from "vue";
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

    const refForm = computed(() => {
      return props.editable?.getForm();
    });

    let computedForm = doComputed(refForm, props.getScope);

    let computedIsEditable = computed(() => {
      return computedForm.value && computedForm.value.show !== false && props.editable?.isEditable();
    });

    return () => {
      if (!computedIsEditable.value) {
        return <fs-cell ref={"targetRef"} item={props.item} getScope={props.getScope} {...ctx.attrs} />;
      }
      const editable = props.editable;

      if (editable?.isEditing) {
        let editIcon = null;
        if (props.editable?.activeTrigger) {
          editIcon = (
            <div key={props.index} class={"fs-cell-edit-action"}>
              <fs-icon size={"mini"} icon={ui.icons.check} onClick={editable.inactive} />
              <fs-icon size={"mini"} icon={ui.icons.close} onClick={editable.resume} />
            </div>
          );
        }

        return (
          <div class={"fs-cell-edit"}>
            <div class={"fs-cell-edit-input"}>
              <fs-component-render ref={"targetInputRef"} {...computedForm.value.component} {...ctx.attrs} />
            </div>
            {editIcon}
          </div>
        );
      }

      let dirty = null;
      if (editable.isChanged && editable.isChanged()) {
        dirty = <div class={"fs-cell-edit-dirty"} />;
      }

      let activeTrigger = {};
      let actions = null;
      if (props.editable?.activeTrigger) {
        activeTrigger = {
          [props.editable?.activeTrigger]: () => {
            if (computedIsEditable.value) {
              props.editable.active();
            }
          }
        };
        actions = (
          <div class={"fs-cell-edit-action fs-cell-edit-icon"}>
            <fs-icon icon={ui.icons.edit} />
          </div>
        );
      }
      return (
        <div key={props.index} class={"fs-cell-edit"} {...activeTrigger}>
          <div class={"fs-cell-edit-input"}>
            {dirty}
            <fs-cell ref={"targetRef"} item={props.item} getScope={props.getScope} {...ctx.attrs} />
          </div>
          {actions}
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
</script>
<style lang="less">
.fs-crud-table {
  .fs-cell-edit {
    display: flex;
    width: 100%;
    align-items: center;
    min-height: 23px;
    .fs-cell-edit-dirty {
      border-radius: 100px;
      width: 5px;
      height: 5px;
      margin-left: -5px;
      background: red;
    }
    .fs-cell-edit-input {
      flex: 1;
    }
    .fs-cell-edit-action {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-left: 10px;
      i,
      .anticon {
        width: 20px;
        text-align: center;
        font-size: 16px;
        cursor: pointer;
      }
    }

    .fs-cell-edit-icon {
      visibility: hidden;
    }
    &:hover .fs-cell-edit-icon {
      visibility: visible;
    }

    .el-radio {
      margin-right: 5px;
      .el-radio__label {
        padding: 2px;
      }
    }
  }
}
</style>
