import { onMounted, Ref, toRaw, unref, watch } from "vue";
import { CrudExpose, OpenDialogProps, OpenEditContext, SetFormDataOptions } from "../d/expose";
import { isArray, forEach, cloneDeep } from "lodash-es";
import logger from "../utils/util.log";
import { useMerge } from "../use/use-merge";
import { useUi } from "../use/use-ui";
import { useI18n } from "../locale";
import {
  ColumnCompositionProps,
  CrudBinding,
  DoRemoveContext,
  EditableEachCellsOpts,
  EditableEachRowsOpts,
  EditableSaveRowContext,
  Page,
  PageQuery,
  PageRes,
  RemoveProps,
  RowRecord,
  SearchOptions,
  UserPageQuery,
  UserPageRes
} from "../d";
import { useFormWrapper } from "./use-form";
import { forEachColumns } from "../use/use-columns";
import { Editable, EditableActiveColsOptions, EditableAddRowOptions } from "../d/expose-editable";

const { merge } = useMerge();
const doMerge = merge;
export type UseExposeProps<R = any> = {
  crudRef: Ref;
  crudBinding: Ref<CrudBinding<R>>;
};

export type UseExposeRet<R = any> = {
  expose: CrudExpose<R>;
  crudExpose: CrudExpose<R>;
};

export type UseEditableProps<R = any> = {
  crudExpose: CrudExpose<R>;
};

export type EditableOnEnabledProps = {
  editable: any;
};

