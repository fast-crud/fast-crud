<template>
  <!-- 简单模式 -->
  <template v-if="mode === 'simple'">
    <component :is="$fsui.row.name" class="fs-table-columns-filter-simple">
      <component
        :is="$fsui.col.name"
        v-for="(element, key) in currentValue"
        v-show="element.__show"
        :key="key"
        :span="6"
      >
        <component
          :is="$fsui.checkbox.name"
          v-model:[$fsui.checkbox.modelValue]="element.show"
          :disabled="element.__disabled"
          class="item-label"
          @update:[$fsui.checkbox.modelValue]="showChange(index, $event)"
        />
        {{ element.label || element.title || element.key || _text.unnamed }}
      </component>
    </component>
    <component :is="$fsui.divider.name" />
    <component :is="$fsui.row.name">
      <fs-button type="primary" :icon="$fsui.icons.check" :text="_text.confirm" @click="simpleSubmit()" />
      <fs-button :icon="$fsui.icons.refresh" :text="_text.reset" @click="simpleReset" />
    </component>
  </template>
  <!-- 完全模式 -->
  <component :is="$fsui.drawer.name" v-else :title="_text.title" v-bind="drawerBind" append-to-body>
    <component
      :is="$fsui.drawer.hasContentWrap || 'div'"
      class="fs-drawer-wrapper fs-table-columns-filter"
      :title="_text.title"
    >
      <component :is="$fsui.card.name" shadow="never">
        <div class="component--list">
          <div key="__first__" class="component--list-item" flex="main:justify cross:center">
            <span :span="12">
              <!-- 全选 反选 -->
              <component :is="$fsui.checkbox.name" :indeterminate="isIndeterminate" v-bind="checkAllBind">
                {{ showLength }} / {{ allLength }}
              </component>
            </span>
            <span class="title">{{ _text.fixed }} / {{ _text.order }}</span>
          </div>

          <draggable v-model="currentValue" item-key="key">
            <template #item="{ element, index }">
              <div v-show="element.__show" class="component--list-item" flex="main:justify cross:center">
                <component
                  :is="$fsui.checkbox.name"
                  v-model:[$fsui.checkbox.modelValue]="element.show"
                  :disabled="element.__disabled"
                  class="item-label"
                  @update:[$fsui.checkbox.modelValue]="showChange(index, $event)"
                >
                  {{ element.label || element.title || element.key || _text.unnamed }}
                </component>
                <div class="item-right">
                  <fs-table-columns-fixed-controller
                    v-model="element.fixed"
                    flex-box="0"
                    class="d2-mr-10"
                    @change="fixedChange(index, $event)"
                  />
                  <div flex-box="0" class="component--list-item-handle handle">
                    <fs-icon :icon="$fsui.icons.sort" />
                  </div>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </component>
      <component :is="$fsui.row.name" class="fs-drawer-footer" :gutter="10">
        <component :is="$fsui.col.name" :span="12">
          <fs-button :icon="$fsui.icons.refresh" :text="_text.reset" block @click="reset" />
        </component>
        <component :is="$fsui.col.name" :span="12">
          <fs-button type="primary" :icon="$fsui.icons.check" :text="_text.confirm" block @click="submit()" />
        </component>
      </component>
    </component>
  </component>
</template>

<script lang="ts" setup>
import draggable from "vuedraggable-es";
import _ from "lodash-es";
import FsTableColumnsFixedController from "../fs-table-columns-fixed-controller/component.vue";
import TableStore from "../../../utils/util.store";
import { useI18n } from "../../../locale";
import {ref, computed, nextTick, Ref, watch} from "vue";
import { uiContext } from "../../../ui";
import { useMerge } from "../../../use/use-merge";
import { useRoute } from "vue-router";

const { cloneDeep } = useMerge();

export interface ColumnsFilterProps {
  show?: boolean;
  mode?: string;
  columns?: any[];
  storage?: boolean | string;
  text?: {
    title?: string;
    fixed?: string;
    order?: string;
    reset?: string;
    confirm?: string;
    unnamed?: string;
  };
}

