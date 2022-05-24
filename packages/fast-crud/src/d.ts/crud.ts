export type ScopeContext = {
  key;
  value;
  form;
  index;
  mode;
  getComponentRef: Function;
  componentRef;
};

export type PageQuery = {
  page?: any;
  form?: any;
  sort?: any;
};

export type PageRes = {
  currentPage?: number;
  pageSize?: number;
  total?: number;
  records?: Array<object>;
};

export type EditReq = {
  form?: any;
  row?: any;
};

export type AddReq = {
  form?: any;
};

export type DelReq = {
  row?: any;
};

export type InfoReq = {
  mode?: string;
  row?: any;
};

export type RequestProp = {
  transformQuery?: (query: PageQuery) => object;
  transformRes?: ({ res, query }) => PageRes;
  editRequest?: (req: EditReq) => Promise<any>;
  pageRequest?: (query: any) => Promise<any>;
  addRequest?: (req: AddReq) => Promise<any>;
  delRequest?: (req: DelReq) => Promise<any>;
  infoRequest?: (req: InfoReq) => Promise<any>;
};

export type ComponentProps = {
  [key: string]: any;
};
export type TableProps = {
  //列表数据变化事件
  onDataChange: Function;
};
export type ColProps = {
  span?: number;
  [props: string]: any;
};

/**
 * 表单对话框配置
 */
export type FormWrapperProps = {
  is?: string;
  onOpen?: (opts) => void;
  onOpened?: (opts) => void;
  onClosed?: (opts) => void;
};
/**
 * 表单分组-组配置
 */
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

/**
 * 表单分组配置
 */
export type FormGroupProps = {
  type?: string;
  groups: {
    [key: string]: FormGroupItemProps;
  };
};
/**
 * 表单配置
 */
