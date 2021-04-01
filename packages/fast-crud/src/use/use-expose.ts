import { toRaw } from "vue";
import _ from "lodash-es";
import logger from "../utils/util.log";
import { useMerge } from "../use/use-merge";
const { merge } = useMerge();

export default function ({ crudRef, crudBinding }) {
  const expose = {
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
            column: builder.column,
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
            column,
          });
        }
      });
      logger.debug("valueResolve success:", form);
    },
    async doRefresh() {
      let page;
      if (crudBinding.value.pagination) {
        page = {
          currentPage: crudBinding.value.pagination.currentPage,
          pageSize: crudBinding.value.pagination.pageSize,
        };
      }
      let searchFormData = {};
      if (crudRef.value) {
        searchFormData = crudRef.value.getSearchFormData();
      }
      let query = { page, form: searchFormData };
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
          query,
        });
      }
      const {
        currentPage = page.currentPage,
        pageSize = page.pageSize,
        total,
      } = pageRes;
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
  };

  return expose;
}
