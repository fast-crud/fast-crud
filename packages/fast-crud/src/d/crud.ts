import { Component, Ref, ShallowRef, ComputedRef } from "vue";
import { ComputeContext } from "./compute";
import { CrudExpose, DoRemoveContext, OnAfterRemoveContext, OpenDialogProps } from "../d/expose";

import { RuleItem } from "async-validator";
import { UiSlot, UiSlotRet } from "@fast-crud/ui-interface";
import { ExportProps } from "../lib/fs-export";
import { Dict, GetContextFn } from "../use";

// export type FsRefValue<T> = T | Ref<T> | ComputedRef<T>;
// export type FsComputeValue<T> = FsRefValue<T> | ComputeValue<T> | AsyncComputeValue<T>;

export type RowRecord = {
  [key: string]: any;
  children?: any[];
};
export type UseFsRet<R = any, C = any> = {
  crudRef: Ref;
  crudBinding: Ref<CrudBinding<R>>;
  crudExpose: CrudExpose<R>;
  context: C;
} & UseCrudRet<R> &
  CreateCrudOptionsRet<R>;

export type UseFsContext = any;

export type CreateCrudOptionsProps<R = any, C = any> = {
  crudExpose: CrudExpose<R>;

  expose?: CrudExpose<R>;

  context: C;
};

export type CreateCrudOptionsRet<R = any> = {
  /**
   * crudOptions
   */
  crudOptions: DynamicallyCrudOptions<R>;

  /**
   * 自定义返回变量
   */
  [key: string]: any;
};

export type UseFsProps<R = any, C = any> = {
  crudRef?: Ref;
  crudBinding?: Ref<CrudBinding<R>>;
  crudExpose?: CrudExpose<R>;
  crudExposeRef?: Ref<CrudExpose<R>>;
  createCrudOptions: CreateCrudOptions<R, C> | CreateCrudOptionsAsync<R, C>;
  crudOptionsOverride?: DynamicallyCrudOptions<R>;
  onExpose?: (context: OnExposeContext<R, C>) => any;

  context?: C;
};
export type CreateCrudOptions<R = any, C = any> = (props: CreateCrudOptionsProps<R, C>) => CreateCrudOptionsRet<R>;
export type OnExposeContext<R = any, C = any> = {
  crudRef: Ref;
  crudBinding: Ref<CrudBinding<R>>;
  crudExpose: CrudExpose<R>;
  context: C;
};

export type CreateCrudOptionsAsync<R = any, C = any> = (
  props: CreateCrudOptionsProps<R, C>
) => Promise<CreateCrudOptionsRet<R>>;

export type UseCrudProps<R = any, C = any> = {
  crudOptions: DynamicallyCrudOptions<R>;
  /**
   * 即将废弃，请使用crudExpose
   */
  expose?: CrudExpose<R>;
  crudExpose: CrudExpose<R>;

  context?: C;
  /**
   * 自定义参数
   * common里面可以使用
   */
  [key: string]: any;
};

export type UseCrudRet<R = any> = {
  /**
   * 重新设置crudOptions
   * @param overOptions
   */
  resetCrudOptions: (options: DynamicType<CrudOptions<R>>) => void;
  /**
   * 覆盖crudOptions配置
   * @param overOptions
   */
  appendCrudOptions: (options: DynamicType<CrudOptions<R>>) => DynamicType<CrudOptions<R>>;
  /**
   * 追加配置,注意是覆盖crudBinding的结构，而不是crudOptions的结构
   * @param overBinding
   */
  appendCrudBinding: (overBinding: CrudBinding<R>) => void;
};

export type RowContext<R = any> = {
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
  form: R;

  /**
   * 行数据
   */
  row: R;

  /**
   * naive ui 有record
   */
  record?: R;
  /**
   * 第几行
   */
  index: number;
};
export type ScopeContext<R = any> = {
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
} & RowContext<R>;

export type ComponentRenderContext<R = any> = {
  /**
   * 继承component的attrs
   */
  attrs: any;
} & ScopeContext<R>;

export type FormScopeContext<R = any> = {
  /**
   * 初始form数据
   */
  initialForm: R;
  /**
   * 属性
   */
  attrs?: any;
  /**
   * 提交成功后的response
   */
  res?: any;

  /**
   * 表单数据
   */
  form: R;
} & ScopeContext<R>;