const props = withDefaults(defineProps<ColumnsFilterProps>(), {
  storage: true
});
const emit = defineEmits(["update:columns", "update:show"]);

const { t } = useI18n();
const ui = uiContext.get();
const active = ref(false);
const drawerBind = computed(() => {
  return {
    [ui.drawer.visible]: active.value,
    ["onUpdate:" + ui.drawer.visible]: (e) => {
      active.value = e;
    },
    [ui.drawer.width]: "300px"
  };
});

const start = () => {
  active.value = true;
};

const original = ref({});
const currentValue:Ref<any[]> = ref([]);
const checkAll = ref(false);
const indeterminate = ref(false);
// 全选和反选发生变化时触发
function onCheckAllChange(value) {
  checkAll.value = value;
  currentValue.value = currentValue.value.map((e:any) => {
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
    ["onUpdate:" + ui.checkbox.modelValue]: (v) => {
      onCheckAllChange(v);
    }
  };
});

const showLength = computed(() => {
  return currentValue.value.filter((e) => e.__show && e.show === true).length;
});
const allLength = computed(() => {
  return currentValue.value.filter((e) => e.__show).length;
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
  _.merge(def, props.text);
  return def;
});

function buildOriginalColumns(value) {
  console.log('value',value)
  const columns:any = [];
  _.forEach(value, (item) => {
    const column = {
      key: item.key,
      title: item.title,
      fixed: item.fixed ?? false,
      show: item.show ?? true,
      __show: item.columnSetShow !== false,
      __disabled: item.columnSetDisabled ?? false
    };
    columns.push(column);
  });
  return columns;
}

function setCurrentValue(value) {
  currentValue.value = buildOriginalColumns(value);
  checkAll.value = showLength.value > 0;
}

// fixed 变化时触发
function fixedChange(index, value) {
  if (value) {
    currentValue.value[index].show = true;
  }
  if (value === "left") {
    currentValue.value.unshift(currentValue.value.splice(index, 1)[0]);
  }
  if (value === "right") {
    currentValue.value.push(currentValue.value.splice(index, 1)[0]);
  }
  showChange();
}
function showChange() {
  checkAll.value = showLength.value > 0;
}

// 还原
function reset() {
  currentValue.value = _.cloneDeep(original.value);
  submit(true);
  clearThisStorage();
}
// 确认
function submit(noSave) {
  if (noSave !== true) {
    saveOptionsToStorage(currentValue.value);
  }
  const result = _.cloneDeep(currentValue.value);

  //解决naive ui与列设置冲突的问题
  result.forEach((column) => {
    delete column.__disabled;
    delete column.__show;
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

function doEmit(result) {
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

function saveOptionsToStorage(value) {
  if (props.storage === false) {
    return;
  }

  const storedOptions:any = [];
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

function getColumnsHash(columns) {
  const keys:any = [];
  for (const item of columns) {
    const target = _.pick(item,'key','__show','__disabled');
    keys.push(JSON.stringify(target));
  }
  keys.sort();
  let hash = "";
  for (const key of keys) {
    hash += key;
  }
  return hash;
}
console.log('columns',props.columns)
watch(
  () => {
    return props.columns;
  },
  (value) => {
    setCurrentValue(value);
  }
);

const init = () => {
  original.value = buildOriginalColumns(props.columns);
  console.log(' original.value ', original.value )
  setCurrentValue(props.columns);
  const storedOptions = getOptionsFromStorage();
  if (storedOptions) {
    const storeHash = getColumnsHash(storedOptions);
    const optionHash = getColumnsHash(original.value);
    if (optionHash !== storeHash) {
      // 如果字段列有过修改，则不使用本地设置
      return;
    }
    const curValue:any = [];
    for (const storedOption of storedOptions) {
      const found = currentValue.value.find((item) => item.key === storedOption.key);
      if (found) {
        found.fixed = storedOption.fixed;
        found.show = storedOption.show;
        curValue.push(found);
      }
    }
    currentValue.value = curValue;
    nextTick(() => {
      submit(true);
    });
  }
};

init();
defineExpose({
  start
})
</script>
<style lang="less">
.fs-table-columns-filter-simple {
  min-width: 760px;
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
