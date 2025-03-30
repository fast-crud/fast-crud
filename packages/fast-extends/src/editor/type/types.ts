export default function () {
  return {
    "editor-wang": {
      form: { component: { name: "fs-editor-wang" } }
    },
    "editor-wang5": {
      form: { component: { name: "fs-editor-wang5", style: { zIndex: 800 }, toolbarAttrs: { style: { zIndex: 800 } } } }
    },
    "editor-code": {
      form: { component: { name: "fs-editor-code" }, col: { span: 24 } }
    }
  };
}
