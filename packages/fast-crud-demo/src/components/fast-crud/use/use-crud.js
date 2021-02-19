import defaultCrudOptions from './default-crud-options'
import _ from 'lodash-es'
import { ref } from 'vue'
import logger from '../utils/util.log'
import { ElMessageBox, ElNotification } from 'element-plus'
export default function ({ crudRef, options }) {
  const crudOptions = ref()

  const doRefresh = async () => {
    const pagination = crudOptions.value.pagination
    let page
    if (pagination) {
      page = { currentPage: pagination.currentPage, pageSize: pagination.pageSize }
    }
    const searchFormData = crudRef.value.getSearchFormData()
    let query = { page, form: searchFormData }
    if (crudOptions.value.request.transformQuery) {
      query = crudOptions.value.request.transformQuery(query)
    }

    crudOptions.value.table.loading = true
    let pageRes
    try {
      pageRes = await crudOptions.value.request.pageRequest(query)
    } finally {
      crudOptions.value.table.loading = false
    }
    if (pageRes == null) {
      logger.warn('pageRequest返回结果不能为空')
      return
    }
    if (crudOptions.value.request.transformRes) {
      pageRes = crudOptions.value.request.transformRes({ res: pageRes, query })
    }
    let { currentPage = page.currentPage, pageSize = page.pageSize, total, records } = pageRes
    if (records == null) {
      logger.warn('pageRequest返回结构不正确，请配置transform，期望：{currentPage, pageSize, total, records:[]},实际返回：', pageRes)
      return
    }
    crudOptions.value.data = records || (records = [])
    if (pagination) {
      pagination.currentPage = currentPage
      pagination.pageSize = pageSize
      pagination.total = total || records.length
    }
  }

  const doPageTurn = (no) => {
    crudOptions.value.pagination.currentPage = no
  }
  /**
   *
   * @param opts = {
   *   form
   *   goFirstPage =true
   *   mergeForm=false
   * }
   */
  const doSearch = async (opts) => {
    opts = _.merge({ goFirstPage: true }, opts)
    if (opts.goFirstPage) {
      doPageTurn(1)
    }
    if (opts.form) {
      crudRef.value.setSearchFormData(opts)
    }

    await doRefresh()
  }

  function usePagination () {
    return {
      pagination: {
        onSizeChange (event) {
          crudOptions.value.pagination.pageSize = event
          doRefresh()
        },
        onCurrentChange (event) {
          crudOptions.value.pagination.currentPage = event
          doRefresh()
        }
      }
    }
  }

  function useFormSubmit () {
    return {
      editForm: {
        async doSubmit (ctx) {
          await crudOptions.value.request.editRequest(ctx)
          doRefresh()
        }
      },
      addForm: {
        async doSubmit (ctx) {
          await crudOptions.value.request.addRequest(ctx)
          doRefresh()
        }
      }
    }
  }

  function useRemove () {
    return {
      rowHandle: {
        remove: {
          async click (context) {
            // TODO i18n
            try {
              await ElMessageBox.confirm('确定要删除此记录吗?', '提示', {
                type: 'warning'
              })
            } catch (e) {
              logger.info('用户取消删除')
              return
            }
            await crudOptions.value.request.delRequest(context.row.id)
            ElNotification.success({
              type: 'success',
              message: '删除成功!'
            })
            await doRefresh()
          }
        }
      }
    }
  }

  function useSearch () {
    return {
      search: {
        doSearch
      }
    }
  }
  const setCrudOptions = (options) => {
    crudOptions.value = _.merge(
      usePagination(),
      useFormSubmit(),
      useRemove(),
      useSearch(),
      _.cloneDeep(defaultCrudOptions),
      options
    )
  }
  setCrudOptions(options)

  return {
    doRefresh,
    doPageTurn,
    doSearch,
    setCrudOptions,
    crudOptions
  }
}
