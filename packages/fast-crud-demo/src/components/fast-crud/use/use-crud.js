import defaultCrudOptions from './default-crud-options'
import _ from 'lodash-es'
import { ref } from 'vue'
import logger from '../utils/util.log'
import typesUtil from '../utils/util.types'
import { ElMessageBox, ElNotification } from 'element-plus'
export default function (ctx) {
  const { crudRef, options } = ctx
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
        async doSubmit (context) {
          await crudOptions.value.request.editRequest(context)
          doRefresh()
        }
      },
      addForm: {
        async doSubmit (context) {
          await crudOptions.value.request.addRequest(context)
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
  const setCrudOptions = (pageOptions) => {
    const userOptions = _.merge(
      defaultCrudOptions.defaultOptions,
      usePagination(),
      useFormSubmit(),
      useRemove(),
      useSearch(),
      _.cloneDeep(defaultCrudOptions.commonOptions(ctx)),
      pageOptions
    )

    // 分散 合并到不同的维度
    const cellColumns = {}
    const formColumns = {}
    const addFormColumns = {}
    const editFormColumns = {}
    const viewFormColumns = {}
    const searchColumns = {}

    function mergeFromForm (targetColumns, item, key, mergeSrc) {
      const formColumn = _.cloneDeep(item[mergeSrc]) || {}
      formColumn.label = item.label
      formColumn.key = key
      targetColumns[key] = formColumn
    }
    function eachColumns (columns, columnParentColumns = cellColumns) {
      _.forEach(columns, (item, key) => {
        // types merge
        if (item.type) {
          const typeOptions = typesUtil.getType(item.type)
          if (typeOptions) {
            item = _.merge({}, typeOptions, item)
          }
        }
        // copy dict

        if (item.dict) {
          if (item.column?.component) {
            item.column.component.dict = _.cloneDeep(item.dict)
          }
          if (item.form?.component) {
            item.form.component.dict = _.cloneDeep(item.dict)
          }
          console.log('item.dict', item)
        }

        const cellColumn = item.column || {}
        cellColumn.label = item.label
        cellColumn.key = key
        columnParentColumns[key] = cellColumn
        if (item.children) {
          eachColumns(item.children, cellColumn.children = {})
          return
        }
        mergeFromForm(formColumns, item, key, 'form')
        mergeFromForm(addFormColumns, item, key, 'addForm')
        mergeFromForm(editFormColumns, item, key, 'editForm')
        mergeFromForm(viewFormColumns, item, key, 'viewForm')
        mergeFromForm(searchColumns, item, key, 'search')
      })
    }

    eachColumns(userOptions.columns)

    // 分置合并
    userOptions.form = _.merge(_.cloneDeep(userOptions.form), { columns: formColumns })
    userOptions.editForm = _.merge(_.cloneDeep(userOptions.form), { columns: editFormColumns }, userOptions.editForm)
    userOptions.addForm = _.merge(_.cloneDeep(userOptions.form), { columns: addFormColumns }, userOptions.addForm)
    userOptions.viewForm = _.merge(_.cloneDeep(userOptions.form), { columns: viewFormColumns }, userOptions.viewForm)
    userOptions.search = _.merge({ columns: userOptions.form.columns }, { columns: searchColumns }, userOptions.search)
    userOptions.columns = cellColumns

    // 单独处理viewForm的component
    _.forEach(userOptions.viewForm.columns, (value) => {
      if (!value.component) {
        value.component = {}
      }
      value.component.disabled = true
    })
    // 与默认配置合并
    crudOptions.value = userOptions

    logger.info('fast-crud inited:', crudOptions.value)
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
