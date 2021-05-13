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
        mode: "", //模式，add,edit
        editType: "" // row,col,cell,all
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
    cell.activeEditMode = () => {
      if (computedEditable.value.editType === "all") {
        inActiveAll();
      }
      cell.isEditing = true;
      if (cell.oldValue === undefined) {
        cell.oldValue = getValue(index, key);
      }
    };
    cell.inActiveEditMode = () => {
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

  function inActiveAll() {
    _.forEach(editableRows, (row) => {
      _.forEach(row, (cell) => {
        if (cell.isEditing) {
          cell.inActiveEditMode();
        }
      });
    });
  }

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

  function persist() {
    inActiveAll();
    _.forEach(editableRows, (row, index) => {
      _.forEach(row, (cell, key) => {
        // setValue(index, key, cell.newValue);
        delete cell.newValue;
        delete cell.oldValue;
      });
    });
  }

  function resume() {
    inActiveAll();
    _.forEach(editableRows, (row, index) => {
      _.forEach(row, (cell, key) => {
        cell.resume();
      });
    });
  }
  async function submit(call) {
    inActiveAll();
    const changed = getChangedData();
    await call(changed);
    persist();
  }

  return {
    editable: {
      editableRows,
      inActiveAll,
      getChangedData,
      persist,
      submit,
      resume
    }
  };
}