function useEditable<R = any>(props: UseEditableProps<R>) {
  const { crudExpose } = props;
  const { crudBinding } = crudExpose;
  const { ui } = useUi();
  const { t } = useI18n();
  const { merge } = useMerge();

  watch(
    () => {
      return crudBinding.value?.table?.editable?.enabled;
    },
    (val) => {
      if (val) {
        if (crudBinding.value.table.editable.mode === "row") {
          crudBinding.value.rowHandle.active = "editRow";
        } else {
          crudBinding.value.rowHandle.active = "editable";
        }
      } else {
        crudBinding.value.rowHandle.active = "default";
      }
    }
  );
  const editable: Editable<R> = {
    /**
     * 启用编辑
     * @param opts
     */
    async enable(opts?: any, onEnabled?: (opts: EditableOnEnabledProps) => void) {
      const editableOpts = crudBinding.value.table.editable;
      merge(editableOpts, { enabled: true }, opts);
      if (onEnabled) {
        onEnabled({ editable: editableOpts });
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
    active(opts) {
      crudExpose.getTableRef().editable.active(opts);
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
    addRow(opts: EditableAddRowOptions) {
      crudExpose.getTableRef().editable.addRow(opts);
    },
    activeCols(opts: EditableActiveColsOptions) {
      crudExpose.getTableRef().editable.activeCols(opts);
    },
    /**
     * 还原，取消编辑
     */
    resume() {
      crudExpose.getTableRef().editable.resume();
    },
    /**
     * 还原，取消编辑,同resume
     */
    cancel() {
      crudExpose.getTableRef().editable.cancelAll();
    },
    /**
     * 本地保存，不提交到后台
     */
    persist() {
      crudExpose.getTableRef().editable.persist();
    },
    removeRow(editableId: any) {
      crudExpose.getTableRef().editable.removeRow(editableId);
    },
    getEditableRow(editableId: any) {
      return crudExpose.getTableRef()?.editable?.getEditableRow(editableId);
    },
    getActiveRows() {
      return crudExpose.getTableRef()?.editable?.getActiveRows();
    },
    async doSaveRow(opts: { editableId: any; row: any }) {
      let editableId = opts.editableId;
      if (!editableId) {
        const row = opts.row;
        editableId = row[crudBinding.value.table.editable.rowKey];
      }
      const editableRow = editable.getEditableRow(editableId);
      await editableRow.save({
        async doSave(opts: EditableSaveRowContext<R>) {
          const { isAdd, row, setData } = opts;
          const rowData = row;
          if (crudBinding.value?.mode?.name === "local") {
            return;
          }
          try {
            editableRow.loading = true;
            if (isAdd) {
              const ret = await crudBinding.value.request.addRequest({ form: rowData });
              setData(ret);
            } else {
              await crudBinding.value.request.editRequest({ form: rowData, row: rowData });
            }
          } finally {
            editableRow.loading = false;
          }
        }
      });
    },
    async doCancelRow(opts: { editableId: any; row: R }) {
      let editableId = opts.editableId;
      if (!editableId) {
        const row = opts.row;
        //@ts-ignore
        editableId = row[crudBinding.value.table.editable.rowKey];
      }

      const editableRow = editable.getEditableRow(editableId);
      if (editableRow.isAdd) {
        editable.removeRow(editableId);
        return;
      }
      editableRow.cancel();
    },
    async doRemoveRow(opts: { editableId: any; row: R }) {
      let editableId = opts.editableId;
      if (!editableId) {
        const row = opts.row;
        //@ts-ignore
        editableId = row[crudBinding.value.table.editable.rowKey];
      }

      const editableRow = editable.getEditableRow(editableId);
      return await crudExpose.doRemove(opts, {
        async handle() {
          if (editableRow.isAdd) {
            editable.removeRow(editableId);
            return false;
          } else {
            if (crudBinding.value.mode.name === "local") {
              editable.removeRow(editableId);
              return { isLocal: true };
            } else {
              return await crudBinding.value.request.delRequest(opts);
            }
          }
        }
      });
    },
    getInstance() {
      crudExpose.getTableRef().editable;
    },
    eachCells(callback: (opts: EditableEachCellsOpts<R>) => void) {
      crudExpose.getTableRef().editable?.eachCells(callback);
    },
    eachRows(callback: (opts: EditableEachRowsOpts<R>) => void) {
      crudExpose.getTableRef().editable?.eachRows(callback);
    },
    async validate() {
      return await crudExpose.getTableRef().editable?.validate();
    },
    getTableData(data?: any[]): any[] {
      return crudExpose.getTableRef().editable?.getCleanTableData(data);
    },
    getCleanTableData(data?: any[]): any[] {
      return crudExpose.getTableRef().editable?.getCleanTableData(data);
    }
  };
  return editable;
}

/**
 *
 * @param props
 */
export function useExpose<R = any>(props: UseExposeProps<R>): UseExposeRet<R> {
  const { crudRef, crudBinding } = props;
  const { ui } = useUi();
  const { t } = useI18n();

  const formWrapperProvider = useFormWrapper();
  function checkCrudRef() {
    if (crudRef.value == null) {
      logger.warn("crudRef还未初始化，请在onMounted之后调用");
    }
  }
  function checkCrudBindingRef() {
    if (crudBinding.value == null) {
      logger.warn("crudBinding还未初始化，请在useFs或useCrud之后调用");
    }
  }

  const crudExpose: CrudExpose<R> = {
    crudRef,
    crudBinding,

    getFormWrapperRef() {
      return crudRef.value.formWrapperRef;
    },
    getFormRef: () => {
      const formWrapperRef = crudExpose.getFormWrapperRef();
      if (formWrapperRef == null || formWrapperRef?.formRef == null) {
        logger.error(
          "当前无法获取FormRef，请在编辑对话框已打开的状态下调用此方法，如果是在打开对话框时调用，可以尝试先nextTick"
        );
        return;
      }
      return formWrapperRef?.formRef;
    },
    getFormData: () => {
      const formRef = crudExpose.getFormRef();
      return formRef?.getFormData();
    },
    setFormData: (form: any, options?: SetFormDataOptions) => {
      crudExpose.getFormRef()?.setFormData(form, options);
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
      const valueBuilderColumns: ColumnCompositionProps<R>[] = [];
      forEachColumns(columns, (column) => {
        if (column.valueBuilder != null) {
          valueBuilderColumns.push(column);
        }
      });
      if (valueBuilderColumns.length === 0) {
        return;
      }
      forEach(records, (row, index) => {
        forEach(valueBuilderColumns, (col) => {
          col.valueBuilder({
            value: row[col.key],
            row,
            form: row,
            index,
            key: col.key,
            column: col
          });
        });

        //children
        //@ts-ignore
        if (row.children && isArray(row.children)) {
          //@ts-ignore
          crudExpose.doValueBuilder(row.children, columns);
        }
      });
      logger.debug("valueBuilder success:", records);
    },
    doValueResolve({ form }, columns) {
      if (columns == null) {
        columns = toRaw(crudBinding.value.columns);
      }
      const valueBuilderColumns: ColumnCompositionProps<R>[] = [];
      forEachColumns(columns, (column) => {
        if (column.valueResolve != null) {
          valueBuilderColumns.push(column);
        }
      });
      if (valueBuilderColumns.length === 0) {
        return;
      }
      logger.debug("doValueResolve ,columns=", columns);
      forEach(valueBuilderColumns, (col) => {
        const key = col.key;
        col.valueResolve({
          value: form[key],
          row: form,
          form,
          key,
          column: col
        });
      });
      logger.debug("valueResolve success:", form);
    },
    doSearchValidate() {
      crudExpose.getSearchRef().doValidate();
    },
    getSearchFormData() {
      return crudBinding.value.search.validatedForm;
    },
    getSearchValidatedFormData() {
      return crudBinding.value.search.validatedForm;
    },
    /**
     * {form,mergeForm}
     */
    setSearchFormData(context) {
      if (crudRef.value) {
        crudRef.value.setSearchFormData({
          form: context.form,
          mergeForm: context.mergeForm
        });
      }

      if (context.mergeForm === false) {
        for (const key in crudBinding.value.search.validatedForm) {
          delete crudBinding.value.search.validatedForm[key];
        }
      }
      const { merge } = useMerge();
      merge(crudBinding.value.search.validatedForm, context.form);
      if (context.triggerSearch) {
        crudExpose.doRefresh();
      }
    },
    /**
     * 获取search组件ref
     */
    getSearchRef() {
      checkCrudRef();
      return crudRef.value?.getSearchRef();
    },

    buildPageQuery(pageQuery: PageQuery<R>): UserPageQuery<R> {
      const page = pageQuery.page;

      let searchFormData = pageQuery.form;
      if (searchFormData == null) {
        searchFormData = cloneDeep(crudExpose.getSearchValidatedFormData()) || {};
        //配置searchValueResolve
        if (crudBinding.value?.search?.columns) {
          crudExpose.doValueResolve({ form: searchFormData }, toRaw(crudBinding.value.search.columns));
        }
      }

      let sort = pageQuery.sort;
      if (sort == null) {
        sort = crudBinding.value.table.sort || {};
      }

      const query: PageQuery<R> = { page, form: searchFormData, sort };
      let userPageQuery: UserPageQuery<R> = query;
      if (crudBinding.value.request.transformQuery) {
        userPageQuery = crudBinding.value.request.transformQuery(query);
      }
      return userPageQuery;
    },

    async search(pageQuery: PageQuery<R>, options: SearchOptions = {}) {
      const userPageQuery = crudExpose.buildPageQuery(pageQuery);
      let userPageRes: UserPageRes<R>;
      const disableLoading = unref(crudBinding.value.table.disableLoading);
      try {
        if (options.silence !== true && disableLoading !== true) {
          crudBinding.value.table.loading = true;
        }

        logger.debug("pageRequest", userPageQuery);
        userPageRes = await crudBinding.value.request.pageRequest(userPageQuery);
      } finally {
        crudBinding.value.table.loading = false;
      }
      if (userPageRes == null) {
        logger.warn("pageRequest返回结果不能为空");
        return;
      }
      let pageRes: PageRes<R> = userPageRes as PageRes<R>;
      if (crudBinding.value.request.transformRes) {
        pageRes = crudBinding.value.request.transformRes({
          res: userPageRes,
          query: userPageQuery
        });
      }

      //valueBuild
      if (pageRes.records) {
        crudExpose.doValueBuilder(pageRes.records);
      }
      return pageRes;
    },
    getPage() {
      let page: Page = {
        currentPage: 1,
        pageSize: 10
      };
      if (crudBinding.value.pagination) {
        page = {
          currentPage: crudBinding.value.pagination[ui.pagination.currentPage],
          pageSize: crudBinding.value.pagination.pageSize
        };
      }
      return page;
    },
    async doRefresh(props?) {
      if (crudBinding.value.request.pageRequest == null) {
        return;
      }
      logger.debug("do refresh:", props);
      if (crudBinding.value.pagination) {
        if (props?.goFirstPage) {
          crudBinding.value.pagination[ui.pagination.currentPage] = 1;
        }
      }

      const page = crudExpose.getPage();
      const pageRes = await crudExpose.search({ page }, { silence: props?.silence });
      if (pageRes == null) {
        logger.error(
          "pageRequest返回结构不正确，请配置正确的request.transformRes，期望：{currentPage>0, pageSize>0, total, records:[]},实际返回：",
          pageRes
        );
        return;
      }
      const { currentPage = page.currentPage || 1, pageSize = page.pageSize, total } = pageRes;
      const { records } = pageRes;
      if (
        records == null ||
        !(records instanceof Array) ||
        total == null ||
        currentPage == null ||
        currentPage <= 0 ||
        isNaN(currentPage) ||
        pageSize == null ||
        pageSize <= 0 ||
        isNaN(pageSize)
      ) {
        logger.error(
          "pageRequest返回结构不正确，请配置正确的request.transformRes，期望：{currentPage>0, pageSize>0, total, records:[]},实际返回：",
          pageRes
        );
        logger.info(
          "如果你的不需要分页，也需要按照上面的格式返回，可以让pageSize=99999，然后配置crudOptions.pagination.show=false来隐藏分页组件"
        );
        return;
      }
      crudBinding.value.data = records;
      if (crudBinding.value.pagination) {
        crudBinding.value.pagination[ui.pagination.currentPage] = currentPage;
        crudBinding.value.pagination.pageSize = pageSize;
        crudBinding.value.pagination[ui.pagination.total] = total || records.length;
      }
      if (props?.scrollTop ?? crudBinding.value.table.scrollTopOnRefreshed) {
        const fsTableRef = crudExpose.getTableRef();
        fsTableRef?.scrollTo(0);
      }
      if (crudBinding.value?.table?.onRefreshed) {
        crudBinding.value.table.onRefreshed({
          data: records
        });
      }
    },

    /**
     * 获取toolbar组件Ref
     */
    getToolbarRef: () => {
      return crudRef.value.toolbarRef;
    },

    /**
     * 获取列设置组件Ref
     */
    getColumnsFilterRef: () => {
      return crudExpose.getToolbarRef().columnsFilterRef;
    },

    /**
     * 获取列设置的原始列配置Ref
     * 可以修改列设置的原始配置
     */
    getColumnsFilterOriginalColumnsRef: () => {
      return crudExpose.getColumnsFilterRef().original;
    },
    /**
     * 获取列设置的列配置Ref
     * 可以动态修改列设置每列的配置
     */
    getColumnsFilterColumnsRef: () => {
      return crudExpose.getColumnsFilterRef().columns;
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
    async doSearch(opts: { form?: any; goFirstPage?: boolean; mergeForm?: boolean }) {
      logger.debug("do search:", opts);
      opts = merge({ goFirstPage: true }, opts);
      if (opts.goFirstPage) {
        crudExpose.doPageTurn(1);
      }
      if (opts.form && crudRef.value) {
        crudExpose.setSearchFormData({
          form: opts.form,
          mergeForm: opts.mergeForm,
          refWarning: false,
          triggerSearch: false
        });
      }

      await crudExpose.doRefresh();
    },
    /**
     * 获取FsTable实例
     */
    getTableRef() {
      checkCrudRef();
      return crudRef.value?.tableRef;
    },
    /**
     * 获取x-Table实例
     */
    getBaseTableRef() {
      const tableRef = this.getTableRef();
      if (tableRef == null) {
        logger.warn("fs-table还未挂载");
        return;
      }
      return tableRef.tableRef;
    },
    /**
     * 获取表格数据
     */
    getTableData() {
      checkCrudBindingRef();
      return crudBinding.value.data;
    },
    setTableData(data: any[]) {
      checkCrudBindingRef();
      crudBinding.value.data = data;
    },
    insertTableRow(index: number, row: any) {
      checkCrudBindingRef();
      crudBinding.value.data.splice(index, 0, row);
    },
    updateTableRow(index: number, row: any, merge = true) {
      if (merge) {
        crudBinding.value.data[index] = doMerge(crudBinding.value.data[index], row);
      } else {
        crudBinding.value.data[index] = row;
      }
    },
    removeTableRow(index: number) {
      checkCrudBindingRef();
      crudBinding.value.data.splice(index, 1);
    },
    removeTableRowByRowKey: (rowKey: any, data?: any[]) => {
      checkCrudBindingRef();
      if (data == null) {
        data = crudBinding.value.data;
      }
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        if (row[crudBinding.value.table.rowKey] === rowKey) {
          data.splice(i, 1);
          return true;
        }
        if (row.children && isArray(row.children)) {
          if (crudExpose.removeTableRowByRowKey(rowKey, row.children)) {
            return true;
          }
        }
      }
    },
    getTableDataRow(index: number) {
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
    doSelectCurrentRow({ row }: { row: any }) {
      const tableRef = crudExpose.getTableRef();
      tableRef.value.setCurrentRow(row);
    },
    /**
     * 删除行按钮
     * @param context
     * @param opts
     */
    async doRemove(context: DoRemoveContext<R>, opts?: RemoveProps<R>) {
      const removeBinding: any = crudBinding.value.table.remove ?? opts ?? {};
      if (opts?.noConfirm !== true) {
        try {
          if (removeBinding.confirmFn) {
            await removeBinding.confirmFn(context);
          } else {
            await ui.messageBox.confirm({
              title: removeBinding.confirmTitle || t("fs.rowHandle.remove.confirmTitle"), // '提示',
              message: removeBinding.confirmMessage || t("fs.rowHandle.remove.confirmMessage"), // '确定要删除此记录吗?',
              type: "warn",
              ...removeBinding.confirmProps
            });
          }
        } catch (e) {
          if (removeBinding.onCanceled) {
            await removeBinding.onCanceled(context);
          }
          return;
        }
      }

      let res = null;
      const isLocal = crudBinding.value.mode?.name === "local";
      if (opts?.handle) {
        res = await opts.handle(context);
      } else {
        if (isLocal) {
          crudExpose.removeTableRow(context?.index);
        } else {
          res = await crudBinding.value.request.delRequest(context);
        }
      }
      if (res === false) {
        return;
      }
      const removeScope = { ...context, res };
      if (removeBinding.afterRemove) {
        const success = await removeBinding.afterRemove(removeScope);
        if (success === false) {
          return false;
        }
      }

      if (removeBinding.showSuccessNotification !== false) {
        ui.notification.success(t("fs.rowHandle.remove.success"));
      }

      if (!isLocal) {
        if (removeBinding.refreshTable !== false) {
          await crudExpose.doRefresh({ scrollTop: false });
        }
      }

      if (removeBinding.onRemoved) {
        await removeBinding.onRemoved({ ...context, res });
      }
    },
    /**
     *
     * 打开表单对话框
     * @param formOpts ={mode, initialForm: row, index,...formOptions}
     */
    async openDialog(formOpts: OpenDialogProps) {
      if (formOpts.newInstance === true && formWrapperProvider) {
        //通过新实例打开
        return await formWrapperProvider.openDialog(formOpts);
      }
      const formWrapperRef = this.getFormWrapperRef();
      formWrapperRef.open(formOpts);
      return formWrapperRef;
    },
    async _openDialog(mode: string, context: OpenEditContext, formOpts: OpenDialogProps) {
      const { merge } = useMerge();
      // @ts-ignore
      let row = context.row || context[ui.tableColumn.row];
      delete context.row;
      if (row == null && context.index != null) {
        row = crudExpose.getTableDataRow(context.index);
      }
      if (crudBinding.value?.request?.infoRequest) {
        row = await crudBinding.value.request.infoRequest({ mode, row });
      }
      const options = {
        mode
      };
      const xxForm = toRaw(crudBinding.value[mode + "Form"]);
      merge(options, xxForm, { initialForm: row }, context, formOpts);
      return await this.openDialog(options);
    },
    async openAdd(context: OpenEditContext, formOpts: OpenDialogProps = {}) {
      return this._openDialog("add", context, formOpts);
    },
    async openEdit(context: OpenEditContext, formOpts: OpenDialogProps = {}) {
      return this._openDialog("edit", context, formOpts);
    },
    async openView(context: OpenEditContext, formOpts: OpenDialogProps = {}) {
      return this._openDialog("view", context, formOpts);
    },
    async openCopy(context: OpenEditContext, formOpts: OpenDialogProps = {}) {
      return this._openDialog("add", context, formOpts);
    },

    editable: undefined
  };
  crudExpose.editable = useEditable({ crudExpose });
  return { expose: crudExpose, crudExpose: crudExpose };
}
