export default {
  name: "en",
  fs: {
    component: {
      select: {
        placeholder: "please select"
      }
    },
    addForm: { title: "add" },
    editForm: { title: "edit" },
    viewForm: { title: "view" },
    rowHandle: {
      title: "handle",
      remove: {
        text: "remove",
        confirmTitle: "remove tip",
        confirmMessage: "Are you sure you want to delete this record?",
        success: "delete success!"
      },
      edit: {
        text: "edit"
      },
      view: {
        text: "view"
      }
    },
    form: {
      cancel: "cancel",
      ok: "ok",
      reset: "reset"
    },
    actionbar: { add: "add" },
    toolbar: {
      columnFilter: {
        title: "columns set",
        fixed: "fixed",
        order: "sort",
        reset: "reset",
        confirm: "ok",
        unnamed: "unnamed"
      },
      search: { title: "show search bar" },
      refresh: { title: "refresh" },
      compact: { title: "compact mode" },
      export: { title: "export" },
      columns: { title: "columns set" }
    },
    search: {
      container: {
        collapseButton: {
          text: {
            collapse: "collapse",
            expand: "expand"
          }
        }
      },
      search: { text: "search" },
      reset: { text: "reset" },
      error: {
        message: "form valid error"
      }
    },
    pagination: {
      showTotal: "Total {0} items"
    },
    date: { formatter: { to: "to" } },
    extends: {
      cropper: {
        reChoose: "reChoose",
        flipX: "flipX",
        flipY: "flipY",
        reset: "reset"
      }
    }
  }
} as any;
