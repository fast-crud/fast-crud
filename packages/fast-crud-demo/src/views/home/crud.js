import { compute, dict } from '@/components/fast-crud'
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
    columns: {
      date: {
        label: '日期',
        sortable: true
      },
      name: {
        label: '姓名',
        search: { show: true },
        cell: {
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
        form: {
          component: {
            name: 'el-input'
          }
        }
      },
      avatar: {
        label: '头像',
        search: { show: true },
        cell: {
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
        form: {
          component: {
            name: 'el-image',
            valueBinding: 'src',
            style: 'width:70px'
          },
          style: {
            'grid-column': 'span 2' // 跨2列
          },
          show: compute((context) => {
            console.log('show context', context)
            return context.form.show
          })
        }
      },
      show: {
        label: '显隐',
        cell: {
          component: {
            name: 'el-switch',
            events: {
              onChange (context) {
                console.log('switch context', context)
              }
            }
          }
        },
        form: {
          label: compute((context) => {
            return context.form.show ? '隐藏头像' : '显示头像'
          }),
          component: {
            name: 'el-switch'
          },
          style: {
            'grid-column': 'span 2' // 跨2列
          }
        }
      },
      addressGroup: {
        label: '地址',
        children: {
          province: {
            label: '省份',
            type: 'select',
            cell: {
            },
            editForm: {
              component: {
                dict: dict({
                  url: '/dicts/OpenStatusEnum'
                })
              }
            }
          },
          city: {
            label: '城市',
            type: 'select'
          },
          address: {
            label: '地址',
            search: {
              show: true
            },
            type: 'text-area'
          }
        }
      },
      zip: {
        label: '邮编'
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
    form: {
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
      }
    }
  }
}
