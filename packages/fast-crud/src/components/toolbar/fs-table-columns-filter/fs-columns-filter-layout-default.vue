<template>
  <component
    :is="ui.drawer.name"
    class="fs-columns-filter-layout-default"
    :title="text.title"
    v-bind="drawerBind"
    append-to-body
  >
    <component
      :is="ui.drawer.hasContentWrap || 'div'"
      class="fs-drawer-wrapper fs-table-columns-filter"
      :title="text.title"
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
            <span class="title">{{ text.fixed }} / {{ text.order }}</span>
          </div>

          <draggable v-model="currentColumns" item-key="key" :move="onDraggableMove">
            <template #item="{ element, index }">
              <div
                v-show="originalColumns[element.key]?.__show !== false"
                :title="buildText(element)"
                class="component--list-item"
                flex="main:justify cross:center"
                :i="index"
              >
                <component
                  :is="ui.checkbox.name"
                  v-model:[ui.checkbox.modelValue]="element.show"
                  :disabled="originalColumns[element.key]?.__disabled === true"
                  class="item-label"
                  :title="buildText(element)"
                  @change="allCheckedUpdate"
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
      <slot name="buttons"></slot>
    </component>
  </component>
</template>

<script lang="ts" setup>
import _ from "lodash-es";
//不要删
//@ts-ignore
import draggable from "vuedraggable-es";
import FsTableColumnsFixedController from "./fs-table-columns-fixed-controller/index.vue";
import { useUi } from "../../../use";
import { computed, inject, ref, watch } from "vue";
import {
  ColumnsFilterItem,
  ColumnsFilterProvideKey,
  ColumnsFilterContext,
  ColumnsFilterContainerProps
} from "../../../d/";

const { ui } = useUi();

const { originalColumns, currentColumns, text, active } = inject<ColumnsFilterContext>(ColumnsFilterProvideKey);
const props = defineProps<ColumnsFilterContainerProps>();
const drawerBind = computed(() => {
  return _.merge(
    {
      [ui.drawer.visible]: active.value,
      ["onUpdate:" + ui.drawer.visible]: (e: any) => {
        active.value = e;
      },
      [ui.drawer.width]: props.width || "300px"
    },
    props.drawer
  );
});

const checkAll = ref(false);
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
  return currentColumns.value.filter((e: any) => e.__show && e.show === true).length;
});
const allLength = computed(() => {
  return currentColumns.value.filter((e: any) => e.__show).length;
});
const isIndeterminate = computed(() => {
  return showLength.value > 0 && showLength.value < allLength.value;
});

watch(
  () => {
    currentColumns.value;
  },
  () => {
    allCheckedUpdate();
  },
  { immediate: true }
);

function onDraggableMove(e: any) {
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
  allCheckedUpdate();
}
function allCheckedUpdate() {
  checkAll.value = showLength.value === allLength.value;
}

function buildText(element: any) {
  return element.label || element.title || element.key || text.value.unnamed;
}
</script>

<style lang="less"></style>
