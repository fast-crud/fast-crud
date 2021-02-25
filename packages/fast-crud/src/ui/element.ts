import { TextAreaCI, CI, UiInterface, DialogCI, TableColumnCI, Icons, IconCI, TableCI, SelectCI } from './ui-interface'
export class Element implements UiInterface {
  type='element'
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
    modelValue: 'modelValue'
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

  input: CI={
    name: 'el-input'
  }
}
