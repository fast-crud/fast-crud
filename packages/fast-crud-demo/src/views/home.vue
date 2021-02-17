<template>
  <fs-crud v-bind="crud">

    <template #cell-date="scope">
      <el-button @click="dateClick('date',scope)" >cell- date,{{scope.row.date}}</el-button>
    </template>

    <template #form-date="scope">
      <el-button @click="dateClick('date',scope)" >form- date,{{scope.row.date}}</el-button>
    </template>

    <template #pagination-prefix>
      <el-button >批量删除</el-button>
    </template>
    <template #pagination-append>
      <el-button >批量删除</el-button>
    </template>
  </fs-crud>
</template>
<script>
import { ref } from 'vue'
import { ElNotification } from 'element-plus'
import { ComputeValue, compute } from '@/components/fast-crud/core/compute-value'

export default {
  setup () {
    const crud = ref({
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
                return <div className="image-slot">
                  <i className="el-icon-picture-outline"></i>
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
      data: [{
        date: '2016-05-03',
        name: '王小虎',
        province: '上海',
        avatar: 'https://www.baidu.com/img/dong_8f1d47bcb77d74a1e029d8cbb3b33854.gif',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }
      // , {
      //   date: '2016-05-02',
      //   name: '王小虎',
      //   province: '上海',
      //   city: '普陀区',
      //   address: '上海市普陀区金沙江路 1518 弄',
      //   zip: 200333
      // }, {
      //   date: '2016-05-04',
      //   name: '王小虎',
      //   province: '上海',
      //   city: '普陀区',
      //   address: '上海市普陀区金沙江路 1518 弄',
      //   zip: 200333
      // }, {
      //   date: '2016-05-01',
      //   name: '王小虎',
      //   province: '上海',
      //   city: '普陀区',
      //   address: '上海市普陀区金沙江路 1518 弄',
      //   zip: 200333
      // }, {
      //   date: '2016-05-08',
      //   name: '王小虎',
      //   province: '上海',
      //   city: '普陀区',
      //   address: '上海市普陀区金沙江路 1518 弄',
      //   zip: 200333
      // }, {
      //   date: '2016-05-06',
      //   name: '王小虎',
      //   province: '上海',
      //   city: '普陀区',
      //   address: '上海市普陀区金沙江路 1518 弄',
      //   zip: 200333
      // }, {
      //   date: '2016-05-07',
      //   name: '王小虎',
      //   province: '上海',
      //   city: '普陀区',
      //   address: '上海市普陀区金沙江路 1518 弄',
      //   zip: 200333
      // }
      ],
      formOptions: {

      },
      editForm: {
        wrapper: {
          // is: 'el-drawer',
          title: '编辑',
          width: '60%',
          size: '50%',
          'custom-class': 'fs-form-wrapper'
        },
        options: {
          labelPosition: 'right',
          labelWidth: '100px',
          style: {
            //  'grid-template-columns': '47% 47%' // grid布局，默认两列
          }
        },
        onSubmit (ctx) {
          console.log('submit ctx', ctx)
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
    })

    const dateClick = (key, scope) => {
      console.log('dateClick', scope)
      ElNotification.success(scope.row[key])
    }

    return {
      crud,
      dateClick
    }
  }
}
</script>
