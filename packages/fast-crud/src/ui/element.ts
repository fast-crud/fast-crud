import {
  TextAreaCI,
  CI,
  UiInterface,
  DialogCI,
  TableColumnCI,
  Icons,
  IconCI,
  TableCI,
  SelectCI,
  MessageCI, NotificationCI, MessageBoxCI, InputCI
} from './ui-interface'
export class Element implements UiInterface {
  constructor (target) {
    if (target) {
      this.notification.get = target.Notification
      this.message.get = target.Message
      this.messageBox.get = target.MessageBox
    }
  }

  type='element'

  messageBox: MessageBoxCI={
    name: 'el-message-box',
    get: undefined,
    open: async (context) => {
      return this.messageBox.get(context)
    },
    confirm: async (context) => {
      return this.messageBox.get(context)
    }

  };

  message: MessageCI={
    get: undefined,
    name: 'el-message',
    open: (context) => {
      this.message.get.open(context)
    },
    success: (msg) => {
      this.message.get.success(msg)
    },
    error: (msg) => {
      this.message.get.error(msg)
    },
    warn: (msg) => {
      this.message.get.warn(msg)
    },
    info: (msg) => {
      this.message.get.success(msg)
    }
  };

  notification: NotificationCI={
    get: undefined,
    name: 'el-notification',
    open: (context) => {
      this.notification.get.open(context)
    },
    success: (msg) => {
      this.notification.get.success(msg)
    },
    error: (msg) => {
      this.notification.get.error(msg)
    },
    warn: (msg) => {
      this.notification.get.warn(msg)
    },
    info: (msg) => {
      this.notification.get.success(msg)
    }
  };

  icon: IconCI={
    name: '',
    isComponent: false,
    circle: { circle: true }
  };

  icons: Icons={
    add: 'el-icon-plus',
    columnsFilter: 'el-icon-set-up',
    compact: 'el-icon-rank',
    edit: 'el-icon-edit',
    remove: 'el-icon-remove',
    search: 'el-icon-search',
    refresh: 'el-icon-refresh',
    export: 'el-icon-upload2'
  };

  dialog: DialogCI={
    name: 'el-dialog',
    visible: 'modelValue'
  };

  buttonGroup: CI={
    name: 'el-button-group'
  };

  col: CI={
    name: 'el-col'
  };

  row: CI={
    name: 'el-row'
  };

  card: CI={
    name: 'el-card'
  };

  checkbox: CI={
    name: 'el-checkbox'
  };

  drawer: CI={
    name: 'el-drawer'
  };

  collapseTransition: CI={
    name: 'el-collapse-transition'
  };

  option: CI={
    name: 'el-option'
  };

  select: SelectCI={
    name: 'el-select',
    modelValue: 'modelValue',
    clearable: 'clearable'
  };

  radio: CI={
    name: 'el-radio'
  };

  radioGroup: CI={
    name: 'el-radio-group'
  };

  form: CI={
    name: 'el-form'
  };

  formItem: CI={
    name: 'el-form-item'
  };

  button: CI={
    name: 'el-button'
  };

  pagination: CI={
    name: 'el-pagination'
  };

  tableColumn: TableColumnCI={
    name: 'el-table-column',
    label: 'label',
    prop: 'prop',
    row: 'row',
    index: '$index'
  };

  tableColumnGroup: TableColumnCI={
    name: 'el-table-column',
    label: 'label',
    prop: 'prop',
    row: 'row',
    index: '$index'
  };

  table: TableCI={
    name: 'el-table',
    data: 'data'
  }

  textArea: TextAreaCI ={
    name: 'el-input',
    type: 'textarea'
  };

  tag: CI ={
    name: 'el-tag'
  };

  input: InputCI={
    name: 'el-input',
    clearable: 'clearable'
  }
}
