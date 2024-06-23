<template>
  <!-- 简单模式 -->
  <template v-if="mode === 'simple'">
    <component :is="ui.row.name" class="fs-table-columns-filter-simple">
      <component
        :is="ui.col.name"
        v-for="(element, key) in currentColumns"
        v-show="original[element.key]?.__show !== false"
        :key="key"
        :span="6"
      >
        <component
          :is="ui.checkbox.name"
          v-model:[ui.checkbox.modelValue]="element.show"
          :disabled="original[element.key]?.__disabled === true"
          class="item-label"
          :title="buildText(element)"
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

  <component :is="container?.is || 'fs-columns-filter-layout-default'" v-else v-bind="container">
    <template #buttons>
      <component :is="ui.row.name" class="fs-drawer-footer" :gutter="10">
        <component :is="ui.col.name" :span="12">
          <fs-button :icon="ui.icons.refresh" :text="_text.reset" block @click="reset" />
        </component>
        <component :is="ui.col.name" :span="12">
          <fs-button type="primary" :icon="ui.icons.check" :text="_text.confirm" block @click="submit(false)" />
        </component>
      </component>
    </template>
  </component>
</template>

<script lang="ts" setup>
/**
 * FsTableColumnsFilter，列设置组件
 */
import _ from "lodash-es";
import TableStore from "../../../utils/util.store";
import { useI18n } from "../../../locale";
import { computed, nextTick, provide, Ref, ref, watch } from "vue";
import { uiContext } from "../../../ui";
import { useMerge } from "../../../use/use-merge";
import { useRoute } from "vue-router";
import {
  ColumnProps,
  ColumnsFilterItem,
  ColumnsFilterProvideKey,
  TableColumnsProps,
  TypeMap,
  ColumnsFilterComponentProps
} from "../../../d";

const props = withDefaults(defineProps<ColumnsFilterComponentProps>(), {
  storage: true,
  mode: "default",
  container: () => {
    return { is: "fs-columns-filter-layout-default" };
  }
});
const emit = defineEmits(["update:columns", "update:show", "reset", "submit"]);

const { t } = useI18n();
const ui = uiContext.get();
const active = ref(false);
const start = () => {
  active.value = true;
};

const original: Ref<TypeMap<ColumnsFilterItem>> = computed(() => {
  return transformColumnsMap(props.originalColumns);
});
const currentColumns: Ref<ColumnsFilterItem[]> = ref([]);
const { merge } = useMerge();

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

function transformToTableColumns(result: ColumnsFilterItem[]) {
  const columns: TableColumnsProps = {};
  _.forEach(result, (item) => {
    const column: ColumnProps = _.omit(item, "children", "__show", "__disabled");
    if (item.children && item.children.length > 0) {
      column.children = transformToTableColumns(item.children);
    }
    columns[item.key] = column;
  });
  return columns;
}

function transformColumnsMap(value: TableColumnsProps): TypeMap<ColumnsFilterItem> {
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

function transformColumns(value: TableColumnsProps): ColumnsFilterItem[] {
  const columns: ColumnsFilterItem[] = [];
  _.forEach(value, (item) => {
    const column = buildColumnFilterItem(item);
    columns.push(column);
    if (item.children) {
      const list: ColumnsFilterItem[] = transformColumns(item.children);
      column.children = [] = list;
    }
  });
  return columns;
}

function setCurrentValue(value: any) {
  currentColumns.value = transformColumns(value);
}

// 还原
async function reset() {
  currentColumns.value = transformColumns(props.originalColumns);
  await do_save(true);
  await clearThisStorage();
  emit("reset");
}
// 确认
async function do_save(noSave = false) {
  if (!noSave) {
    await saveOptionsToStorage(currentColumns.value);
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
  return result;
}

async function submit(noSave = false) {
  const columns = await do_save(noSave);
  emit("submit", { columns });
}

provide(ColumnsFilterProvideKey, { originalColumns: original, currentColumns, text: _text, active, submit, reset });

async function simpleSubmit() {
  await submit(false);
  emit("update:show", false);
}
async function simpleReset() {
  await reset();
  emit("update:show", false);
}

function doEmit(result: ColumnsFilterItem[]) {
  emit("update:columns", transformToTableColumns(result));
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

async function saveOptionsToStorage(value: any) {
  if (props.storage === false) {
    return;
  }

  const storedOptions: any = [];
  for (let i = 0; i < value.length; i++) {
    const item = value[i];
    storedOptions.push(item);
  }
  await getStorageTable().updateTableValue(storedOptions);
}

async function getOptionsFromStorage() {
  if (props.storage === false) {
    return;
  }
  return await getStorageTable().getTableValue();
}
async function clearThisStorage() {
  await getStorageTable().clearTableValue();
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

const init = async () => {
  setCurrentValue(props.columns);
  const storedOptions = await getOptionsFromStorage();
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
    await nextTick();
    await submit(true);
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
