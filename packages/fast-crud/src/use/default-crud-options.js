export default {
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  commonOptions (ctx) {
  },
  defaultOptions: {
    search: {
      show: true
    },
    form: {
      options: {
        labelPosition: 'right',
        labelWidth: '80px',
        style: {
          //  'grid-template-columns': '47% 47%' // grid布局，默认两列
        }
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
      layout: 'total, sizes, prev, pager, next, jumper'
    },
    table: {
      height: '100%',
      rowKey: 'id',
      stripe: true,
      border: true
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
