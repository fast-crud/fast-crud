import defaultCrudOptions from './default-crud-options'
import _ from 'lodash-es'
import { reactive } from 'vue'
export default function ({ crudRef, crudOptions }) {
  const mergedCrudOptions = _.merge(_.cloneDeep(defaultCrudOptions), crudOptions)
  const crud = reactive(mergedCrudOptions)

  const doRefresh = async () => {
    const pagination = crud.pagination
    let page
    if (pagination) {
      page = { currentPage: pagination.currentPage, pageSize: pagination.pageSize }
    }
    const searchFormData = crudRef.getSearchFormData()
    const query = { page, form: searchFormData }
    let result = await crud.request.pageRequest(query)
    if (crud.request.transform) {
      result = crud.request.transform(result)
    }
    const { currentPage, pageSize, total, records } = result

    pagination.currentPage = currentPage
    pagination.pageSize = pageSize
    pagination.total = total
    crud.data = records
  }

  return {
    doRefresh,
    crud
  }
}