export type ComponentEventContext<R = any> = {
  /**
   * 原始事件
   */
  $event: any;
} & ScopeContext<R>;

export type ValueChangeContext<R = any> = {
  /**
   * 当前是否是第一次触发的
   */
  immediate?: boolean;
  [key: string]: any;
} & ScopeContext<R>;

/**
 * valueChange复合配置
 */
export type ValueChangeProps<R = any> = {
  /**
   * 是否立即触发一次
   */
  immediate?: boolean;
  /**
   * valueChange处理器
   */
  handle: ValueChangeHandle<R>;
};
/**
 * valueChange 处理器
 */
export type ValueChangeHandle<R = any> = (context: ValueChangeContext<R>) => Promise<void>;

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
export type PageQuery<R = any> = {
  /**
   * 翻页参数
   */
  page?: Page;
  /**
   * 查询表单
   */
  form?: R;
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
export type PageRes<R = any> = {
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
  records: R[];
};

export type EditReq<R = any> = {
  form?: R;
  row?: R;
  [key: string]: any;
};

export type AddReq<R = any> = {
  form?: R;
  [key: string]: any;
};

export type DelReq<R = any> = {
  row?: R;
  [key: string]: any;
};

export type InfoReq<R = any> = {
  mode?: string;
  row?: R;
  [key: string]: any;
};

/**
 * 用户后台page请求原始返回
 */
export type UserPageRes<R = any> = {
  [key: string]: any;
};

/**
 * 页面数据转换参数
 */
export type TransformResProps<R = any> = {
  /**
   * 用户页面请求实际返回
   */
  res: UserPageRes<R>;
  /**
   * 本次请求参数
   */
  query: UserPageQuery<R>;
};

/**
 * 用户自定义的后台翻页参数
 */
export type UserPageQuery<R = any> = {
  [key: string]: any;
};

export type TransformQuery<R = any> = (query: PageQuery<R>) => UserPageQuery<R>;
export type TransformRes<R = any> = (props: TransformResProps<R>) => PageRes<R>;
export type PageRequest<R = any> = (query: UserPageQuery<R>) => Promise<UserPageRes<R>>;
export type EditRequest<R = any> = (req: EditReq<R>) => Promise<any>;
export type AddRequest<R = any> = (req: AddReq<R>) => Promise<any>;
export type DelRequest<R = any> = (req: DelReq<R>) => Promise<any>;
export type InfoRequest<R = any> = (req: InfoReq<R>) => Promise<any>;

/**
 * 请求配置
 */
export type RequestProp<R = any> = {
  transformQuery?: TransformQuery<R>;
  transformRes?: TransformRes<R>;
  pageRequest?: PageRequest<R>;
  addRequest?: AddRequest<R>;
  editRequest?: EditRequest<R>;
  delRequest?: DelRequest<R>;
  infoRequest?: InfoRequest<R>;

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
export type ComponentProps<R = any> = {
  /**
   * 是否显示组件
   */
  show?: boolean;
  /**
   * 组件的名称
   */
  name?: string | Component;
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
    [key: string]: (context: ComponentEventContext<R>) => void;
  };

  /**
   * 同on，即将废弃
   */
  events?: {
    [key: string]: (context: ComponentEventContext<R>) => void;
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
  render?: (scope: ComponentRenderContext<R>) => any;

  /**
   * 组件其他参数，如style、class、onXxx事件等
   */
  [key: string]: any;
};

export type RemoveConfirmFn<R = any> = (context: DoRemoveContext<R>) => Promise<void>;
/**
 * 删除操作配置
 */
export type RemoveProps<R = any> = {
  //无需确认
  noConfirm?: boolean;
  /**
   * 自定义确认删除，抛出异常则取消
   * @param context
   */
  confirmFn?: RemoveConfirmFn<R>;
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
   * 删除请求之后的操作，如果返回false,终止后续的执行，比如显示删除成功通知等
   * @param context
   */
  afterRemove?: (context: OnAfterRemoveContext<R>) => Promise<any>;

  /**
   * 显示成功提示
   */
  showSuccessNotification?: boolean;

  /**
   * 当取消删除时
   * @param context
   */
  onCanceled?: (context: ScopeContext<R>) => Promise<any>;

  /**
   * 删除成功后的操作
   * @param context
   */
  onRemoved?: (context: ScopeContext<R>) => Promise<any>;

  /**
   * 实际删除操作，返回false则不继续后续的刷新表格等操作
   * @param context
   */
  handle?: (context: DoRemoveContext<R>) => Promise<any>;

  /**
   * confirm对话框的属性
   */
  confirmProps?: any;
  /**
   * 其他属性
   */
  [key: string]: any;
};

export type EditableProps<R = any> = {
  /**
   * 是否启用编辑
   */
  enabled?: boolean;
  rowKey?: string;
  /**
   * 是否readonly
   */
  readonly?: boolean;
  addForm?: FormProps<R>;
  editForm?: FormProps<R>;
  //模式，free，row
  mode?: "free" | "row" | "cell";
  /**
   * 是否排他式激活，激活一个，关闭其他
   */
  exclusive?: boolean;
  /**
   * 排他式激活关闭其他编辑时的效果，是取消还是保存
   */
  exclusiveEffect?: "cancel" | "save";

  //激活触发方式,onClick,onDbClick,false, free模式生效
  activeTrigger?: "onClick" | "onDbClick" | false;
  activeDefault?: boolean;
  //设置哪个cell可以激活编辑
  isEditable?: (opts: { editableId: any; key: string; row: R }) => boolean;
  /**
   * 更新单元格方法
   * @param opts
   */
  updateCell?: (opts: { editableId: any; row: R; key: string; value: any }) => Promise<any>;

  /**
   * 本地自定义插入方法
   * 如果你不喜欢新增的记录在第一条的话，你可以自己实现插入方法
   */
  addRow?: (data: R[], row: R) => boolean;

  [key: string]: any;
};

export type TableColumnEditableDisabledFunc<R = any> = (opts: {
  column: ColumnProps;
  editableId: any;
  row: R;
}) => boolean;
export type EditableUpdateCellRequest<R = any> = (opts: {
  editableId: any;
  row: R;
  key: string;
  value: any;
}) => Promise<R>;
export type EditableUpdateColumnRequest<R = any> = (opts: {
  editableId: any;
  row: R;
  key: string;
  data: R[];
}) => Promise<any>;
export type TableColumnEditableProps<R = any> = {
  disabled?: boolean | TableColumnEditableDisabledFunc;
  updateCell?: EditableUpdateCellRequest<R>;
  updateColumn?: EditableUpdateColumnRequest<R>;
  showAction?: boolean;
};

export type ConditionalRenderProps<R = any> = {
  match: (scope: ScopeContext<R>) => boolean;
  render: (scope: ScopeContext<R>) => UiSlotRet;
};

export type MobileAdaptorProps<R = any> = {
  isMobile?: Ref<boolean>;

  rowHandle?: {
    width?: number;
  };
};

// export type CellConditionalRender<R = any> = ConditionalRenderProps<R>;

export type RowSelectionProps<R = any> = {
  /**
   * 是否多选
   */
  multiple?: boolean; //单选还是多选
  /**
   * 跨页选中
   */
  crossPage?: boolean; //跨页选中

  /**
   * 选中值变化事件
   * @param selectedRowKeys
   */
  onSelectedChanged?: (selectedRowKeys: R[]) => void;

  /**
   * 选中的id列表
   */
  selectedRowKeys?: Ref<any[]> | Function;

  /**
   * 选择列是否固定
   */
  selectionFixed?: string;
};
/**
 * 表格配置
 */
export type TableProps<R = any> = {
  /**
   * 调用doRefresh完成之后触发
   */
  onRefreshed?: (context: { data: R[] }) => void;

  /**
   * 是否禁用loading状态
   */
  disableLoading?: boolean;

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
  data?: R[];

  /**
   * 单元格列配置
   */
  columns?: TableColumnsProps<R>;

  /**
   * 列配置 map
   */
  columnsMap?: TableColumnsProps<R>;

  /**
   * 条件渲染
   */
  conditionalRender?: ConditionalRenderProps<R>;

  /**
   * 表格最大高度调整
   */
  maxHeightAdjust?: number;

  /**
   * 可编辑配置
   */
  editable?: EditableProps<R>;

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
export type FormWrapperSaveRemindProps = boolean | (() => Promise<boolean>);
/**
 * 表单对话框配置
 */
export type FormWrapperProps<R = any> = {
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
  onOpen?: (opts: OpenDialogProps<R>) => void;
  /**
   * 对话框打开后事件处理
   * @param opts
   */
  onOpened?: (opts: FormWrapperContext<R>) => void;

  /**
   * 对话框关闭前事件处理，返回false则阻止关闭
   */
  beforeClose?: (opts: FormWrapperContext<R>) => Promise<boolean>;
  /**
   * 对话框关闭后事件处理
   * @param opts
   */
  onClosed?: (opts: FormWrapperContext<R>) => void;

  buttons?: {
    [key: string]: ButtonProps<FormWrapperContext<R>>;
  };
  /**
   * 打开对话框时是否全屏
   */
  fullscreen?: boolean;

  /**
   * 变更保存提醒
   */
  saveRemind?: FormWrapperSaveRemindProps;

  /**
   * 是否内部打开对话框
   */
  inner?: boolean;

  /**
   * 内部打开对话框时容器的选择器，一般是admin框架主页面的容器的元素选择器
   * 比如fs-admin 为 main.fs-framework-content
   */
  innerContainerSelector?: string;
  /**
   * 对应对话框组件的配置
   */
  [key: string]: any;
};
/**
 * 表单分组-组配置
 */
export type FormGroupItemProps<R = any> = {
  /**
   * 是否显示该分组
   */
  show?: boolean;
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
export type FormGroupProps<R = any> = {
  type?: string;
  groups?: {
    [key: string]: FormGroupItemProps<R>;
  };
  [key: string]: any;
};
/**
 * 表单字段帮助说明配置
 */
export type FormItemHelperProps<R = any> = {
  /**
   * 自定义渲染帮助说明
   * @param scope
   */
  render?: (scope: ScopeContext<R>) => any;
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

/**
 * 表单配置
 */
export type FormProps<R = any> = {
  /**
   * 表单初始值
   */
  initialForm?: R;

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
  prefixRender?: (scope: ScopeContext<R>) => any;
  /**
   * 字段组件之后render
   * @param scope
   */
  suffixRender?: (scope: ScopeContext<R>) => any;
  /**
   * 表单对话框/抽屉配置
   */
  wrapper?: FormWrapperProps<R>;
  /**
   * 点击保存按钮，表单校验之前做一些操作,返回false或抛异常，阻止后续操作
   */
  beforeValidate?: (context: FormScopeContext<R>) => Promise<boolean>;
  /**
   * 提交前做一些操作,返回false或抛异常，阻止后续操作
   */
  beforeSubmit?: (context: FormScopeContext<R>) => Promise<boolean>;

  /**
   * 提交表单的方法（默认已经配置好，将会调用addRequest或者updateRequest）
   */
  doSubmit?: (context: FormScopeContext<R>) => Promise<any>;
  /**
   * 提交后做一些操作，可以抛异常来阻止后续操作，其中context.res = doSubmit的返回值
   * @param context
   */
  afterSubmit?: (context: FormScopeContext<R>) => Promise<any>;

  /**
   * 成功后的操作，afterSubmit未抛异常时执行，默认为刷新表格
   * @param context
   */
  onSuccess?: (context: FormScopeContext<R>) => Promise<any>;

  /**
   * 表单重置时的操作
   */
  doReset?: () => Promise<any>;

  /**
   * 表单分组配置
   */
  group?: FormGroupProps<R>;

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

export type FormItemTitleRender<R = any> = (context: ScopeContext<R>) => any;

export type RuleRecord = {
  trigger?: string | string[];
} & RuleItem;
/**
 * 表单字段配置
 */
export type FormItemProps<R = any> = {
  /**
   * 字段label
   */
  title?: string | FormItemTitleRender<R>;
  /**
   * 表单字段组件配置
   */
  component?: ComponentProps<R>;
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
  helper?: string | FormItemHelperProps<R>;
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
  valueChange?: ValueChangeHandle<R> | ValueChangeProps<R>;

  /**
   * 值构建器，打开对话框时执行
   * 从pageRequest获取到的字段数据值可能并不是组件能够识别的值，所以需要将其做一层转化
   * 即row[key]=字段组件能够识别的值
   * @param context
   */
  valueBuilder?: (context: ValueBuilderContext<R>) => void;
  /**
   * 值解析器，表单提交前执行
   * 表单输出的值可能不是后台所需要的值，所以需要在提交前做一层转化
   * 即：row[key]=后台能所需要的值
   * @param context
   */
  valueResolve?: (context: ValueResolveContext<R>) => void;

  /**
   * 条件渲染
   * @param scope
   */
  conditionalRender?: ConditionalRenderProps<R>;

  /**
   * 直接渲染组件
   * @param scope
   */
  render?: (scope: ScopeContext<R>) => any;

  /**
   * 组件左边渲染
   * @param scope
   */
  prefixRender?: (scope: ScopeContext<R>) => any;

  /**
   * 组件右边渲染
   * @param scope
   */
  suffixRender?: (scope: ScopeContext<R>) => any;

  /**
   * 组件上方渲染
   * @param scope
   */
  topRender?: (scope: ScopeContext<R>) => any;

  /**
   * 组件下方渲染
   * @param scope
   */
  bottomRender?: (scope: ScopeContext<R>) => any;
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
export type ColumnsFilterContainerProps = {
  width?: string;
  drawer?: any;
};
export interface FsRemoteStorage {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  remove(key: string): Promise<void>;
}

export type ColumnsFilterComponentProps<R = any> = {
  /**
   * 布局容器组件配置
   */
  container?: ContainerProps & ColumnsFilterContainerProps;

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
  columns?: TableColumnsProps<R>;

  /**
   * 原始列数据，还原成此列表
   */
  originalColumns?: TableColumnsProps<R>;
  /**
   * 是否保存设置
   */
  storage?: boolean | string | FsRemoteStorage;
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

  /**
   * 重置事件
   */
  onReset?: () => Promise<void>;

  /**
   * 保存事件
   * @param props
   */
  onSubmit?: (props: { columns: any }) => Promise<void>;
};

export type ToolbarComponentProps<R = any> = {
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
   * 注意：不要配置此项
   * 注意：如果要隐藏search，请配置crudOptions.search.show=false
   */
  search?: boolean;

  columnsFilter?: ColumnsFilterComponentProps<R>;

  /**
   * 当前是否紧凑模式
   */
  compact?: boolean;

  /**
   * 导出配置
   */
  export?: ExportProps<R>;

  /**
   * 列配置
   */
  columns?: TableColumnsProps<R>;

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
export type ToolbarProps<R = any> = {
  [key: string]: any;
} & ToolbarComponentProps<R>;

type ButtonIconProps = string | { icon: string; [key: string]: any } | UiSlot;
type NullableString = string | null;

export type FormWrapperContext<R = any> = {
  formWrapperId: any;
  formWrapperIdClass: any;
  wrapper: any;
  options: any;
  formRef: any;
  form: R;
  mode: string;
  title: any;
  fullscreen: any;
  wrapperBindRef: any;
  formOptionsRef: any;
  setFormData: (form: R) => void;
  getFormData: () => R;
  reset: () => void;
  loading: Ref;
  fullscreenEnabled: any;
  doClose: () => Promise<boolean>;
  close: () => Promise<void>;
  toggleFullscreen: () => void;
  submit: () => Promise<void>;
  onClosed: any;
  onOpened: any;
  open: (opts: OpenDialogProps) => Promise<any>;

  [key: string]: any;
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
   * 当按钮作为折叠时，折叠按钮的额外配置
   */
  dropdownItem?: any;

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

export type SearchEventContext<R = any> = {
  form: R;
  validatedForm: R;
  getComponentRef?: (key: string) => any;
  doSearch?: () => void;
  doReset?: () => void;
  doValidate?: (silent: boolean, trigger: string) => Promise<boolean>;
};
/**
 * 查询框配置
 */
export type SearchProps<R = any> = {
  /**
   * 是否显示查询框
   */
  show?: boolean;

  /**
   * 初始化查询表单数据，reset会还原成此对象
   */
  initialForm?: Record<string, R>;

  /**
   * 校验成功后的表单数据，无需手动配置
   */
  validatedForm?: Record<string, R>;
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
export type SearchItemProps<R = any> = {
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
  valueResolve?: (context: ValueResolveContext<R>) => void;
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
   * 值变化事件
   */
  valueChange?: ValueChangeHandle<R> | ValueChangeProps<R>;
  /**
   * 其他[a|el|n]-form-item的配置
   */
  [key: string]: any;
};

export type TableColumnsProps<R = any> = {
  [key: string]: ColumnProps<R>;
};

/**
 * 表格列配置(单元格)
 */
export type ColumnProps<R = any> = {
  key?: string;
  /**
   * 单元格组件配置
   */
  component?: ComponentProps<R>;
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
  formatter?: (scope: ScopeContext<R>) => string;
  /**
   * 自定义render方法
   * @param scope
   */
  cellRender?: (scope: ScopeContext<R>) => any;

  /**
   * 多级表头
   */
  children?: TableColumnsProps<R>;

  /**
   * 单元格值变化事件处理
   */
  valueChange?: ValueChangeHandle<R> | ValueChangeProps<R>;

  /**
   * 是否支持导出
   */
  exportable?: boolean;

  /**
   * 单元格可编辑配置
   */
  editable?: TableColumnEditableProps<R>;

  /**
   * element-plus 列自定插槽配置，可以自定义header
   */
  columnSlots?: Record<string, any>;
  /**
   * 其他x-table-column配置
   */
  [key: string]: any;
};

/**
 * valueBuild参数
 */
export type ValueBuilderContext<R = any> = {
  value: any;
  key: keyof R;
  row?: R;
  form?: R;
  index?: number;
  mode?: string;
  column?: ColumnCompositionProps<R>;
};
export type ValueResolveContext<R = any> = ValueBuilderContext<R>;

/**
 * 列综合配置
 */
export type ColumnCompositionProps<R = any> = {
  /**
   * 列标题
   */
  title?: string;

  /**
   * key
   */
  key?: keyof R;

  /**
   * 字段类型,【默认可以用：text】
   */
  type?: string | string[];
  /**
   * 表格列配置（单元格）
   */
  column?: ColumnProps<R>;
  /**
   * 表单字段配置
   */
  form?: FormItemProps<R>;
  /**
   * 添加表单字段配置（与form合并）
   */
  addForm?: FormItemProps<R>;
  /**
   * 编辑表单字段配置（与form合并）
   */
  editForm?: FormItemProps<R>;
  /**
   * 查看表单字段配置（与form合并）
   */
  viewForm?: FormItemProps<R>;
  /**
   * 查询框字段配置
   */
  search?: SearchItemProps<R>;
  /**
   * 值构建器，pageRequest之后执行
   * 从pageRequest获取到的字段数据值可能并不是组件能够识别的值，所以需要将其做一层转化
   * 即row[key]=字段组件能够识别的值
   * @param context
   */
  valueBuilder?: (context: ValueBuilderContext<R>) => void;
  /**
   * 值解析器，表单提交前执行
   * 表单输出的值可能不是后台所需要的值，所以需要在提交前做一层转化
   * 即：row[key]=后台能所需要的值
   * @param context
   */
  valueResolve?: (context: ValueResolveContext<R>) => void;

  /**
   * dict，会复制到各个component中去
   */
  dict?: Dict;

  /**
   * 多级表头
   */
  children?: CompositionColumns<R>;
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

type RowHandleDropdownProps<R = any> = {
  /**
   * 更多按钮配置
   */
  more?: ButtonProps;

  [key: string]: any;
};
type RowHandleGroupProps<R = any> = {
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
export type RowHandleProps<R = any> = {
  /**
   * 是否显示操作列
   */
  show?: boolean;
  /**
   * 操作列按钮配置
   */
  buttons?: ButtonsProps<ScopeContext<R>>;

  /**
   * 按钮折叠
   */
  dropdown?: RowHandleDropdownProps<R>;

  /**
   * 额外的按钮组
   * 激活时就显示，没激活的不显示
   * 同一时间只能激活一组
   */
  group?: RowHandleGroupProps<R>;

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
export type CompositionColumns<R = any> = {
  /**
   * 字段复合配置, 里面的{search,column,form,viewForm,editForm,addForm}设置将分发到各个部件的columns中
   */
  [K in keyof R]: ColumnCompositionProps<R>;
};

export type CrudOptionsPluginOpts = {
  before?: boolean;
  order?: number;
};
export type CrudOptionsPluginReg = {
  handle: CrudOptionsPluginHandle;
  opts?: CrudOptionsPluginOpts;
};

export type CrudOptionsPluginHandle<T = any, R = any> = (
  props: T,
  ctx: UseCrudProps,
  crudOptions: any
) => CrudOptions<R>;
export type CrudOptionsPlugin<T, R = any> = {
  /**
   * 是否启用,默认启用
   */
  enabled?: boolean;
  /**
   * 插件参数
   */
  props?: T;
  /**
   * 插件顺序
   */
  order?: number;
  /**
   * 合并在用户的CrudOptions之前还是之后
   */
  before?: boolean;
  /**
   * 插件处理器
   */
  handle?: CrudOptionsPluginHandle<T, R>;
};

export type CrudOptionsPlugins<R = any> = {
  /**
   * 行选择插件
   */
  rowSelection?: CrudOptionsPlugin<RowSelectionProps, R>;
  [key: string]: CrudOptionsPlugin<any, R>;
};

/**
 * crud配置
 */
export type CrudOptions<R = any> = {
  /**
   * 列配置
   */
  columns?: CompositionColumns<R>;
} & CrudBinding<R>;

export type CrudSettings<R = any> = {
  viewFormUseCellComponent?: boolean;
  searchCopyFormProps?: string[];
  onUseCrud?: (bindings: CrudBinding<R>) => void;
  /**
   * crudOptions插件，插件能够生成一些crudOptions配置，并与用户的crudOptions进行合并
   */
  plugins?: CrudOptionsPlugins<R>;
};
export type CrudMode = {
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
export interface TabsFilterProps<R = any> {
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
export type CrudBinding<R = any> = {
  /**
   * 表格id
   */
  id?: string;

  settings?: CrudSettings;
  /**
   * 模式
   */
  mode?: CrudMode;

  /**
   * 表格配置
   */
  table?: TableProps<R>;
  /**
   * 列表数据，一般会从pageRequest之后更新
   */
  data?: R[];
  /**
   * 操作列配置
   */
  rowHandle?: RowHandleProps<R>;
  /**
   * 查询框配置
   */
  search?: SearchProps<R>;
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
  tabs?: TabsFilterProps<R>;
  /**
   * 表单配置
   */
  form?: FormProps<R>;
  /**
   * 添加表单的独立配置（与form配置合并）
   */
  addForm?: FormProps<R>;
  /**
   * 编辑表单的独立配置（与form配置合并）
   */
  editForm?: FormProps<R>;
  /**
   * 查看表单的独立配置（与form配置合并）
   */
  viewForm?: FormProps<R>;
  /**
   * 底部翻页组件配置
   */
  pagination?: PaginationProps;
  /**
   * http请求配置
   */
  request?: RequestProp<R>;

  /**
   * crud外部容器配置
   */
  container?: ContainerProps;
  /**
   * 其他配置
   */
  [key: string]: any;
};

export type ComputeRef<RV = any, R = any> = {
  computeFn: (context: ComputeContext<R>) => RV;
};

export type ComputeFn<RV = any, R = any> = (context: ComputeContext<R>) => RV;

export type AsyncComputeRef<RV = any, R = any, WV = any> = {
  watch?: (context: ScopeContext<R>) => WV;
  asyncFn: (value: WV, getContextFn: GetContextFn) => Promise<RV>;
  defaultValue?: RV;
};

export type RefableType<T = any, R = any> =
  | Ref<T>
  | ComputedRef<T>
  | ComputeRef<T, R>
  | AsyncComputeRef<T, R>
  | DynamicType<T, R>;

export type DynamicType<T = any, R = any> = {
  [P in keyof T]: T[P] | RefableType<T[P], R>;
};

/**
 * crudOptions支持动态化配置
 */
export type DynamicallyCrudOptions<R = any> = DynamicType<CrudOptions<R>, R>;
