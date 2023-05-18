<template>
  <!-- 简单模式 -->
  <template v-if="mode === 'simple'">
    <component :is="ui.row.name" class="fs-table-columns-filter-simple">
      <component
        :is="ui.col.name"
        v-for="(element, key) in currentColumns"
        v-show="original[key]?.__show !== false"
        :key="key"
        :span="6"
      >
        <component
          :is="ui.checkbox.name"
          v-model:[ui.checkbox.modelValue]="element.show"
          :disabled="original[key]?.__disabled === true"
          class="item-label"
          :title="buildText(element)"
          @update:[ui.checkbox.modelValue]="showChange"
        >
          {{ buildText(element) }}
        </component>
      </component>
    </component>
    <component :is="ui.divider.name" />
    <component :is="ui.row.name">
      <fs-button
        style="margin-right: 5px"
        type="primary"
        :icon="ui.icons.check"
        :text="_text.confirm"
        @click="simpleSubmit()"
      />
      <fs-button :icon="ui.icons.refresh" :text="_text.reset" @click="simpleReset" />
    </component>
  </template>
  <!-- 完全模式 -->
  <component :is="ui.drawer.name" v-else :title="_text.title" v-bind="drawerBind" append-to-body>
    <component
      :is="ui.drawer.hasContentWrap || 'div'"
      class="fs-drawer-wrapper fs-table-columns-filter"
      :title="_text.title"
    >
      <component :is="ui.card.name" shadow="never">
        <div class="component--list">
          <div key="__first__" class="component--list-item" flex="main:justify cross:center">
            <span :span="12">
              <!-- 全选 反选 -->
              <component :is="ui.checkbox.name" :indeterminate="isIndeterminate" v-bind="checkAllBind">
                {{ showLength }} / {{ allLength }}
              </component>
            </span>
            <span class="title">{{ _text.fixed }} / {{ _text.order }}</span>
          </div>

          <draggable v-model="currentColumns" item-key="key" :move="onDraggableMove">
            <template #item="{ element, index }">
              <div
                v-show="original[element.key]?.__show !== false"
                :title="buildText(element)"
                class="component--list-item"
                flex="main:justify cross:center"
                :i="index"
              >
                <component
                  :is="ui.checkbox.name"
                  v-model:[ui.checkbox.modelValue]="element.show"
                  :disabled="original[element.key]?.__disabled === true"
                  class="item-label"
                  :title="buildText(element)"
                  @update:[ui.checkbox.modelValue]="showChange"
                >
                  {{ buildText(element) }}
                </component>
                <div class="item-right">
                  <fs-table-columns-fixed-controller
                    v-model="element.fixed"
                    flex-box="0"
                    class="d2-mr-10"
                    @change="fixedChange(index, $event)"
                  />
                  <div flex-box="0" class="component--list-item-handle handle">
                    <fs-icon :icon="ui.icons.sort" />
                  </div>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </component>
      <component :is="ui.row.name" class="fs-drawer-footer" :gutter="10">
        <component :is="ui.col.name" :span="12">
          <fs-button :icon="ui.icons.refresh" :text="_text.reset" block @click="reset" />
        </component>
        <component :is="ui.col.name" :span="12">
          <fs-button type="primary" :icon="ui.icons.check" :text="_text.confirm" block @click="submit(false)" />
        </component>
      </component>
    </component>
  </component>
</template>

<script lang="ts" setup>
/**
 * FsTableColumnsFilter，列设置组件
 */
//不要删
import draggable from "vuedraggable-es";
import _ from "lodash-es";
import FsTableColumnsFixedController from "../fs-table-columns-fixed-controller/index.vue";
import TableStore from "../../../utils/util.store";
import { useI18n } from "../../../locale";
import { computed, nextTick, ref, Ref, watch } from "vue";
import { uiContext } from "../../../ui";
import { useMerge } from "../../../use/use-merge";
import { useRoute } from "vue-router";
import { ColumnProps, TypeMap } from "../../../d";

const { cloneDeep } = useMerge();
//https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-props
//https://github.com/vuejs/core/issues/4294
//vue限制，无法通过import直接引入interface
interface ColumnsFilterProps {
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
  columns?: any[];

  /**
   * 原始列数据
   */
  originalColumns?: any[];
  /**
   * 是否保存设置
   */
  storage?: boolean | string;
  /**
   * 文本设置
   */
  text?: {
    //标题
    title?: string;
    //固定
    fixed?: string;
    //排序
    order?: string;
    // 重置
    reset?: string;
    //确认
    confirm?: string;
    //未命名
    unnamed?: string;
  };
}

type ColumnsFilterItem = {
  key: string;
  title: string;
  fixed: boolean | string;
  show: boolean;
  __show: boolean;
  __disabled: boolean;
};
const props = withDefaults(defineProps<ColumnsFilterProps>(), {
  storage: true,
  mode: "default"
});
const emit = defineEmits(["update:columns", "update:show"]);

