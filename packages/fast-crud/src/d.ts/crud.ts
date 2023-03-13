import { ToolbarComponentProps } from "/src/components/toolbar/props";
import { Ref } from "vue";
import { ComputeContext } from "/src/d.ts/compute";
import { AsyncComputeValue, GetContextFn } from "/src/use";

// export type FsRefValue<T> = T | Ref<T> | ComputedRef<T>;
// export type FsComputeValue<T> = FsRefValue<T> | ComputeValue<T> | AsyncComputeValue<T>;

export type ScopeContext = {
  /**
   * 字段key
   */
  key: string;
  /**
   * 字段值
   */
  value: any;
  /**
   * 表单数据
   */
  form: any;

  /**
   * 行数据
   */
  row: any;

  /**
   * naive ui 有record
   */
  record?: any;
  /**
   * 第几行
   */
  index: number;
  /**
   * 表单模式,add,view,edit
   */
  mode: string;
  /**
   * 获取其他字段组件ref
   */
  getComponentRef: (key: string) => any;
  /**
   * 当前字段组件的ref
   */
  componentRef: any;
};

export type PageQuery = {
  page?: any;
  form?: any;
  sort?: any;
  [key: string]: any;
};

export type PageRes = {
  currentPage?: number;
  pageSize?: number;
  total?: number;
  records?: Array<object>;
  [key: string]: any;
};

export type EditReq = {
  form?: any;
  row?: any;
  [key: string]: any;
};

export type AddReq = {
  form?: any;
  [key: string]: any;
};

export type DelReq = {
  row?: any;
  [key: string]: any;
};

export type InfoReq = {
  mode?: string;
  row?: any;
  [key: string]: any;
};

export type UserPageRes = {
  [key: string]: any;
};

/**
 * 用户自定义的后台翻页参数
 */
export type UserPageQuery = {
  [key: string]: any;
};

export type TransformResProps = {
  res: UserPageRes;
  query: UserPageQuery;
};

export type TransformQuery = (query: PageQuery) => UserPageQuery;
export type TransformRes = (props: TransformResProps) => PageRes;
export type PageRequest = (query: UserPageQuery) => Promise<UserPageRes>;
export type EditRequest = (req: EditReq) => Promise<any>;
export type AddRequest = (req: AddReq) => Promise<any>;
export type DelRequest = (req: DelReq) => Promise<any>;
export type InfoRequest = (req: InfoReq) => Promise<any>;

/**
 * 请求配置
 */
export type RequestProp = {
  transformQuery?: TransformQuery;
  transformRes?: TransformRes;
  pageRequest?: PageRequest;
  addRequest?: AddRequest;
  editRequest?: EditRequest;
  delRequest?: DelRequest;
  infoRequest?: InfoRequest;

  [key: string]: any;
};
/**
 * 组件配置
 */
export type ComponentProps = {
  show?: boolean;
  /**
   * 组件的名称
   */
  name?: string | object;
  /**
   * vmodel绑定的目标属性名
   */
  vModel?: string;

  /**
   * 当原始组件名的参数被以上属性名占用时，可以配置在这里
   * 例如:原始组件有一个叫name的属性，你想要配置它，则可以按如下配置
   * ```
   * component:{
   *   name:"组件的名称"
   *   props:{
   *     name:"组件的name属性"  <-----------
   *   }
   * }
   * ```
   */
  props?: {
    [key: string]: any;
  };

  /**
   * 组件事件监听
   */
  on?: {
    [key: string]: (context?: any) => void;
  };

  /**
   * 组件其他参数
   * 事件：onXxx:(event)=>void 组件原始事件监听
   *      on.onXxx:(context)=>void 组件事件监听(对原始事件包装)
   * 样式：style、class等
   */
  [key: string]: any;
};

export type RemoveConfirmFn = (context: any) => Promise<any>;
/**
 * 删除操作配置
 */
