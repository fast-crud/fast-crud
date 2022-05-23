export type ScopeContext = {
  key;
  value;
  form;
  index;
  mode;
  getComponentRef: Function;
  componentRef;
};

export interface PageQuery {
  page?: any;
  form?: any;
  sort?: any;
}

export interface PageRes {
  currentPage?: number;
  pageSize?: number;
  total?: number;
  records?: Array<object>;
}

export interface EditReq {
  form?: any;
  row?: any;
}

export interface AddReq {
  form?: any;
}

export interface DelReq {
  row?: any;
}

export interface InfoReq {
  mode?: string;
  row?: any;
}

export interface RequestProp {
  transformQuery?: (query: PageQuery) => object;
  transformRes?: ({ res, query }) => PageRes;
  editRequest?: (req: EditReq) => Promise<any>;
  pageRequest?: (query: any) => Promise<any>;
  addRequest?: (req: AddReq) => Promise<any>;
  delRequest?: (req: DelReq) => Promise<any>;
  infoRequest?: (req: InfoReq) => Promise<any>;
}

export interface ComponentProps {
  [key: string]: any;
}
export type TableProps = {
  //列表数据变化事件
  onDataChange: Function;
};
export type ColProps = {
  span?: number;
  [props: string]: any;
};
export type FormWrapperProps = {
  is?: string;
  onOpen?: (opts) => void;
  onOpened?: (opts) => void;
  onClosed?: (opts) => void;
};
export type FormGroupItemProps = {
  title?: string; //标题
  label?: string; //element标题
  header?: string; //antdv 标题
  tab?: any; // a-tab-pane 参数
  slots?: {
    //插槽，可以自定义标题
  };
  columns?: Array<string>; //该分组包含的字段keys
  // 支持el-collapse-item，el-tab-pane，a-collapse-panel，a-tab-pane
  [key: string]: any;
};
export type FormGroupProps = {
  type?: string;
  groups: {
    [key: string]: FormGroupItemProps;
  };
};
export type FormProps = {
  display?: "flex" | "grid";
  //a-col,e-col，n-col的配置
  col?: ColProps;
  prefixRender?: (scope) => any;
  suffixRender?: (scope) => any;
  wrapper?: FormWrapperProps;
  doSubmit?: () => Promise<any>;
  beforeSubmit: () => Promise<any>;
  afterSubmit: () => Promise<any>;
  doReset?: () => Promise<any>;
  group?: FormGroupProps;
  [key: string]: any;
};

export type FormItemProps = {
  component?: ComponentProps;
  col?: ColProps;
  value?: any;
  helper?: string | { render?: (scope) => any; text?: string };
  order?: number;
};
export type ToolbarProps = {
  buttons: {
    [key: string]: ButtonProps;
  };
};
export type ButtonProps = {
  text?: string;
  icon?: string;
  iconRight?: string;
  circle?: boolean;
  order?: number;
};
export type ActionbarProps = {
  buttons: {
    [key: string]: ButtonProps;
  };
};
export type SearchProps = {
  show?: boolean;
  buttons?: {
    [key: string]: ButtonProps;
  };
  //按钮的位置
  buttonsPosition?: string;
  //布局方式：single-line单行, multi-line多行
  layout?: string;
  //查询表单参数
  options?: any;
  [key: string]: any;
};
export type SearchItemProps = {
  component?: ComponentProps;
  valueResolve?: (context: any) => void;
  order?: number;
  col?: ColProps;
  [key: string]: any;
};

export type ColumnProps = {
  component?: ComponentProps;
  columnSetDisabled?: Boolean;
  show?: Boolean;
  formatter?: (scope) => string;
  order?: number;
  cellRender?: (scope) => any;
  //其他x-table-column配置
  [key: string]: any;
};
export type ColumnCompositionProps = {
  title?: string;
  key?: string;
  column?: ColumnProps;
  form?: FormItemProps;
  addForm?: FormItemProps;
  editForm?: FormItemProps;
  search?: SearchItemProps;
  valueBuilder: ({ value, key, row, form, index, mode }) => void;
  valueResolve: (context: any) => void;
  [key: string]: any;
};

export type CrudOptions = {
  mode?: {
    //模式名称: local,remote
    name: string;
    // 更新时是否merge
    isMergeWhenUpdate: boolean;
    // 添加时是否在列表最后插入
    isAppendWhenAdd: boolean;
    [key: string]: any;
  };
  table?: TableProps;
  columns?: {
    [prop: string]: ColumnCompositionProps;
  };
  data?: [];
  rowHandle?: {};
  search?: SearchProps;
  toolbar?: ToolbarProps;
  actionbar?: ActionbarProps;
  form?: FormProps;
  addForm?: FormProps;
  editForm?: FormProps;
  viewForm?: FormProps;
  pagination?: {};
  request?: RequestProp;
  [key: string]: any;
};
