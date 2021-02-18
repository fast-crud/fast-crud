import { compute } from '@/components/fast-crud/core/compute-value'
import { ElMessageBox, ElNotification } from 'element-plus'
export default function ({ addRequest, editRequest, delRequest }) {
  return {
    options: {

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
      onCellClick () {
        // console.log('cell click')
      }
    },
    pagination: {
      background: true,
      layout: 'prev, pager, next',
      total: 1000
    },
    columns: {
      date: {
        label: '日期'
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
        show: compute((context) => {
          console.log('show,context', context)
          return true
        }),
        component: {
          show: compute((context) => {
            console.log('show,context', context)
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
          console.log('formatter', row, column, value)
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
      remove: {
        async click (context) {
          console.log('remove', context)
          await ElMessageBox.confirm('确定要删除此记录吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          await delRequest(context.row.id)
          ElNotification.success({
            type: 'success',
            message: '删除成功!'
          })
        }
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
    data: [{
      date: '2016-05-03',
      name: '王小虎',
      province: '上海',
      avatar: 'https://www.baidu.com/img/dong_8f1d47bcb77d74a1e029d8cbb3b33854.gif',
      city: '普陀区',
      address: '上海市普陀区金沙江路 1518 弄',
      zip: 200333
    }],
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
      async doSubmit (ctx) {
        console.log('submit ctx', ctx)
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        await editRequest(ctx)
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
      async doSubmit (ctx) {
        console.log('submit ctx', ctx)
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        await addRequest(ctx)
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
      async doSubmit (ctx) {
        console.log('submit ctx', ctx)
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        // await editRequest(ctx)
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