export type RemoveProps = {
  /**
   * 自定义确认删除，抛出异常则取消
   * @param context
   */
  confirmFn?: RemoveConfirmFn;
  /**
   * 自定义删除确认标题
   * confirm未配置时生效
   */
  confirmTitle?: string;
  /**
   * 自定义删除确认内容
   * confirm未配置时生效
   */
  confirmMessage?: string;

  /**
   * 删除后刷新列表
   */
  refreshTable?: boolean;

  /**
   * 显示成功提示
   */
  showSuccessNotification?: boolean;

  /**
   * 当取消删除时
   * @param context
   */
  onCanceled?: (context: any) => Promise<any>;

  /**
   * 删除成功后的操作
   * @param context
   */
  onRemoved?: (context: any) => Promise<any>;

  [key: string]: any;
};
/**
 * 表格配置
 */
export type TableProps = {
  /**
   * 调用doRefresh完成之后触发
   */
  onRefreshed?: (context: { data: any[] }) => void;

  /**
   * 删除配置
   */
  remove?: RemoveProps;

  /**
   * [x]-table组件的配置
   */
  [key: string]: any;
};
/**
 * [x]-col的配置
 */
export type ColProps = {
  span?: number;
  [props: string]: any;
};

/**
 * 表单对话框配置
 */
export type FormWrapperProps = {
  /**
   * 对话框使用什么组件，[el-dialog,a-modal,n-modal,el-drawer,a-drawer,n-drawer]
   */
  is?: string;
  /**
   * 对话框打开前事件处理
   * @param opts
   */
  onOpen?: (opts: any) => void;
  /**
   * 对话框打开后事件处理
   * @param opts
   */
  onOpened?: (opts: any) => void;
  /**
   * 对话框关闭后事件处理
   * @param opts
   */
  onClosed?: (opts: any) => void;

  /**
   * 对应对话框组件的配置
   */
  [key: string]: any;
};
/**
 * 表单分组-组配置
 */
export type FormGroupItemProps = {
  /**
   * 分组标题（根据你使用的分组组件和组件库来确定标题）
   */
  title?: string;
  /**
   * 分组标题（根据你使用的分组组件和组件库来确定标题）
   */
  label?: string;
  /**
   * 分组标题（根据你使用的分组组件和组件库来确定标题）
   */
  header?: string;
  /**
   * [a|el|n]-tab-panel的参数
   */
  tab?: any;
  /**
   * 插槽，可以用来自定义标题
   */
  slots?: {
    [key: string]: any;
  };
  /**
   * 此分组包含哪些字段,keys数组
   */
  columns?: Array<string>;
  /**
   *  其他配置
   *  支持el-collapse-item，el-tab-pane，a-collapse-panel，a-tab-pane 等组件的配置
   */
  [key: string]: any;
};

/**
 * 表单分组配置
 */
export type FormGroupProps = {
  type?: string;
  groups?: {
    [key: string]: FormGroupItemProps;
  };
  [key: string]: any;
};
/**
 * 表单配置
 */
export type FormProps = {
  /**
   * 表单初始值
   */
  initialForm?: any;

  /**
   * 表单模式 [add/edit/view]
   */
  mode?: string;

  /**
   * 布局方式
   */
  display?: "flex" | "grid";
  /**
   * a-col,el-col，n-col的配置
   * 可以配置跨列 {span:24}表示此字段占满一行
   */
  col?: ColProps;
  /**
   * 字段组件之前render
   * @param scope
   */
  prefixRender?: (scope: any) => any;
  /**
   * 字段组件之后render
   * @param scope
   */
  suffixRender?: (scope: any) => any;
  /**
   * 表单对话框/抽屉配置
   */
  wrapper?: FormWrapperProps;
  /**
   * 提交表单的方法（默认已经配置好，将会调用addRequest或者updateRequest）
   */
  doSubmit?: (context: any) => Promise<any>;
  /**
   * 提交前做一些操作
   */
  beforeSubmit?: (context: any) => Promise<any>;
  /**
   * 提交后做一些操作
   * @param context
   */
  afterSubmit?: (context: any) => Promise<any>;

  /**
   * 值变化后的操作
   * @param context
   */
  valueChange?: (context: any) => void | { immediate?: boolean; handle?: (context: any) => void };
  /**
   * 表单重置时的操作
   */
  doReset?: () => Promise<any>;

  /**
   * 表单分组配置
   */
  group?: FormGroupProps;

  /**
   * 插槽render
   */
  slots?: {
    [key: string]: () => any;
  };
  /**
   * 其他表单配置 [x]-form的配置
   */
  [key: string]: any;
};

