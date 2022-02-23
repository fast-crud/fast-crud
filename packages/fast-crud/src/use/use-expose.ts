import { toRaw, nextTick } from "vue";
import { CrudExpose } from "../d.ts/expose";
import _ from "lodash-es";
import logger from "../utils/util.log";
import { useMerge } from "../use/use-merge";
import { useUi } from "../use/use-ui";
import { useI18n } from "../locale";

const { merge } = useMerge();
export type UseExposeProps = {
  crudRef;
  crudBinding;
};

export type UseEditableProps = {
  crudExpose;
};

function useEditable({ crudExpose }) {
  const { crudBinding } = crudExpose;
  const { ui } = useUi();
  const { t } = useI18n();
  const editable = {
    /**
     * 启用编辑
     * @param opts
     * @param onEnabled 默认根据mode切换rowHandle.active,[editRow,editable]
     */
    async enable(opts, onEnabled: Function) {
      const editableOpts = crudBinding.value.table.editable;
      _.merge(editableOpts, { enabled: true }, opts);
      if (onEnabled) {
        onEnabled({ editable: editableOpts });
      } else {
        if (editableOpts.mode === "row") {
          crudBinding.value.rowHandle.active = "editRow";
        } else {
          crudBinding.value.rowHandle.active = "editable";
        }
      }
    },
    /**
     * 禁用编辑
     */
    disable() {
      crudExpose.getTableRef()?.editable.resume();
      crudBinding.value.table.editable.enabled = false;
      crudBinding.value.rowHandle.active = "default";
    },
    /**
     * 激活所有编辑
     */
    active() {
      crudExpose.getTableRef().editable.active();
    },
    /**
     * 退出编辑
     */
    inactive() {
      crudExpose.getTableRef().editable.inactive();
    },
    /**
     * 添加行
     */
    addRow(opts) {
      crudExpose.getTableRef().editable.addRow(opts);
    },
    editCol(opts) {
      crudExpose.getTableRef().editable.editCol(opts);
    },
    /**
     * 还原，取消编辑
     */
    resume() {
      crudExpose.getTableRef().editable.resume();
    },
    removeRow(index) {
      crudExpose.getTableRef().editable.removeRow(index);
    },
    getEditableRow(index) {
      return crudExpose.getTableRef()?.editable?.getEditableRow(index);
    },
    async doSaveRow({ index }) {
      const editableRow = editable.getEditableRow(index);
      editableRow.save({
        index,
        async doSave({ isAdd, changed, row, setData }) {
          if (crudBinding.value.mode.name === "local") {
            return;
          }
          try {
            editableRow.isLoading = true;
            if (isAdd) {
              const ret = await crudBinding.value.request.addRequest({ form: changed });
              setData(ret);
            } else {
              await crudBinding.value.request.editRequest({ form: changed, row });
            }
          } finally {
            editableRow.isLoading = false;
          }
        }
      });
    },
    async doCancelRow({ index }) {
      const editableRow = editable.getEditableRow(index);
      editableRow.inactive();
    },
    async doRemoveRow({ index }) {
      try {
        await ui.messageBox.confirm({
          title: t("fs.rowHandle.remove.confirmTitle"), // '提示',
          message: t("fs.rowHandle.remove.confirmMessage"), // '确定要删除此记录吗?',
          type: "warn"
        });
      } catch (e) {
        // @ts-ignore
        logger.info("delete canceled", e.message);
        return;
      }
      const row = editable.getEditableRow(index);
      if (row.isAdd) {
        editable.removeRow(index);
      } else {
        if (crudBinding.value.mode.name === "local") {
          // do nothing
        } else {
          const rowData = row.getRowData(index);
          if (crudExpose.crudRef.value.modelValue) {
            crudExpose.crudRef.value.modelValue.splice(index, 1);
          } else {
            await crudBinding.value.request.delRequest({ row: rowData });
          }
          crudExpose.doRefresh();
        }
      }
      ui.notification.success(t("fs.rowHandle.remove.success"));
    },
    getInstance() {
      crudExpose.getTableRef().editable;
    }
  };
  return editable;
}

/**
 *
 * @param props
 */
