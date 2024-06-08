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
      copy: {
        text: "copy"
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
      reset: "reset",
      saveRemind: {
        title: "save remind",
        content: "The form data has changed, whether to save",
        cancel: "don't save",
        ok: "save"
      }
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
      tableSelect: {
        view: "view",
        select: "select"
      },
      cropper: {
        title: "image crop",
        preview: "preview",
        reChoose: "reChoose",
        flipX: "flipX",
        flipY: "flipY",
        reset: "reset",
        cancel: "cancel",
        confirm: "confirm",
        chooseImage: "+ choose image",
        onlySupport: "only",
        sizeLimit: "size limit",
        sizeNoLimit: " no limit"
      },
      fileUploader: {
        text: "fileUpload",
        limitTip: "file count limit: {0}",
        sizeLimitTip: "file size limit:  {0}, current size: {1}",
        loadError: "image load error",
        pixelLimitTip: "pixel limit : width:{0},height:{1}",
        hasUploading: "The file is being uploaded, please wait for the upload to complete or delete"
      }
    }
  }
} as any;
