import { Ref, ShallowRef } from "vue";
import { ComputeContext } from "./compute";
import { Dict, GetContextFn } from "../use";
import { DoRemoveContext } from "../d/expose";

import { RuleItem } from "async-validator";
import { UiSlot, UiSlotRet } from "@fast-crud/ui-interface";
import { ExportProps } from "../lib/fs-export";

// export type FsRefValue<T> = T | Ref<T> | ComputedRef<T>;
// export type FsComputeValue<T> = FsRefValue<T> | ComputeValue<T> | AsyncComputeValue<T>;

export type RowContext = {
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
};
export type ScopeContext = {
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
  componentRef?: any;

  /**
   * ui特有的context属性
   */
  [key: string]: any;
} & RowContext;

export type ComponentRenderContext = {
  /**
   * 继承component的attrs
   */
  attrs: any;
} & ScopeContext;

export type FormScopeContext = {
  /**
   * 初始form数据
   */
  initialForm: any;
  /**
   * 属性
   */
  attrs: any;
  /**
   * 提交成功后的response
   */
  res?: any;
} & ScopeContext;

export type ComponentEventContext = {
  /**
   * 原始事件
   */
  $event: any;
} & ScopeContext;

export type ValueChangeContext = {
  /**
   * 当前是否是第一次触发的
   */
  immediate: boolean;
} & ScopeContext;

/**
 * valueChange复合配置
 */
export type ValueChangeProps = {
  /**
   * 是否立即触发一次
   */
  immediate?: boolean;
  /**
   * valueChange处理器
   */
  handle: ValueChangeHandle;
};
/**
 * valueChange 处理器
 */
export type ValueChangeHandle = (context: ValueChangeContext) => Promise<void>;

export type Page = {
  /**
   * 当前页
   */
  currentPage?: number;
  /**
   * 每页条数
   */
  pageSize?: number;
};
/**
 * 查询排序参数
 */
export type PageSort = { prop?: string; order?: string; asc?: boolean };
/**
 * 查询
 */
export type PageQuery = {
  /**
   * 翻页参数
   */
  page?: Page;
  /**
   * 查询表单
   */
  form?: any;
  /**
   * 远程排序配置
   */
  sort?: PageSort;
};

/**
 * fs-crud能够接受的页面数据格式，
 * 如果你的后台与此格式不一致，你需要转化成此格式，
 * 请参考transformRes
 */
