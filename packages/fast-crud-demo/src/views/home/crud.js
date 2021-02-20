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
        column: {
          sortable: true
        }
      },
      name: {
        label: '姓名',
        type: 'text',
        search: { show: true },
        column: {
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
        }
      },
      avatar: {
        label: '头像',
        search: { show: true },
        column: {
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
        column: {
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
            search: { show: true },
            dict: dict({
              url: '/dicts/OpenStatusEnum'
            })
          },
          city: {
            label: '城市',
            type: 'select',
            dict: dict({
              url: '/dicts/OpenStatusEnum'
            })
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
    data: []
  }
}