const { t } = useI18n();
const ui = uiContext.get();
const active = ref(false);
const drawerBind = computed(() => {
  return {
    [ui.drawer.visible]: active.value,
    ["onUpdate:" + ui.drawer.visible]: (e: any) => {
      active.value = e;
    },
    [ui.drawer.width]: "300px"
  };
});

const start = () => {
  active.value = true;
};

const original: Ref<TypeMap<ColumnsFilterItem>> = computed(() => {
  return transformColumnsMap(props.originalColumns);
});
const currentColumns: Ref<ColumnsFilterItem[]> = ref([]);
const checkAll = ref(false);
const indeterminate = ref(false);
const { merge } = useMerge();
// 全选和反选发生变化时触发
function onCheckAllChange(value: any) {
  checkAll.value = value;
  currentColumns.value = currentColumns.value.map((e: any) => {
    if (!e.__show || e.__disabled) {
      return e;
    }
    e.show = value;
    return e;
  });
}

const checkAllBind = computed(() => {
  return {
    [ui.checkbox.modelValue]: checkAll.value,
    ["onUpdate:" + ui.checkbox.modelValue]: (v: any) => {
      onCheckAllChange(v);
    }
  };
});

const showLength = computed(() => {
  return currentColumns.value.filter((e) => e.__show && e.show === true).length;
});
const allLength = computed(() => {
  return currentColumns.value.filter((e) => e.__show).length;
});
const isIndeterminate = computed(() => {
  return showLength.value > 0 && showLength.value < allLength.value;
});
const _text = computed(() => {
  const def = {
    title: t("fs.toolbar.columnFilter.title"),
    fixed: t("fs.toolbar.columnFilter.fixed"),
    order: t("fs.toolbar.columnFilter.order"),
    reset: t("fs.toolbar.columnFilter.reset"),
    confirm: t("fs.toolbar.columnFilter.confirm"),
    unnamed: t("fs.toolbar.columnFilter.unnamed")
  };
  merge(def, props.text);
  return def;
});

function buildColumnFilterItem(item: ColumnProps) {
  return {
    key: item.key,
    title: item.title,
    fixed: item.fixed ?? false,
    show: item.show ?? true,
    __show: item.columnSetShow !== false,
    __disabled: item.columnSetDisabled ?? false
  };
}

function transformColumnsMap(value: ColumnProps[]): TypeMap<ColumnsFilterItem> {
  const columns: TypeMap<ColumnsFilterItem> = {};
  _.forEach(value, (item) => {
    const column = buildColumnFilterItem(item);
    if (item.children) {
      const map = transformColumnsMap(item.children);
      for (let key in map) {
        columns[key] = map[key];
      }
    } else {
      columns[column.key] = column;
    }
  });
  return columns;
}

function transformColumns(value: ColumnProps[]): ColumnsFilterItem[] {
  const columns: ColumnsFilterItem[] = [];
  _.forEach(value, (item) => {
    const column = buildColumnFilterItem(item);
    if (item.children) {
      const list: ColumnsFilterItem[] = transformColumns(item.children);
      for (let item of list) {
        columns.push(item);
      }
    } else {
      columns.push(column);
    }
  });
  return columns;
}

function setCurrentValue(value: any) {
  currentColumns.value = transformColumns(value);
  checkAll.value = showLength.value > 0;
}

function onDraggableMove(e: any, b: any) {
  const draged = e.draggedContext.element;
  const target = e.relatedContext.element;
  const sorted: ColumnsFilterItem[] = [];
  for (const item of currentColumns.value) {
    if (item.key === draged.key) {
      sorted.push(target);
    } else if (item.key === target.key) {
      sorted.push(draged);
    } else {
      sorted.push(item);
    }
  }
  //看key的排列是否正常
  let leftIndex = 0;
  let rightIndex = sorted.length - 1;
  let minNotIndex = sorted.length - 1;
  let maxNotIndex = 0;
  for (let i = 0; i < sorted.length; i++) {
    const item = sorted[i];
    if (item.fixed === "left") {
      leftIndex = i;
    } else if (item.fixed === "right") {
      rightIndex = rightIndex > i ? i : rightIndex;
    } else {
      minNotIndex = minNotIndex > i ? i : minNotIndex;
      maxNotIndex = maxNotIndex < i ? i : maxNotIndex;
    }
  }
  console.log("leftindex", leftIndex, "rightindex", rightIndex, "minnot", minNotIndex, "maxnot", maxNotIndex);

  if (minNotIndex < leftIndex || maxNotIndex > rightIndex) {
    //ui.message.error("非fixed字段不得越过fixed字段的顺序");
    return false;
  }
}