export type PageRes = {
  /**
   * 当前页
   */
  currentPage: number;
  /**
   * 每页条数
   */
  pageSize: number;
  /**
   * 总记录数
   */
  total: number;
  /**
   * 列表数据
   */
  records: Array<object>;
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

/**
 * 用户后台page请求原始返回
 */
export type UserPageRes = {
  [key: string]: any;
};

/**
 * 用户自定义的后台翻页参数
 */
export type UserPageQuery = {
  [key: string]: any;
};

/**
 * 页面数据转换参数
 */
export type TransformResProps = {
  /**
   * 用户页面请求实际返回
   */
  res: UserPageRes;
  /**
   * 本次请求参数
   */
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
 * 可改变的插槽集合
 */
export type WriteableSlots = {
  [name: string]: UiSlot;
};

/**
 * vModel支持trim,number
 */
export type VModelProps = {
  /**
   * vModel name
   */
  name?: string;
  /**
   * 是否trim
   */
  trim?: boolean;
  /**
   * 是否转换成number
   */
  number?: boolean;
  /**
   * 自定义转换器
   * @param value
   */
  transform?: (value: any) => any;
};
/**
 * 组件配置
 */
export type ComponentProps = {
  /**
   * 是否显示组件
   */
  show?: boolean;
  /**
   * 组件的名称
   */
  name?: string | ShallowRef;
  /**
   * vmodel绑定的目标属性名
   */
  vModel?: string | VModelProps;

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
   * 组件事件监听,带上下文
   */
  on?: {
    [key: string]: (context?: ComponentEventContext) => void;
  };

  /**
   * 同on，即将废弃
   */
  events?: {
    [key: string]: (context?: ComponentEventContext) => void;
  };

  /**
   * 插槽
   */
  slots?: WriteableSlots;

  /**
   * 同插槽
   */
  children?: WriteableSlots;

  /**
   * 直接渲染
   * @param scope
   */
  render?: (scope: ComponentRenderContext) => any;

  /**
   * 组件其他参数，如style、class、onXxx事件等
   */
  [key: string]: any;
};

export type RemoveConfirmFn = (context: DoRemoveContext) => Promise<void>;
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

  /**
   * 实际删除操作
   * @param context
   */
  handle?: (context: any) => Promise<any>;

  [key: string]: any;
};

export type ConditionalRenderProps = {
  match: (scope: ScopeContext) => boolean;
  render: (scope: ScopeContext) => UiSlotRet;
};

export type CellConditionalRender = ConditionalRenderProps;

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
   * x-table 插槽
   */
  slots?: WriteableSlots;

  /**
   * 表格数据
   */
  data?: any[];

  /**
   * 单元格列配置
   */
  columns?: TableColumnsProps;

  /**
   * 列配置 map
   */
  columnsMap?: TableColumnsProps;

  /**
   * 条件渲染
   */
  conditionalRender?: ConditionalRenderProps;

  /**
   * 表格最大高度调整
   */
  maxHeightAdjust?: number;
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
   * 是否支持拖拽
   */
  draggable?: boolean;
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

  buttons?: {
    [key: string]: ButtonProps<FormWrapperContext>;
  };
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
  slots?: WriteableSlots;
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
   * a-row的配置
   */
  row?: any;
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
   * 提交前做一些操作,返回false或抛异常，阻止后续操作
   */
  beforeSubmit?: (context: FormScopeContext) => Promise<boolean>;

  /**
   * 提交表单的方法（默认已经配置好，将会调用addRequest或者updateRequest）
   */
  doSubmit?: (context: FormScopeContext) => Promise<any>;
  /**
   * 提交后做一些操作，可以抛异常来阻止后续操作，其中context.res = doSubmit的返回值
   * @param context
   */
  afterSubmit?: (context: FormScopeContext) => Promise<any>;

  /**
   * 成功后的操作，afterSubmit未抛异常时执行，默认为刷新表格
   * @param context
   */
  onSuccess?: (context: FormScopeContext) => Promise<any>;

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

  /**
   * 自定义配置
   */
  [key: string]: any;
};

export type FormItemTitleRender = (context: ScopeContext) => any;

export type RuleRecord = {
  trigger?: string;
} & RuleItem;
/**
 * 表单字段配置
 */
export type FormItemProps = {
  /**
   * 字段label
   */
  title?: string | FormItemTitleRender;
  /**
   * 表单字段组件配置
   */
  component?: ComponentProps;
  /**
   * 表单字段 x-col的配置
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

  /**
   * 表单valueChange
   */
  valueChange?: ValueChangeHandle | ValueChangeProps;

  /**
   * 值构建器，打开对话框时执行
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
   * 条件渲染
   * @param scope
   */
  conditionalRender?: ConditionalRenderProps;

  /**
   * 直接渲染组件
   * @param scope
   */
  render?: (scope: ScopeContext) => any;

  /**
   * 组件左边渲染
   * @param scope
   */
  prefixRender?: (scope: ScopeContext) => any;

  /**
   * 组件右边渲染
   * @param scope
   */
  suffixRender?: (scope: ScopeContext) => any;

  /**
   * 组件上方渲染
   * @param scope
   */
  topRender?: (scope: ScopeContext) => any;

  /**
   * 组件下方渲染
   * @param scope
   */
  bottomRender?: (scope: ScopeContext) => any;
  /**
   * 校验规则
   */
  rules?: RuleRecord | RuleRecord[];

  /**
   * fs-form-item 、 x-form-item的其他配置
   */
  [key: string]: any;
};

