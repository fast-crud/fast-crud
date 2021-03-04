export default {
  name: "en",
  fs: {
    addForm: { title: "add" },
    editForm: { title: "edit" },
    viewForm: { title: "view" },
    rowHandle: {
      title: "handle",
      remove: {
        text: "remove",
        confirmTitle: "remove tip",
        confirmMessage: "Are you sure you want to delete this record?",
        success: "delete success!",
      },
      edit: {
        text: "edit",
      },
      view: {
        text: "view",
      },
    },
    form: {
      cancel: "cancel",
      ok: "ok",
    },
    actionbar: { add: "add" },
    toolbar: {
      columnFilter: {
        title: "columns set",
        fixed: "fixed",
        order: "sort",
        reset: "reset",
        confirm: "ok",
        unnamed: "unnamed",
      },
      search: { title: "show search bar" },
      refresh: { title: "refresh" },
      compact: { title: "compact mode" },
      export: { title: "export" },
      columns: { title: "columns set" },
    },
    search: {
      search: { text: "search" },
      reset: { text: "reset" },
      error: {
        message: "form valid error",
      },
    },
    pagination: {
      showTotal: "Total {n} items",
    },
  },
};
