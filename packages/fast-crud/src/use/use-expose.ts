import { toRaw } from "vue";
import _ from "lodash-es";
import logger from "../utils/util.log";
import { useMerge } from "../use/use-merge";

const { merge } = useMerge();
export type UseExposeProps = {
  crudRef;
  crudBinding;
};
export type CrudExpose = {
  crudRef;
  crudBinding;
  getFormWrapperRef;
  getFormRef;
  getFormData;
  getFormComponentRef;
  doValueBuilder;
  doValueResolve;
  doRefresh;
  doPageTurn;
  doSearch;
  getSearchFormData;
  setSearchFormData;
  getTableRef;
  doSelectCurrentRow;
  editable: any;
};

function useEditable({ expose }) {
  const { crudBinding } = expose;
  const editable = {
    addRow() {
      editable.active({ mode: "add" });
    },
    editAll() {
      editable.active({ mode: "edit", editType: "all" });
    },
    editRow() {
      editable.active({ mode: "edit", editType: "row" });
    },
    /**
     * 激活编辑
     * @param opts
     */
    active(opts) {
      const { mode, editType } = opts;
      const form = opts.form || mode === "add" ? crudBinding.value.addForm.columns : crudBinding.value.editForm.columns;

      crudBinding.value.table.editable = {
        enabled: true,
        form,
        mode,
        editType
      };
    },
    /**
     * 禁用编辑
     */
    inActive() {
      crudBinding.value.table.editable.enabled = false;
    },
    /**
     * 退出编辑
     */
    quit() {
      expose.getTableRef().editable.inActiveAll();
    }
  };
  return editable;
}
export function useExpose(props: UseExposeProps): { expose: CrudExpose } {
  const { crudRef, crudBinding } = props;
  const expose: CrudExpose = {
    crudRef,
    crudBinding,

    getFormWrapperRef() {
      return crudRef.value.formWrapperRef;
    },
    getFormRef: () => {
      const formWrapperRef = expose.getFormWrapperRef();
      return formWrapperRef?.formRef;
    },
    getFormData: () => {
      const formRef = expose.getFormRef();
      return formRef?.getFormData();
    },
    getFormComponentRef(key) {
      const formRef = expose.getFormRef();
      return formRef?.getComponentRef(key);
    },
    doValueBuilder(records) {
      const columns = toRaw(crudBinding.value.columns);
      logger.debug("columns", columns);
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
    doValueResolve({ form }) {
      const columns = toRaw(crudBinding.value.columns);
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
      return crudRef.value.getSearchFormData();
    },
    /**
     * {form,mergeForm}
     */
    setSearchFormData({ form, mergeForm }) {
      crudRef.value.setSearchFormData({ form, mergeForm });
    },
    async doRefresh() {
      let page;
      if (crudBinding.value.pagination) {
        page = {
          currentPage: crudBinding.value.pagination.currentPage,
          pageSize: crudBinding.value.pagination.pageSize
        };
      }
      let searchFormData = {};
      if (crudRef.value) {
        searchFormData = expose.getSearchFormData();
      }

      const sort = crudBinding.value.sort || {};
      let query = { page, form: searchFormData, sort };
      if (crudBinding.value.request.transformQuery) {
        query = crudBinding.value.request.transformQuery(query);
      }

      crudBinding.value.table.loading = true;
      let pageRes;
      try {
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
      const { currentPage = page.currentPage, pageSize = page.pageSize, total } = pageRes;
      const { records } = pageRes;
      if (records == null) {
        logger.warn(
          "pageRequest返回结构不正确，请配置request.transformRes，期望：{currentPage, pageSize, total, records:[]},实际返回：",
          pageRes
        );
        return;
      }

      //valueBuild
      expose.doValueBuilder(records);

      crudBinding.value.data = records;
      if (crudBinding.value.pagination) {
        crudBinding.value.pagination.currentPage = currentPage;
        crudBinding.value.pagination.pageSize = pageSize;
        crudBinding.value.pagination.total = total || records.length;
      }
    },
    doPageTurn(no: number) {
      crudBinding.value.pagination.currentPage = no;
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
      logger.debug("dosearch:", opts);
      opts = merge({ goFirstPage: true }, opts);
      if (opts.goFirstPage) {
        expose.doPageTurn(1);
      }
      if (opts.form && crudRef.value) {
        crudRef.value.setSearchFormData(opts);
      }

      await expose.doRefresh();
    },
    getTableRef() {
      return crudRef.value?.tableRef;
    },
    doSelectCurrentRow({ index, row }) {
      const tableRef = expose.getTableRef();
      console.log("tableRef", tableRef);
      tableRef.value.setCurrentRow(row);
    },
    editable: undefined
  };
  expose.editable = useEditable({ expose });
  return { expose };
}