/**
 * crud外部容器配置
 */
export type ContainerProps = {
  /**
   * 布局容器组件名称
   */
  is?: string | ShallowRef;
  [key: string]: any;
};

export type ColumnsFilterComponentProps = {
  /**
   * 布局容器组件配置
   */
  container?: {
    is?: string | ShallowRef;
    [key: string]: any;
  };

  /**
   * 列配置组件名称
   */
  is?: string | ShallowRef;
  /**
   * 是否显示列设置抽屉
   */
  show?: boolean;
  /**
   * 模式，default,simple
   */
  mode?: string;
  /**
   * 列数据
   */
  columns?: TableColumnsProps;

  /**
   * 原始列数据，还原成此列表
   */
  originalColumns?: TableColumnsProps;
  /**
   * 是否保存设置
   */
  storage?: boolean | string;
  /**
   * 文本设置
   */
  text?: {
    /**
     * 标题
     */
    title?: string;
    /**
     * 固定
     */
    fixed?: string;
    /**
     * 排序
     */
    order?: string;
    /**
     * 重置
     */
    reset?: string;
    /**
     * 确认
     */
    confirm?: string;
    /**
     * 未命名
     */
    unnamed?: string;
  };
};

export type ToolbarComponentProps = {
  /**
   * 按钮配置
   * {
   *   search:{}, 查询
   *   refresh:{}, 刷新
   *   compact:{}, 紧凑模式
   *   columns:{} 列设置
   * }
   */
  buttons?: {
    /**
     * 按钮key: 按钮配置
     */
    [key: string]: ButtonProps;
  };

  /**
   * 当前是否显示查询。
   * 注意：如果要隐藏search，请配置crudOptions.search.show=false
   */
  search?: boolean;

  columnsFilter?: ColumnsFilterComponentProps;

  /**
   * 当前是否紧凑模式
   */
  compact?: boolean;

  /**
   * 导出配置
   */
  export?: ExportProps;

  /**
   * 列配置
   */
  columns?: TableColumnsProps;

  /**
   * 是否保存用户列设置
   * 传string则表示传入缓存的主key
   */
  storage?: boolean | string;
  /**
   * 插槽
   */
  slots?: {
    [key: string]: Function;
  };
};

/**
 * 工具条配置
 */
export type ToolbarProps = {
  [key: string]: any;
} & ToolbarComponentProps;

type ButtonIconProps = string | { icon: string; [key: string]: any } | UiSlot;
type NullableString = string | null;

export type FormWrapperContext = {
  wrapper: any;
  options: any;
  formRef: Ref;
  form: any;
  wrapperBindRef: any;
  formOptionsRef: Ref;
  setFormData: (form: any) => void;
  getFormData: () => any;
  close: () => void;
  toggleFullscreen: () => void;
  submit: () => void;
};
/**
 * 按钮配置
 */
export type ButtonProps<E = any> = {
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
  click?: (context: E) => void;

  show?: boolean;

  /**
   * 其他按钮配置 [a|el|n]-button的配置，请查看对应ui组件的文档
   */
  [key: string]: any;
};
export type ButtonsProps<E> = TypeMap<ButtonProps<E>>;

export type TypeMap<T> = {
  [key: string]: T;
};

export type ActionbarClickEvent = {
  key: string;
  btn: ButtonProps;
  $event: any;
};
export type ActionbarProps = {
  buttons?: ButtonsProps<ActionbarClickEvent>;

  [key: string]: any;
};

export type SearchEventContext = { form: any; validatedForm: any; getComponentRef?: (key: string) => any };
/**
 * 查询框配置
 */
