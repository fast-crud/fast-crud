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

          <fs-columns-filter-nest-list
            :columns="currentColumns"
            :is-root="true"
            @check-changed="allCheckedUpdate"
            @fixed-changed="fixedChange"
          ></fs-columns-filter-nest-list>
        </div>
      </component>
      <slot name="buttons"></slot>
    </component>
  </component>
</template>

<script lang="ts" setup>
import { merge } from "lodash-es";
//不要删
//@ts-ignore
import draggable from "vuedraggable-es";
import { useUi } from "../../../use";
import { computed, inject, ref, watch } from "vue";
import { ColumnsFilterProvideKey, ColumnsFilterContext, ColumnsFilterContainerProps } from "../../../d/";
import FsColumnsFilterNestList from "./fs-columns-filter-nest-list.vue";

const { ui } = useUi();

const { originalColumns, currentColumns, text, active } = inject<ColumnsFilterContext>(ColumnsFilterProvideKey);
const props = defineProps<ColumnsFilterContainerProps>();
const drawerBind = computed(() => {
  return merge(
    {
      [ui.drawer.visible]: active.value,
      ["onUpdate:" + ui.drawer.visible]: (e: any) => {
        active.value = e;
      },
      [ui.drawer.width]: props.width || "400px"
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
</script>

<style lang="less"></style>
