import { compute } from '@/components/fast-crud/core/compute-value'
import * as api from '@/views/home/api'

const pageRequest = async (query) => {
  return await api.GetList(query)
}
const editRequest = async ({ form, row }) => {
  form.id = row.id
  return await api.UpdateObj(form)
}
const delRequest = async (id) => {
  return await api.DelObj(id)
}

const addRequest = async ({ form }) => {
  return await api.AddObj(form)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ({ crudRef }) {
  return {
    options: {

    },
    request: {
      pageRequest,
      addRequest,
      editRequest,
      delRequest,
      transformQuery: ({ page, form }) => {
        return { current: page.currentPage, size: page.pageSize, ...form }
      },
      transformRes: ({ res }) => {
        return { currentPage: res.current, pageSize: res.size, ...res }
      }
    },
    search: {
      buttons: {
        search: {
        },
        reset: {
        }
      },
      columns: {
        test: {
          label: 'test'
        }
      }
    },
    toolbar: {
      impact: true,
      search: true
    },
    actionbar: {
      buttons: {
        add: {
          type: 'primary',
          text: '添加'
        }
      },
      show: true
    },
    table: {
      'element-loading-text': '加载中,请稍候',
      onCellClick () {
        // console.log('cell click')
      }
    },
    pagination: {
      background: true,
      pageSize: 20,
      pageSizes: [5, 10, 20, 50],
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0
    },
    columns: {
      date: {
        label: '日期',
        sortable: true
      },
      name: {
        label: '姓名',
        component: {
          name: 'el-button',
          children: {
            default: (scope) => <div>{scope.row.name}</div>
          },
          style: 'width:100px',
          events: {
            onClick: (context) => {
              console.log('clicked', context)
              context.row.name = context.row.name === '李四' ? '王小虎' : '李四'
            },
            onChange (context) {
              console.log('on change', context)
            },
            onInput (context) {
              console.log('on input', context)
            }
          }
        }
      },
      avatar: {
        label: '头像',
        align: 'center',
        show: compute(() => {
          return true
        }),
        component: {
          show: compute((context) => {
            return context.row.show === false
          }),
          name: 'el-image',
          valueBinding: 'src',
          style: { height: '30px' },
          fit: 'contain',
          children: {
            error: () => {
              return <div class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            }
          }
        }
      },
      show: {
        label: '显隐',
        component: {
          name: 'el-switch',
          events: {
            onChange (context) {
              console.log('switch context', context)
            }
          }
        }
      },
      addressGroup: {
        label: '地址',
        children: {
          province: {
            label: '省份',
            width: '200px',
            component: {
              name: 'el-input',
              maxlength: 5,
              'show-word-limit': true,
              children: {
                append () {
                  return <div class="aaa">append</div>
                }
              }
            }
          },
          city: {
            label: '城市',
            component: {
              name: 'el-select',
              children: {
                default () {
                  return [
                    <el-option value="普陀区">普陀区</el-option>,
                    <el-option value="bbbb">bbbb</el-option>
                  ]
                }
              }
            }
          },
          address: {
            label: '地址',
            component: {
              clearable: true
            }
          }
        }
      },
      zip: {
        label: '邮编',
        formatter (row, column, value) {
          return value
        }
      }
    },
    rowHandle: {
      label: '操作',
      width: '300px',
      edit: {
        icon: 'el-icon-edit',
        text: null
      },
      custom: [
        {
          text: 'custom',
          click () {
            console.log('1111')
          }
        }
      ]
    },
    data: [],
    editForm: {
      wrapper: {
        // is: 'el-drawer',
        title: '编辑',
        width: '60%'
      },
      options: {
        labelPosition: 'right',
        labelWidth: '100px',
        style: {
          //  'grid-template-columns': '47% 47%' // grid布局，默认两列
        }
      },
      columns: {
        date: {
          label: '日期'
        },
        name: {
          label: '姓名',
          component: {
            name: 'el-input'
          }
        },
        show: {
          label: compute((context) => {
            return context.form.show ? '隐藏头像' : '显示头像'
          }),
          component: {
            name: 'el-switch'
          },
          style: {
            'grid-column': 'span 2' // 跨2列
          }
        },
        avatar: {
          label: '头像',
          component: {
            name: 'el-image',
            valueBinding: 'src',
            style: 'width:70px'
          },
          style: {
            'grid-column': 'span 2' // 跨2列
          },
          show: compute((context) => {
            return context.form.show
          })
        },
        address: {
          label: '地址',
          style: {
            'grid-row': '2', // 在第二行显示
            'grid-column': 'span 2' // 第一列显示，并且跨2列
          },
          span: 2
        },
        province: {
          label: '省份'
        }
      }
    },
    addForm: {
      wrapper: {
        // is: 'el-drawer',
        title: '添加',
        width: '60%'
      },
      options: {
        labelPosition: 'right',
        labelWidth: '100px',
        style: {
          //  'grid-template-columns': '47% 47%' // grid布局，默认两列
        }
      },
      columns: {
        date: {
          label: '日期'
        },
        name: {
          label: '姓名',
          component: {
            name: 'el-input'
          }
        },
        show: {
          label: compute((context) => {
            return context.form.show ? '隐藏头像' : '显示头像'
          }),
          component: {
            name: 'el-switch'
          },
          style: {
            'grid-column': 'span 2' // 跨2列
          }
        },
        avatar: {
          label: '头像',
          component: {
            name: 'el-image',
            valueBinding: 'src',
            style: 'width:70px'
          },
          style: {
            'grid-column': 'span 2' // 跨2列
          },
          show: compute((context) => {
            return context.form.show
          })
        },
        address: {
          label: '地址',
          style: {
            'grid-row': '2', // 在第二行显示
            'grid-column': 'span 2' // 第一列显示，并且跨2列
          },
          span: 2
        },
        province: {
          label: '省份'
        }
      }
    },
    viewForm: {
      wrapper: {
        // is: 'el-drawer',
        title: '查看',
        width: '60%'
        // size: '50%',
      },
      options: {
        labelPosition: 'right',
        labelWidth: '100px',
        style: {
          //  'grid-template-columns': '47% 47%' // grid布局，默认两列
        }
      },
      columns: {
        date: {
          label: '日期'
        },
        name: {
          label: '姓名',
          component: {
            name: 'el-input'
          }
        },
        show: {
          label: compute((context) => {
            return context.form.show ? '隐藏头像' : '显示头像'
          }),
          component: {
            name: 'el-switch'
          },
          style: {
            'grid-column': 'span 2' // 跨2列
          }
        },
        avatar: {
          label: '头像',
          component: {
            name: 'el-image',
            valueBinding: 'src',
            style: 'width:70px'
          },
          style: {
            'grid-column': 'span 2' // 跨2列
          },
          show: compute((context) => {
            return context.form.show
          })
        },
        address: {
          label: '地址',
          style: {
            'grid-row': '2', // 在第二行显示
            'grid-column': 'span 2' // 第一列显示，并且跨2列
          },
          span: 2
        },
        province: {
          label: '省份'
        }
      }
    }
  }
}
