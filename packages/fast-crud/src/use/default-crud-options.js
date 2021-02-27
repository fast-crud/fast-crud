import { uiContext } from '../ui'

export default {
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  commonOptions (ctx) {
  },
  defaultOptions () {
    const ui = uiContext.get()
    return {
      search: {
        show: true,
        buttons: {
          search: {
            icon: ui.icons.search
          },
          reset: {
            icon: ui.icons.refresh
          }
        }
      },
      form: {

        labelPosition: 'right',
        labelWidth: '80px',
        style: {
          'grid-template-columns': '50% 50%' // grid布局，默认两列
        },
        labelAlign: 'right', // antdv
        labelCol: { span: 4 }, // antdv
        wrapperCol: { span: 18 }, // antdv
        wrapper: {
          is: ui.dialog.name,
          width: '860px',
          destroyOnClose: true, // antdv
          footer: null // antdv
        }
      },
      addForm: {
        wrapper: {
          title: '添加'
        }
      },
      editForm: {
        wrapper: {
          title: '编辑'
        }
      },
      viewForm: {
        wrapper: {
          title: '查看'
        }
      },
      rowHandle: {
        fixed: 'right',
        label: '操作'
      },
      pagination: {
        background: true,
        pageSize: 20,
        pageSizes: [5, 10, 20, 50],
        layout: 'total, sizes, prev, pager, next, jumper',
        showSizeChanger: true, // antdv
        showQuickJumper: true // antdv
      },
      table: {
        height: '100%',
        rowKey: 'id',
        stripe: true,
        border: true,
        bordered: true
      },
      toolbar: {
        compact: true
      },
      actionbar: {
        buttons: {
          add: {
            type: 'primary',
            text: '添加'
          }
        }
      }
    }
  }
}