export type SearchProps = {
  /**
   * 是否显示查询框
   */
  show?: boolean;

  /**
   * 初始化查询表单数据，reset会还原成此对象
   */
  initialForm?: Record<string, any>;

  /**
   * 校验成功后的表单数据，无需手动配置
   */
  validatedForm?: Record<string, any>;
  /**
   * 查询框的按钮配置（查询和重置按钮，你还可以添加自定义按钮）
   */
  buttons?: ButtonsProps<SearchEventContext>;

  /**
   * 查询框容器
   */
  container?: {
    is?: string;
    collapse?: boolean; //是否展开，你布局组件中定义的props
    /**
     * 按钮组 form-item配置
     */
    action?: {
      label?: string; //查询按钮前缀
      col?: {
        span?: number;
        [key: string]: any;
      };
      [key: string]: any;
    };
    collapseButton?: ButtonProps;
    /**
     * 布局方式：【single-line单行, multi-line多行】
     */
    layout?: string;

    [key: string]: any;
  };

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
   * 搜索框是否显示此字段组件
   */
  show?: boolean;
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
   * 此字段是否开启触发自动查询, 传入string则表示，[input,change,enter]事件时触发
   */
  autoSearchTrigger?: boolean | string;
  /**
   * 其他[a|el|n]-form-item的配置
   */
  [key: string]: any;
};

export type TableColumnsProps = {
  [key: string]: ColumnProps;
};
/**
 * 表格列配置(单元格)
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
  formatter?: (scope: ScopeContext) => string;
  /**
   * 自定义render方法
   * @param scope
   */
  cellRender?: (scope: ScopeContext) => any;

  /**
   * 多级表头
   */
  children?: TableColumnsProps;

  /**
   * 单元格值变化事件处理
   */
  valueChange?: ValueChangeHandle | ValueChangeProps;

  /**
   * 是否支持导出
   */
  exportable?: boolean;
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
  index?: number;
  mode?: string;
  column?: ColumnCompositionProps;
};
export type ValueResolveContext = ValueBuilderContext;

/**
 * 列综合配置
 */
export type ColumnCompositionProps = {
  /**
   * 列标题
   */
  title?: string;

  /**
   * key
   */
  key?: string;

  /**
   * 字段类型,【默认可以用：text】
   */
  type?: string | string[];
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
   * dict，会复制到各个component中去
   */
  dict?: Dict;

  /**
   * 多级表头
   */
  children?: CompositionColumns;
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
   * 更多按钮配置
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
  buttons?: ButtonsProps<ScopeContext>;

  /**
   * 按钮折叠
   */
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
   * 字段复合配置, 里面的{search,column,form,viewForm,editForm,addForm}设置将分发到各个部件的columns中
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
  viewFormUseCellComponent?: boolean;
  searchCopyFormProps?: string[];
  onUseCrud?: (bindings: CrudBinding) => void;
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

export type TabsFilterDefaultOption = { show?: boolean; value?: any; label?: string };
export type TabsFilterOption = { value: any; label: string; [key: string]: any };
export interface TabsFilterProps {
  /**
   * 目标字段的key，查询时作为search的key
   */
  name: string; //查询字段的key,search参数key
  /**
   * 是否显示
   */
  show?: boolean;
  /**
   * 全部选项卡（第一个选项卡）的配置
   */
  defaultOption?: TabsFilterDefaultOption;
  /**
   * 选项，如果目标字段配置了dict，那么将自动通过dict生成，无需配置
   */
  options?: TabsFilterOption[];
  /**
   * 选项value的名称
   */
  value?: string;
  /**
   * 选项label的名称
   */
  label?: string;

  /**
   * change事件
   * @param context
   */
  onChange?: (context: any) => void;

  /**
   * tabs 显示类型
   */
  type?: string;

  /**
   * x-tabs 其他属性
   */
  [key: string]: any;
}

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
   * Tabs快捷查询组件
   */
  tabs?: TabsFilterProps;
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
  watch?: (context: ScopeContext) => any;
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
