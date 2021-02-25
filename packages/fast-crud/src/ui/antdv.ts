import { CI, DialogCI, IconCI, Icons, SelectCI, TableCI, TableColumnCI, TextAreaCI, UiInterface } from './ui-interface'
export class Antdv implements UiInterface {
  type='antdv'
  icon: IconCI={
    name: '',
    isComponent: true,
    circle: { shape: 'circle' }
  };

  icons: Icons={
    add: 'PlusOutlined',
    columnsFilter: 'ControlOutlined',
    compact: 'DragOutlined',
    edit: 'EditOutlined',
    export: 'UploadOutlined',
    refresh: 'SyncOutlined',
    remove: 'DeleteOutlined',
    search: 'SearchOutlined'
  };

  dialog: DialogCI={
    name: 'a-modal',
    visible: 'visible'
  };

  button: CI={
    name: 'a-button'
  };

  buttonGroup: CI={
    name: 'a-button-group'
  };

  card: CI={
    name: 'a-card'
  };

  checkbox: CI={
    name: 'a-checkbox'
  };

  col: CI={
    name: 'a-col'
  };

  collapseTransition: CI={
    name: 'div'
  };

  drawer: CI={
    name: 'a-drawer'
  };

  form: CI={
    name: 'a-form'
  };

  formItem: CI={
    name: 'a-form-item'
  };

  option: CI={
    name: 'a-select-option'
  };

  pagination: CI={
    name: 'a-pagination'
  };

  radio: CI={
    name: 'a-radio'
  };

  radioGroup: CI={
    name: 'a-radio-group'
  };

  row: CI={
    name: 'a-row'
  };

  select: SelectCI={
    name: 'a-select',
    modelValue: 'value'
  };

  table: TableCI={
    name: 'a-table',
    data: 'data-source'
  }

  tableColumn: TableColumnCI={
    name: 'a-table-column',
    label: 'title',
    prop: 'key',
    row: 'record',
    index: 'index'
  };

  tableColumnGroup: TableColumnCI={
    name: 'a-table-column-group',
    label: 'title',
    prop: 'key',
    row: 'record',
    index: 'index'
  };

  textArea: TextAreaCI={ name: 'a-textarea', type: undefined };
  tag: CI = {
    name: 'a-tag'
  };

  input= {
    name: 'a-input'
  }
}
