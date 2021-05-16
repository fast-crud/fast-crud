import _ from "lodash-es";
import { reactive, computed, provide, nextTick, ref, watch } from "vue";
export function useEditable(props, ctx, tableRef) {
  const editableRows = reactive([]);
  function editableRowsEach(call) {
    for (let i = 0; i < editableRows.length; i++) {
      const row = editableRows[i];
      const cells = row.cells;
      const rowData = tableRef.value.data[i];
      const res = call({ rowData, row, cells, index: i });
      if (res === "break") {
        return;
      }
    }
  }
  function editableEach(call) {
    editableRowsEach(({ rowData, row, cells, index }) => {
      _.forEach(cells, (cell, key) => {
        call({ rowData, row, cells, cell, index, key });
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
        exclusive: true, //是否排他式激活，激活一个，关闭其他
        activeMode: "click", //激活触发方式,click,dbclick
        activeDefault: false,
        isEditable({ index, key, row }) {
          return true;
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

  function buildEditableCell(tableRow, key, index) {
    function getValue(key) {
      return tableRow[key];
    }
    function setValue(key, value) {
      tableRow[key] = value;
    }
    const cell = reactive({
      isEditing: options.value.activeDefault
    });
    cell.isEditable = () => {
      return options.value.isEditable({ index, key, row: tableRow });
    };
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
      const exclusive = opts.exclusive ?? options.value.exclusive;
      if (exclusive) {
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
    const cells = {};
    _.forEach(props.columns, (item) => {
      cells[item.key] = buildEditableCell(rowData, item.key, index);
    });
    editableRows[index] = reactive({ cells });
    return editableRows[index];
  }
  function unshiftEditableRow(rowData) {
    editableRows.unshift({ cells: {} });
    return setEditableRow(0, rowData);
  }
  function setupEditable(data) {
    _.forEach(data, (rowData, index) => {
      setEditableRow(index, rowData);
    });
    //setupRowHandle();
  }
  // function setupRowHandle() {
  //   const editableButtons = {
  //     save: {
  //       text: "保存",
  //       click(scope) {}
  //     },
  //     remove: {}
  //   };
  //   _.merge(tableRef.value.rowHandle, { active: "editable", group: { buttons: editableButtons } });
  // }
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
    return editableRows[index]?.cells[key];
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
    editableRowsEach(({ rowData, cells }) => {
      const id = rowData[options.value.rowKey];
      const changed = { [options.value.rowKey]: id };
      let hasChange = false;
      _.forEach(cells, (cell, key) => {
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
    function setData(data) {
      _.forEach(data, (row, index) => {
        _.merge(tableRef.value.data[index], row);
      });
    }
    await call({ changed, setData });
    persist();
  }

  function hasDirty() {
    let dirty = false;
    editableRowsEach(({ cells }) => {
      _.forEach(cells, (cell) => {
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
    const firstRow = unshiftEditableRow(row);
    firstRow.isAdd = true;
    _.forEach(firstRow.cells, (cell, key) => {
      cell.active({ exclusive: false });
    });
  }
  function removeRow(index) {
    tableRef.value.data.splice(index, 1);
    editableRows.splice(index, 1);
  }

  function editCol({ cols }) {
    editableRowsEach(({ cells }) => {
      _.forEach(cols, (key) => {
        cells[key].active({ exclusive: false });
      });
    });
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
      editCol,
      hasDirty,
      getEditableCell
    }
  };
}