export type FormProps = {
  /**
   * 布局方式
   */
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

export type FormItemHelperProps = {
  render?: (scope) => any;
  text?: string;
  position?: string;
  tooltip?: string;
};
/**
 * 表单字段配置
 */
export type FormItemProps = {
  /**
   * 表单字段组件配置
   */
  component?: ComponentProps;
  /**
   * 表单字段 [a|e|n]-col的配置
   * 一般用来配置跨列：{span:24} 占满一行
   */
  col?: ColProps;
  /**
   * 默认值
   */
  value?: any;
  /**
   * 帮助提示配置
   */
  helper?: string | FormItemHelperProps;
  order?: number;
};

/**
 * 工具条配置
 */
export type ToolbarProps = {
  /**
   * 按钮配置
   */
  buttons: {
    /**
     * 按钮key: 按钮配置
     */
    [key: string]: ButtonProps;
  };
};

/**
 * 按钮配置
 */
export type ButtonProps = {
  /**
   * 按钮文本
   */
  text?: string;
  /**
   * 图标
   * [图标的使用](/guide/start/icon.html)
   */
  icon?: string;
  /**
   * 文本右侧图标
   */
  iconRight?: string;
  /**
   * 是否圆形按钮
   */
  circle?: boolean;
  /**
   * 序号
   */
  order?: number;
  /**
   * 其他按钮配置 [a|e|n]-button的配置，请查看对应ui组件的文档
   */
  [key: string]: any;
};
export type ActionbarProps = {
  buttons: {
    [key: string]: ButtonProps;
  };
};
/**
 * 查询框配置
 */
export type SearchProps = {
  /**
   * 是否显示查询框
   */
  show?: boolean;
  /**
   * 查询框的按钮配置（查询和重置按钮，你还可以添加自定义按钮）
   */
  buttons?: {
    [key: string]: ButtonProps;
  };
  /**
   * 按钮的位置 【default , bottom】
   */
  buttonsPosition?: string;
  /**
   * 布局方式：【single-line单行, multi-line多行】
   */
  layout?: string;
  /**
   * 查询表单参数 ,[a|e|n]-form的参数
   */
  options?: any;
  /**
   * 其他配置
   */
  [key: string]: any;
};

/**
 * 搜索框字段配置
 */
export type SearchItemProps = {
  /**
   * 组件配置
   */
  component?: ComponentProps;
  /**
   * 值解析器
   * @param context
   */
  valueResolve?: (context: any) => void;
  /**
   * 字段排序号
   */
  order?: number;
  /**
   * [a|e|n]-col的配置
   */
  col?: ColProps;
  /**
   * 其他[a|e|n]-form-item的配置
   */
  [key: string]: any;
};

/**
 * 单元格配置
 */
export type ColumnProps = {
  /**
   * 单元格组件配置
   */
  component?: ComponentProps;
  /**
   * 在列设置中是否禁用勾选
   */
  columnSetDisabled?: Boolean;
  /**
   * 在列设置中是否显示此字段
   */
  columnSetShow?: Boolean;
  /**
   * 此列是否显示
   */
  show?: Boolean;
  /**
   * 列排序号
   */
  order?: number;
  /**
   * 格式化方法，比如格式化一下时间
   * @param scope
   */
  formatter?: (scope) => string;
  /**
   * 自定义render方法
   * @param scope
   */
  cellRender?: (scope) => any;
  /**
   * 其他x-table-column配置
   */
  [key: string]: any;
};

/**
 * 列综合配置
 */
export type ColumnCompositionProps = {
  /**
   * 列标题
   */
  title?: string;
  /**
   * 表格列配置（单元格）
   */
  column?: ColumnProps;
  /**
   * 表单字段配置
   */
  form?: FormItemProps;
  /**
   * 添加表单字段配置（与上面form合并）
   */
  addForm?: FormItemProps;
  /**
   * 编辑表单字段配置（与上面form合并）
   */
  editForm?: FormItemProps;
  /**
   * 查看表单字段配置（与上面form合并）
   */
  viewForm?: FormItemProps;
  /**
   * 查询框字段配置
   */
  search?: SearchItemProps;
  /**
   * 值构建器，pageRequest之后执行
   * 从pageRequest获取到的字段数据值可能并不是组件能够识别的值，所以需要将其做一层转化
   * 即row[key]=字段组件能够识别的值
   * @param value
   * @param key
   * @param row
   * @param form
   * @param index
   * @param mode
   */
  valueBuilder: ({ value, key, row, form, index, mode }) => void;
  /**
   * 值解析器，表单提交前执行
   * 表单输出的值可能不是后台所需要的值，所以需要在提交前做一层转化
   * 即：row[key]=后台能所需要的值
   * @param context
   */
  valueResolve: (context: any) => void;
  /**
   * 其他配置
   */
  [key: string]: any;
};

/**
 * crud配置
 */
export type CrudOptions = {
  /**
   * 模式
   */
  mode?: {
    /**
     * 模式名称: local,remote
     */
    name: string;
    /**
     *  更新时是否将表单值merge到行数据中
     */
    isMergeWhenUpdate: boolean;
    /**
     * 添加时是否在列表最后插入
     */
    isAppendWhenAdd: boolean;
    [key: string]: any;
  };
  /**
   * 表格配置
   */
  table?: TableProps;
  /**
   * 列配置
   */
  columns?: {
    /**
     * 字段key:对应的列综合配置
     */
    [prop: string]: ColumnCompositionProps;
  };
  /**
   * 列表数据，一般会从pageRequest之后更新
   */
  data?: [];
  /**
   * 操作列配置
   */
  rowHandle?: {};
  /**
   * 查询框配置
   */
  search?: SearchProps;
  /**
   * 右上角工具条配置
   */
  toolbar?: ToolbarProps;
  /**
   * 左上角动作条（默认添加按钮）
   */
  actionbar?: ActionbarProps;
  /**
   * 表单配置
   */
  form?: FormProps;
  /**
   * 添加表单的独立配置（与form配置合并）
   */
  addForm?: FormProps;
  /**
   * 编辑表单的独立配置（与form配置合并）
   */
  editForm?: FormProps;
  /**
   * 查看表单的独立配置（与form配置合并）
   */
  viewForm?: FormProps;
  /**
   * 底部翻页组件配置
   */
  pagination?: {};
  /**
   * http请求配置
   */
  request?: RequestProp;
  /**
   * 其他配置
   */
  [key: string]: any;
};
