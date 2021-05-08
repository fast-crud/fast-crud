import * as api from "./api";
export default function ({ expose, asideTableRef }) {
  const editRequest = async ({ form, row }) => {
    form.id = row.id;
    return await api.UpdateObj(form);
  };
  const delRequest = async ({ row }) => {
    return await api.DelObj(row.id);
  };
  const addRequest = async ({ form }) => {
    return await api.AddObj(form);
  };

  return {
    crudOptions: {
      request: {
        pageRequest: api.GetList,
        addRequest,
        editRequest,
        delRequest
      },
      pagination: {
        layout: "total,  prev, pager, next"
      },
      rowHandle: {
        width: "210px"
      },
      toolbar: {
        compact: false
      },
      table: {
        "highlight-current-row": true,
        // 监听 el-table的单行选中事件
        onCurrentChange(currentRow) {
          console.log("选中行", currentRow);
          asideTableRef.value.setSearchFormData({ form: { gradeId: currentRow.id } });
          asideTableRef.value.doRefresh();
        }
      },
      columns: {
        id: {
          title: "ID",
          key: "id",
          type: "number",
          column: {
            width: 50
          },
          form: {
            show: false
          }
        },
        grade: {
          title: "年级",
          search: { show: true },
          type: "text",
          column: {
            sortable: true
          }
        },
        nestId: {
          title: "嵌套表格",
          form: {
            // 嵌套表格字段
            rules: [{ required: true, message: "请选择用户" }],
            component: {
              name: "sub-table"
            },
            col: { span: 24 }
          }
        }
      }
    }
  };
}