/**
 * 表单字段帮助说明配置
 */
export type FormItemHelperProps = {
  /**
   * 自定义渲染帮助说明
   * @param scope
   */
  render?: (scope: any) => any;
  /**
   * 帮助文本
   */
  text?: string;
  /**
   * 帮助说明所在的位置，[ undefined | label]
   */
  position?: string;
  /**
   * [a|el|n]-tooltip配置
   */
  tooltip?: object;

  [key: string]: any;
};
/**
 * 表单字段配置
 */
export type FormItemProps = {
  /**
   * 字段label
   */
  title?: string;
  /**
   * 表单字段组件配置
   */
  component?: ComponentProps;
  /**
   * 表单字段 [a|el|n]-col的配置
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
  /**
   * 排序号
   */
  order?: number;
  /**
   * 是否显示此字段
   */
  show?: boolean;
  /**
   * 是否是空白占位栏
   */
  blank?: boolean;

  /**
   * 是否提交给后台
   */
  submit?: boolean;

  [key: string]: any;
};

/**
 * crud外部容器配置
 */
export type ContainerProps = {
  /**
   * 布局容器组件名称
   */
  is?: string;
  [key: string]: any;
};

/**
 * 工具条配置
 */
export type ToolbarProps = {
  [key: string]: any;
} & ToolbarComponentProps;

type ButtonIconProps = string | { icon: string; [key: string]: any };
type NullableString = string | null;
/**
 * 按钮配置
 */
export type ButtonProps = {
  /**
   * 按钮文本
   */
  text?: NullableString;
  /**
   * 图标
   * [图标的使用](/guide/start/icon.html)
   */
  icon?: ButtonIconProps;
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
   * 是否折叠此按钮，仅当rowHandle时有效
   * 当配置为true，将会收起到dropdown中
   */
  dropdown?: boolean;

  /**
   * 点击事件
   */
  click?: (context: any) => void;

  show?: boolean;

  /**
   * 其他按钮配置 [a|el|n]-button的配置，请查看对应ui组件的文档
   */
  [key: string]: any;
};
type ButtonsProps = {
  [key: string]: ButtonProps;
};
export type ActionbarProps = {
  buttons?: ButtonsProps;

  [key: string]: any;
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
  buttons?: ButtonsProps;
  /**
   * 布局方式：【single-line单行, multi-line多行】
   */
  layout?: string;
  /**
   * 查询表单参数 ,[a|el|n]-form的参数
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
   * [a|el|n]-col的配置
   */
  col?: ColProps;
  /**
   * 其他[a|el|n]-form-item的配置
   */
  [key: string]: any;
};

/**
 * 单元格配置
 */
export type ColumnProps = {
  key?: string;
  /**
   * 单元格组件配置
   */
  component?: ComponentProps;
  /**
   * 在列设置中是否禁用勾选
   */
  columnSetDisabled?: boolean;
  /**
   * 在列设置中是否显示此字段
   */
  columnSetShow?: boolean;
  /**
   * 此列是否显示
   */
  show?: boolean;
  /**
   * 列排序号
   */
  order?: number;
  /**
   * 格式化方法，比如格式化一下时间
   * @param scope
   */
  formatter?: (scope: any) => string;
  /**
   * 自定义render方法
   * @param scope
   */
  cellRender?: (scope: any) => any;

  /**
   * 多级表头
   */
  children?: ColumnProps[];
  /**
   * 其他x-table-column配置
   */
  [key: string]: any;
};

/**
 * valueBuild参数
 */
