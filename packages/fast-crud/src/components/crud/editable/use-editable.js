import _ from "lodash-es";
import { reactive, computed, provide, nextTick, ref, watch } from "vue";
export function useEditable(props, ctx, tableRef) {
  const editableRows = reactive([]);
  function getEditableRow(index) {
    return editableRows[index];
  }
  function editableRowsEach(call) {
    for (let i = 0; i < editableRows.length; i++) {
      const row = editableRows[i];
      const rowData = tableRef.value.data[i];
      const res = call({ rowData, row, index: i });
      if (res === "break") {
        return;
      }
    }
  }
  function editableEach(call) {
    editableRowsEach(({ rowData, row, index }) => {
      _.forEach(row, (cell, key) => {
        call({ rowData, row, cell, index, key });
      });
    });
  }
  // editable
  const options = computed(() => {
    return _.merge(
      {
        rowKey: "id",
        enabled: false,
        addForm: {},
        editForm: {},
        mode: "free", //模式，free，row，col
        inactiveOther: true, //独占模式
        activeMode: "click", //激活模式,click,dbclick,auto
        editScope: {
          //可编辑范围
          row: "*",
          col: "*",
          isDisabled: false
        },
        cell: {
          check: {},
          cancel: {},
          edit: {}
        }
      },
      props.editable
    );
  });

  function getTableRow(index) {
    return tableRef.value.data[index];
  }

  function buildEditableCell(tableRow, key) {
    function getValue(key) {
      return tableRow[key];
    }
    function setValue(key, value) {
      tableRow[key] = value;
    }
    const cell = reactive({
      isEditing: false
    });
    cell.isChanged = () => {
      return cell.newValue !== cell.oldValue;
    };
    cell.getForm = () => {
      let form = options.value[cell.mode + "Form"];
      if (form == null) {
        form = options.value.editForm;
      }
      return form[key];
    };
    cell.active = (opts = {}) => {
      const inactiveOther = opts.inactiveOther ?? options.value.inactiveOther;
      if (inactiveOther) {
        inactive();
      }
      cell.isEditing = true;
      if (cell.oldValue === undefined) {
        cell.oldValue = getValue(key);
      }
    };
    cell.inactive = () => {
      cell.isEditing = false;
      cell.newValue = getValue(key);
    };
    cell.resume = () => {
      cell.isEditing = false;
      if (cell.isChanged()) {
        setValue(key, cell.oldValue);
        delete cell.newValue;
        delete cell.oldValue;
      }
    };
    return cell;
  }

  function setEditableRow(index, rowData) {
    const row = {};
    _.forEach(props.columns, (item) => {
      row[item.key] = buildEditableCell(rowData, item.key);
    });
    editableRows[index] = reactive(row);
    return editableRows[index];
  }
  function unshiftEditableRow(rowData) {
    editableRows.unshift({});
    return setEditableRow(0, rowData);
  }
  function setupEditable(data) {
    _.forEach(data, (rowData, index) => {
      setEditableRow(index, rowData);
    });
  }
  watch(
    () => {
      return tableRef.value?.data;
    },
    (data) => {
      setupEditable(data);
    },
    {
      immediate: true
    }
  );
  function getEditableCell(index, key) {
    if (key == null || index < 0) {
      return {};
    }
    return editableRows[index][key];
  }

  provide("get:editable", (index, key) => {
    if (!options.value || !options.value.enabled) {
      return false;
    }
    return getEditableCell(index, key);
  });

  /**
   * 全部进入编辑状态
   */
  function active() {
    editableEach(({ cell }) => {
      cell.active();
    });
  }
  /**
   * 全部取消编辑状态
   */
  function inactive() {
    editableEach(({ cell }) => {
      if (cell.isEditing) {
        cell.inactive();
      }
    });
  }

  /**
   * 获取改变的数据
   * @returns {[]}
   */
  function getChangedData() {
    const changedRows = [];
    editableRowsEach(({ rowData, row }) => {
      const id = rowData[options.value.rowKey];
      const changed = { [options.value.rowKey]: id };
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
    inactive();
    editableRowsEach(({ row }) => {
      delete row.isAdd;
    });
    editableEach(({ cell }) => {
      delete cell.newValue;
      delete cell.oldValue;
    });
  }

  /**
   * 还原
   */
  function resume() {
    options.value.isRowMode = false;
    inactive();
    const willRemoveIndies = [];
    _.forEachRight(editableRows, (item, index) => {
      if (item.isAdd) {
        willRemoveIndies.push(index);
      }
    });
    _.forEach(willRemoveIndies, (index) => {
      removeRow(index);
    });
    editableEach(({ cell }) => {
      cell.resume();
    });
  }
  async function submit(call) {
    options.value.isRowMode = false;
    inactive();
    const changed = getChangedData();
    await call(changed);
    persist();
  }

  function hasDirty() {
    let dirty = false;
    editableRowsEach(({ row }) => {
      _.forEach(row, (cell) => {
        if (cell.isChanged()) {
          dirty = true;
          return "break";
        }
      });
    });
    return dirty;
  }
  function addRow(opts = {}) {
    const row = opts.row || {};
    tableRef.value.data.unshift(row);
    const editRow = unshiftEditableRow(row);
    editRow.isAdd = true;
    const firstRow = getEditableRow(0);
    _.forEach(firstRow, (cell, key) => {
      cell.active({ inactiveOther: false });
    });
  }
  function removeRow(index) {
    tableRef.value.data.splice(index, 1);
    editableRows.splice(index, 1);
  }

  return {
    editable: {
      options,
      inactive,
      active,
      getChangedData,
      persist,
      submit,
      resume,
      addRow,
      getEditableCell
    }
  };
}