// fixed 变化时触发
function fixedChange(index: number, value: any) {
  if (value) {
    currentColumns.value[index].show = true;
  }
  if (value === "left") {
    currentColumns.value.unshift(currentColumns.value.splice(index, 1)[0]);
  }
  if (value === "right") {
    currentColumns.value.push(currentColumns.value.splice(index, 1)[0]);
  }
  showChange();
}
function showChange() {
  checkAll.value = showLength.value > 0;
}

// 还原
function reset() {
  currentColumns.value = transformColumns(props.originalColumns);
  submit(true);
  clearThisStorage();
}
// 确认
function submit(noSave = false) {
  if (!noSave) {
    saveOptionsToStorage(currentColumns.value);
  }
  const result = _.cloneDeep(currentColumns.value);

  //解决naive ui与列设置冲突的问题
  result.forEach((column) => {
    if (column) {
      delete column.__disabled;
      delete column.__show;
    }
  });

  doEmit(result);
  active.value = false;
}

function simpleSubmit() {
  submit(false);
  emit("update:show", false);
}
function simpleReset() {
  reset();
  emit("update:show", false);
}

function doEmit(result: any) {
  emit("update:columns", result);
}

const storageTableStore = ref();
function getStorageTable() {
  if (storageTableStore.value == null) {
    const route = useRoute();
    storageTableStore.value = new TableStore({
      $router: route,
      tableName: "columnsFilter",
      keyType: props.storage
    });
  }
  return storageTableStore.value;
}

function saveOptionsToStorage(value: any) {
  if (props.storage === false) {
    return;
  }

  const storedOptions: any = [];
  for (let i = 0; i < value.length; i++) {
    const item = value[i];
    storedOptions.push(item);
  }
  getStorageTable().updateTableValue(storedOptions);
}

function getOptionsFromStorage() {
  if (props.storage === false) {
    return;
  }
  return getStorageTable().getTableValue();
}
function clearThisStorage() {
  getStorageTable().clearTableValue();
}

function getColumnsHash(columns: any) {
  const keys: any = [];
  _.forEach(columns, (item) => {
    const target = _.pick(item, "key", "__show", "__disabled");
    keys.push(JSON.stringify(target));
  });
  keys.sort();
  let hash = "";
  for (const key of keys) {
    hash += key;
  }
  return hash;
}
watch(
  () => {
    return props.columns;
  },
  (value) => {
    setCurrentValue(value);
  }
);

const init = () => {
  setCurrentValue(props.columns);
  const storedOptions = getOptionsFromStorage();
  if (storedOptions) {
    const storeHash = getColumnsHash(storedOptions);
    const optionHash = getColumnsHash(original.value);
    if (optionHash !== storeHash) {
      // 如果字段列有过修改，则不使用本地设置
      return;
    }
    const curValue: any = [];
    for (const storedOption of storedOptions) {
      const found = currentColumns.value.find((item) => item.key === storedOption.key);
      if (found) {
        found.fixed = storedOption.fixed;
        found.show = storedOption.show;
        curValue.push(found);
      }
    }
    currentColumns.value = curValue;
    nextTick(() => {
      submit(true);
    });
  }
};

init();
defineExpose({
  start,
  original,
  columns: currentColumns
});

function buildText(element: any) {
  return element.label || element.title || element.key || _text.value.unnamed;
}
</script>
<style lang="less">
.fs-table-columns-filter-simple {
  min-width: 760px;
  padding-top: 20px;
}

.fs-table-columns-filter {
  :focus {
    outline: 0;
  }

  [flex~="cross:center"] {
    -ms-flex-align: center;
    align-items: center;
  }

  [flex~="main:justify"] {
    -ms-flex-pack: justify;
    justify-content: space-between;
  }

  [flex] {
    display: -ms-flexbox;
    display: flex;
  }

  [flex-box="1"] {
    flex-grow: 1;
    flex-shrink: 1;
  }

  [flex] > * {
    display: flex;
  }

  .el-drawer__body {
    height: 0;
  }

  .fs-drawer-wrapper {
    padding: 10px;
    height: 100%;
    overflow-y: auto;
  }

  .fs-drawer-footer {
    padding: 20px;
  }

  .component--list {
    margin: -20px;

    .item-label {
      flex: 1;
      min-width: 0;

      .ant-checkbox + span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .item-right {
      flex-shrink: 1;
      display: flex;
    }

    .title {
      font-size: 14px;
    }

    .component--list-item {
      padding: 10px;
      background-color: #fff;
      margin-bottom: 1px;

      &.ghost {
        opacity: 0.5;
      }

      &:last-child {
        margin-bottom: 0px;
      }

      .component--list-item-handle {
        margin-left: 10px;
        cursor: move;

        &.disabled {
          opacity: 0.3;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
