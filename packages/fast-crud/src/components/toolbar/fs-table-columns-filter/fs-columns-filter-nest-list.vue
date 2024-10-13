<template>
  <draggable :list="columns" item-key="key" :move="onDraggableMove">
    <template #item="{ element, index }">
      <div>
        <div
          v-show="originalColumnsMap[element.__key]?.__show !== false"
          :title="buildText(element)"
          class="component--list-item"
          flex="main:justify cross:center"
          :i="index"
        >
          <component
            :is="ui.checkbox.name"
            :[ui.checkbox.modelValue]="element.show"
            :disabled="originalColumnsMap[element.__key]?.__disabled === true"
            class="item-label"
            :title="buildText(element)"
            @[buildUpdateKey(ui.checkbox.modelValue)]="updateChecked(element)"
            @change="onCheckChanged"
          >
            {{ buildText(element) }}
          </component>
          <div class="item-right">
            <fs-table-columns-fixed-controller
              v-if="isRoot"
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
        <div style="margin-left: 20px; padding-left: 10px; border-left: 1px solid #eee">
          <fs-columns-filter-nest-list
            v-if="element.children"
            :columns="element.children"
            @check-changed="onCheckChanged"
          />
        </div>
      </div>
    </template>
  </draggable>
</template>
<script setup lang="ts">
//不要删
//@ts-ignore
import draggable from "vuedraggable-es";
import FsTableColumnsFixedController from "./fs-table-columns-fixed-controller/index.vue";
import { ColumnsFilterContext, ColumnsFilterItem, ColumnsFilterProvideKey } from "../../../d";
import { inject } from "vue";
import { useUi } from "@fast-crud/ui-interface";

const { ui } = useUi();
const emits = defineEmits(["check-changed", "fixed-changed"]);
type NestListProps = {
  columns: ColumnsFilterItem[];
  isRoot?: boolean;
};
const props = withDefaults(defineProps<NestListProps>(), {
  isRoot: false
});
const { originalColumns, currentColumns, originalColumnsMap, text, active } =
  inject<ColumnsFilterContext>(ColumnsFilterProvideKey);
function buildText(element: any) {
  return element.label || element.title || element.key || text.value.unnamed;
}

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
function buildUpdateKey(key) {
  return "update:" + key;
}

function findFromTree(tree: any[], key: string) {
  for (const item of tree) {
    if (item.key === key) {
      return item;
    }
    if (item.children) {
      const result = findFromTree(item.children, key);
      if (result) {
        return result;
      }
    }
  }
  return null;
}
function updateChecked(element: any) {
  element.show = !element.show;
  //级联选中和取消

  function updateChildren(element: any) {
    if (element.children) {
      element.children.forEach((e: any) => {
        if (!e.__show || e.__disabled) {
          return;
        }
        e.show = element.show;
        updateChildren(e);
      });
    }
  }
  updateChildren(element);

  function updateParent(element) {
    if (element.__parent) {
      const parent = element.__parent;
      if (parent) {
        parent.show = parent.children.filter((e: any) => e.__show && e.show === true).length > 0;
        updateParent(parent);
      }
    }
  }
  updateParent(element);
}
function onCheckChanged() {
  emits("check-changed");
}
function fixedChange(index: number, value: any) {
  emits("fixed-changed", index, value);
}
</script>