export function useExpose(props: UseExposeProps): { expose: CrudExpose; crudExpose: CrudExpose } {
  const { crudRef, crudBinding } = props;
  const { ui } = useUi();
  const { t } = useI18n();
  const crudExpose: CrudExpose = {
    crudRef,
    crudBinding,

    getFormWrapperRef() {
      return crudRef.value.formWrapperRef;
    },
    getFormRef: () => {
      const formWrapperRef = crudExpose.getFormWrapperRef();
      return formWrapperRef?.formRef;
    },
    getFormData: () => {
      const formRef = crudExpose.getFormRef();
      return formRef?.getFormData();
    },
    getFormComponentRef(key, isAsync = false) {
      const formRef = crudExpose.getFormRef();
      return formRef?.getComponentRef(key, isAsync);
    },
    doValueBuilder(records, columns) {
      if (columns == null) {
        columns = toRaw(crudBinding.value.columns);
      }
      logger.debug("doValueBuilder ,columns=", columns);
      const valueBuilderColumns = _.filter(columns, (column) => {
        return column.valueBuilder != null;
      });
      if (valueBuilderColumns.length === 0) {
        return;
      }
      _.forEach(records, (row, index) => {
        _.forEach(valueBuilderColumns, (builder) => {
          builder.valueBuilder({
            value: row[builder.key],
            row,
            index,
            key: builder.key,
            column: builder.column
          });
        });
      });
      logger.debug("valueBuilder success:", records);
    },
    doValueResolve({ form }, columns) {
      if (columns == null) {
        columns = toRaw(crudBinding.value.columns);
      }
      logger.debug("doValueResolve ,columns=", columns);
      _.forEach(columns, (column, key) => {
        if (column.valueResolve) {
          column.valueResolve({
            value: form[key],
            row: form,
            form,
            key,
            column
          });
        }
      });
      logger.debug("valueResolve success:", form);
    },
    getSearchFormData() {
      if (!crudRef.value) {
        return {};
      }
      if (crudRef.value.getSearchFormData) {
        return crudRef.value.getSearchFormData();
      }
      return {};
    },
    /**
     * {form,mergeForm}
     */
    setSearchFormData(context: { form: any; mergeForm?: boolean }) {
      crudRef.value.setSearchFormData(context);
    },
    async doRefresh() {
      let page;
      if (crudBinding.value.pagination) {
        page = {
          currentPage: crudBinding.value.pagination[ui.pagination.currentPage],
          pageSize: crudBinding.value.pagination.pageSize
        };
      }
      const searchFormData = _.cloneDeep(crudExpose.getSearchFormData());
      //配置searchValueResolve
      if (crudBinding.value?.search?.columns) {
        crudExpose.doValueResolve({ form: searchFormData }, toRaw(crudBinding.value.search.columns));
      }
      crudExpose.doValueResolve({ form: searchFormData });

      const sort = crudBinding.value.sort || {};
      let query = { page, form: searchFormData, sort };
      if (crudBinding.value.request.transformQuery) {
        query = crudBinding.value.request.transformQuery(query);
      }

      let pageRes;
      if (props.crudRef.value.modelValue) {
        pageRes = await new Promise((resolve) => {
          nextTick(() => {
            resolve({
              records: props.crudRef.value.modelValue
            });
          });
        });
      } else {
        try {
          crudBinding.value.table.loading = true;
          logger.debug("pageRequest", query);
          pageRes = await crudBinding.value.request.pageRequest(query);
        } finally {
          crudBinding.value.table.loading = false;
        }
        if (pageRes == null) {
          logger.warn("pageRequest返回结果不能为空");
          return;
        }

        if (crudBinding.value.request.transformRes) {
          pageRes = crudBinding.value.request.transformRes({
            res: pageRes,
            query
          });
        }
      }
      const { currentPage = page[ui.pagination.currentPage], pageSize = page.pageSize, total } = pageRes;
      const { records } = pageRes;
      if (records == null) {
        logger.warn(
          "pageRequest返回结构不正确，请配置request.transformRes，期望：{currentPage, pageSize, total, records:[]},实际返回：",
          pageRes
        );
        return;
      }

      //valueBuild
      crudExpose.doValueBuilder(records);

      crudBinding.value.data = records;
      if (crudBinding.value.pagination) {
        crudBinding.value.pagination[ui.pagination.currentPage] = currentPage;
        crudBinding.value.pagination.pageSize = pageSize;
        crudBinding.value.pagination[ui.pagination.total] = total || records.length;
      }
    },
    doPageTurn(no: number) {
      crudBinding.value.pagination[ui.pagination.currentPage] = no;
    },
    /**
     *
     * @param opts = {
     *   form
     *   goFirstPage =true
     *   mergeForm=false
     * }
     */
    async doSearch(opts) {
      logger.debug("do search:", opts);
      opts = merge({ goFirstPage: true }, opts);
      if (opts.goFirstPage) {
        crudExpose.doPageTurn(1);
      }
      if (opts.form && crudRef.value) {
        crudRef.value.setSearchFormData(opts);
      }

      await crudExpose.doRefresh();
    },
    /**
     * 获取FsTable实例
     */
    getTableRef() {
      return crudRef.value?.tableRef;
    },
    /**
     * 获取表格数据
     */
    getTableData() {
      return crudBinding.value.data;
    },
    setTableData(data) {
      crudBinding.value.data = data;
    },
    insertTableRow(index, row) {
      crudBinding.value.data.splice(index, 0, row);
    },
    updateTableRow(index, row, merge = true) {
      if (merge) {
        crudBinding.value.data[index] = _.merge(crudBinding.value.data[index], row);
      } else {
        crudBinding.value.data[index] = row;
      }
    },
    removeTableRow(index) {
      crudBinding.value.data.splice(index);
    },
    getTableDataRow(index) {
      const data = crudExpose.getTableData();
      if (data == null) {
        throw new Error("table data is not init");
      }
      if (data.length <= index) {
        throw new Error("index over array length");
      }
      return data[index];
    },
    /**
     * 选择某一行
     * @param index
     * @param row
     */
    doSelectCurrentRow({ row }) {
      const tableRef = crudExpose.getTableRef();
      tableRef.value.setCurrentRow(row);
    },
    /**
     * 删除行按钮
     * @param context
     */
    async doRemove(context = {}) {
      try {
        await ui.messageBox.confirm({
          title: t("fs.rowHandle.remove.confirmTitle"), // '提示',
          message: t("fs.rowHandle.remove.confirmMessage"), // '确定要删除此记录吗?',
          type: "warn"
        });
      } catch (e) {
        // @ts-ignore
        logger.info("delete canceled", e.message, e);
        return;
      }
      if (crudBinding.value.mode?.name === "local") {
        crudExpose.removeTableRow(context.index);
      } else {
        await crudBinding.value.request.delRequest(context);
      }
      ui.notification.success(t("fs.rowHandle.remove.success"));
      await crudExpose.doRefresh();
    },
    /**
     *
     * 打开表单对话框
     * @param context ={mode, initialForm: row, index,...formOptions}
     */
    async openDialog(context = {}) {
      this.getFormWrapperRef().open(context);
    },
    async openAdd(context: any = {}) {
      const mode = "add";
      let row = context.row;
      if (crudBinding.value?.request?.infoRequest) {
        row = await crudBinding.value.request.infoRequest({ mode, row });
      }
      const options = {
        mode,
        initialForm: row || {},
        ...crudBinding.value.addForm
      };
      _.merge(options, context);
      this.getFormWrapperRef().open(options);
    },
    async openEdit(context) {
      let row = context.row || context[ui.tableColumn.row];
      if (row == null && context.index != null) {
        row = crudExpose.getTableDataRow(context.index);
      }
      const mode = "edit";
      if (crudBinding.value?.request?.infoRequest) {
        row = await crudBinding.value.request.infoRequest({ mode, row });
      }
      const options = {
        mode,
        initialForm: row,
        ...crudBinding.value.editForm
      };
      _.merge(options, context);
      this.getFormWrapperRef().open(options);
    },
    async openView(context) {
      let row = context.row || context[ui.tableColumn.row];
      if (row == null && context.index != null) {
        row = crudExpose.getTableDataRow(context.index);
      }
      const mode = "view";
      if (crudBinding.value?.request?.infoRequest) {
        row = await crudBinding.value.request.infoRequest({ mode, row });
      }
      const options = {
        mode,
        initialForm: row,
        ...crudBinding.value.viewForm
      };
      _.merge(options, context);
      this.getFormWrapperRef().open(options);
    },
    editable: undefined
  };
  crudExpose.editable = useEditable({ crudExpose });
  return { expose: crudExpose, crudExpose: crudExpose };
}
