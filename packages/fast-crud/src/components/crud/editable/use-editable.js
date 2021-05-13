import _ from "lodash-es";
import { reactive, computed, provide } from "vue";
export function useEditable(props, ctx, tableRef) {
  // editable
  const editableRows = reactive({});

  const computedEditable = computed(() => {
    return _.merge(
      {
        rowKey: "id",
        enabled: false,
        form: {},
        mode: "edit", //模式，add,edit
        editType: "all", // row,col,cell,all
        activeMode: "click", //激活模式,click,dbclick,auto
        editScope: {
          //可编辑范围
          row: "*",
          col: "*",
          isDisabled: false
        }
      },
      props.editable
    );
  });

  function getValue(index, key) {
    const data = tableRef.value.data;
    if (data && data.length > index) {
      return data[index][key];
    }
    return null;
  }
  function setValue(index, key, value) {
    const data = tableRef.value.data;
    if (data && data.length > index) {
      data[index][key] = value;
    }
  }
  function getEditableCell(index, key) {
    if (key == null || index < 0) {
      return {};
    }
    const row = (editableRows[index] = editableRows[index] || reactive({}));
    const cell = (row[key] = reactive({
      isEditing: false
    }));

    cell.isChanged = () => {
      return cell.newValue !== cell.oldValue;
    };
    cell.getForm = () => {
      return computedEditable.value.form[key];
    };
    cell.active = () => {
      if (computedEditable.value.editType === "all") {
        inActive();
      }
      cell.isEditing = true;
      if (cell.oldValue === undefined) {
        cell.oldValue = getValue(index, key) || null;
      }
    };
    cell.inActive = () => {
      cell.isEditing = false;
      cell.newValue = getValue(index, key);
    };
    cell.resume = () => {
      cell.isEditing = false;
      if (cell.isChanged()) {
        setValue(index, key, cell.oldValue);
        delete cell.newValue;
        delete cell.oldValue;
      }
    };
    return cell;
  }

  provide("get:editable", (index, key) => {
    if (!computedEditable.value || !computedEditable.value.enabled) {
      return false;
    }
    return getEditableCell(index, key);
  });

  /**
   * 全部进入编辑状态
   */
  function active() {
    _.forEach(editableRows, (row) => {
      _.forEach(row, (cell) => {
        cell.active();
      });
    });
  }
  /**
   * 全部取消编辑状态
   */
  function inActive() {
    _.forEach(editableRows, (row) => {
      _.forEach(row, (cell) => {
        if (cell.isEditing) {
          cell.inActive();
        }
      });
    });
  }

  /**
   * 获取改变的数据
   * @returns {[]}
   */
  function getChangedData() {
    const changedRows = [];
    _.forEach(editableRows, (row, index) => {
      const id = getValue(index, computedEditable.value.rowKey);
      const changed = { [computedEditable.value.rowKey]: id };
      let hasChange = false;
      _.forEach(row, (cell, key) => {
        if (cell.isChanged()) {
          changed[key] = cell.newValue;
          hasChange = true;
        }
      });
      if (hasChange) {
        changedRows.push(changed);
      }
    });
    return changedRows;
  }

  /**
   * 固化
   */
  function persist() {
    inActive();
    _.forEach(editableRows, (row, index) => {
      _.forEach(row, (cell, key) => {
        // setValue(index, key, cell.newValue);
        delete cell.newValue;
        delete cell.oldValue;
      });
    });
  }

  /**
   * 还原
   */
  function resume() {
    inActive();
    _.forEach(editableRows, (row) => {
      _.forEach(row, (cell) => {
        cell.resume();
      });
    });
  }
  async function submit(call) {
    inActive();
    const changed = getChangedData();
    await call(changed);
    persist();
  }

  return {
    editable: {
      editableRows,
      inActive,
      active,
      getChangedData,
      persist,
      submit,
      resume
    }
  };
}
