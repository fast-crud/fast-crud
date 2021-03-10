import { toRaw } from "vue";
import _ from "lodash-es";
import logger from "../utils/util.log";
export default function (crudRef) {
  const expose = {
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
      const columns = toRaw(crudRef.value.columns);
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
      const columns = toRaw(crudRef.value.columns);
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
  };

  return expose;
}