export type ValueBuilderContext = {
  value: any;
  key: string;
  row?: any;
  form?: any;
  index: number;
  mode?: string;
  column?: any;
};
export type ValueResolveContext = {
  value: any;
  key: string;
  row?: any;
  form?: any;
  index: number;
  mode?: string;
  column?: any;
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
   * 添加表单字段配置（与form合并）
   */
  addForm?: FormItemProps;
  /**
   * 编辑表单字段配置（与form合并）
   */
  editForm?: FormItemProps;
  /**
   * 查看表单字段配置（与form合并）
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
   * @param context
   */
  valueBuilder?: (context: ValueBuilderContext) => void;
  /**
   * 值解析器，表单提交前执行
   * 表单输出的值可能不是后台所需要的值，所以需要在提交前做一层转化
   * 即：row[key]=后台能所需要的值
   * @param context
   */
  valueResolve?: (context: ValueResolveContext) => void;
  /**
   * 其他配置
   */
  [key: string]: any;
};

/**
 * 底部翻页条配置
 */
export type PaginationProps = {
  /**
   * 是否显示pagination
   */
  show?: boolean;
  /**
   * [x]-pagination组件的其他配置
   */
  [key: string]: any;
};

type RowHandleDropdownProps = {
  /**
   * 更多按钮
   */
  more?: ButtonProps;

  [key: string]: any;
};
type RowHandleGroupProps = {
  /**
   * 按钮组组key
   */
  [groupKey: string]: {
    /**
     * 按钮
     */
    [buttonKey: string]: ButtonProps;
  };
};
/**
 * 操作列配置
 */
export type RowHandleProps = {
  /**
   * 是否显示操作列
   */
  show?: boolean;
  /**
   * 操作列按钮配置
   */
  buttons?: ButtonsProps;

  dropdown?: RowHandleDropdownProps;

  /**
   * 额外的按钮组
   * 激活时就显示，没激活的不显示
   * 同一时间只能激活一组
   */
  group?: RowHandleGroupProps;

  /**
   * 当前激活是哪个分组
   * 默认为default，激活的buttons里面配置的按钮组
   */
  active?: string;

  /**
   * 其他配置
   */
  [key: string]: any;
};
/**
 * 复合columns配置
 */
export type CompositionColumns = {
  /**
   * 字段key:对应的列综合配置
   */
  [prop: string]: ColumnCompositionProps;
};

/**
 * crud配置
 */
export type CrudOptions = {
  /**
   * 列配置
   */
  columns?: CompositionColumns;
} & CrudBinding;

type CrudSetting = {
  viewFormUseCellComponent?: false;
};
type CrudMode = {
  /**
   * 模式名称: local,remote
   */
  name?: string;
  /**
   *  更新时是否将表单值merge到行数据中
   */
  isMergeWhenUpdate?: boolean;
  /**
   * 添加时是否在列表最后插入
   */
  isAppendWhenAdd?: boolean;
  [key: string]: any;
};
/**
 * crudBinding
 */
export type CrudBinding = {
  setting?: CrudSetting;
  /**
   * 模式
   */
  mode?: CrudMode;

  /**
   * 表格配置
   */
  table?: TableProps;
  /**
   * 列表数据，一般会从pageRequest之后更新
   */
  data?: any[];
  /**
   * 操作列配置
   */
  rowHandle?: RowHandleProps;
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
  pagination?: PaginationProps;
  /**
   * http请求配置
   */
  request?: RequestProp;

  /**
   * crud外部容器配置
   */
  container?: ContainerProps;
  /**
   * 其他配置
   */
  [key: string]: any;
};

export type ComputeRef<T = any> = {
  computeFn: (context: ComputeContext) => T;
};

export type ComputeFn<T> = (context: ComputeContext) => T;

export type AsyncComputeRef<T> = {
  watch?: (getContextFn: GetContextFn) => any;
  asyncFn: (value: any, getContextFn: GetContextFn) => Promise<T>;
  defaultValue?: any;
};

export type RefableType<T> = Ref<T> | ComputeRef<T> | AsyncComputeRef<T> | DynamicType<T>;

export type DynamicType<T> = {
  [P in keyof T]: T[P] | RefableType<T[P]>;
};

/**
 * crudOptions支持动态化配置
 */
export type DynamicallyCrudOptions = DynamicType<CrudOptions>;
