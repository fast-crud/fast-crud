import { TextAreaCI, CI, UiInterface, DialogCI, TableColumnCI } from './ui-interface'
export class Element implements UiInterface {
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

  select: CI={
    name: 'el-select'
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
    prop: 'prop'
  };

  table: CI={
    name: 'el-table'
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
