export default {
  name: "zh-cn",
  fs: {
    component: {
      select: {
        placeholder: "请选择"
      }
    },
    addForm: { title: "添加" },
    editForm: { title: "编辑" },
    viewForm: { title: "查看" },
    rowHandle: {
      title: "操作",
      remove: {
        text: "删除",
        confirmTitle: "删除提示",
        confirmMessage: "您确定要删除该记录吗?",
        success: "删除成功!"
      },
      edit: {
        text: "编辑"
      },
      view: {
        text: "查看"
      }
    },
    form: {
      cancel: "取消",
      ok: "确定",
      reset: "重置"
    },
    actionbar: { add: "添加" },
    toolbar: {
      columnFilter: {
        title: "列设置",
        fixed: "固定",
        order: "排序",
        reset: "还原",
        confirm: "确定",
        unnamed: "未命名"
      },
      search: { title: "查询显示" },
      refresh: { title: "刷新" },
      compact: { title: "紧凑模式" },
      export: { title: "导出" },
      columns: { title: "列设置" }
    },
    search: {
      container: {
        collapseButton: {
          text: {
            collapse: "收起",
            expand: "展开"
          }
        }
      },
      search: { text: "查询" },
      reset: { text: "重置" },
      error: {
        message: "查询表单校验失败"
      }
    },
    pagination: {
      showTotal: "共 {0} 条"
    },
    date: {
      formatter: { to: "至" }
    },
    extends: {
      cropper: {
        reChoose: "重新选择",
        flipX: "上下翻转",
        flipY: "左右翻转",
        reset: "重置"
      },
      fileUploader: {
        text: "文件上传",
        limitTip: "文件数量不能超过 {0}",
        sizeLimitTip: "文件大小不能超过 {0},当前大小：{1}",
        hasUploading: "还有文件正在上传，请等待上传完成，或删除它"
      }
    }
  }
} as any;
