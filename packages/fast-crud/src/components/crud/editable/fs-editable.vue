<template>
  <div class="fs-editable">
    <div v-if="!editing" class="fs-editable-inner fs-editable-pointer" v-bind="activeTrigger">
      <div class="fs-editable-input">
        <div v-if="dirty" class="fs-editable-dirty" />
        <slot></slot>
      </div>
      <div v-if="trigger" class="fs-editable-action fs-editable-icon">
        <fs-icon :icon="ui.icons.edit" />
      </div>
    </div>
    <div v-else class="fs-editable-inner">
      <div class="fs-editable-input">
        <slot name="edit"></slot>
      </div>
      <div v-if="editing && showAction" class="fs-editable-action">
        <fs-icon v-if="loading" size="mini" :spin="true" :icon="ui.icons.refresh" />
        <fs-icon v-else size="mini" :icon="ui.icons.check" @click="doSubmit" />
        <fs-icon :class="{ hidden: loading }" size="mini" :icon="ui.icons.close" @click="doCancel" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUi } from "@fast-crud/ui-interface";
import { computed } from "vue";

type FsEditableProps = {
  editing: boolean;
  dirty?: boolean;
  trigger?: "onClick" | "onDbClick" | false;
  loading?: boolean;
  showAction?: boolean;
};
const props = withDefaults(defineProps<FsEditableProps>(), {
  editing: false,
  dirty: false,
  loading: false,
  showAction: true,
  trigger: "onClick"
});

const { ui } = useUi();
const emits = defineEmits(["update:editing", "submit", "cancel"]);
const activeTrigger = computed(() => {
  if (!props.trigger) {
    return {};
  }
  return {
    [props.trigger]: () => {
      emits("update:editing", true);
    }
  };
});
function doSubmit() {
  emits("submit");
}
function doCancel() {
  emits("cancel");
}
</script>

<style lang="less">
.fs-editable {
  display: flex;
  width: 100%;
  align-items: center;
  .fs-editable-pointer {
    cursor: pointer;
  }
  .fs-editable-inner {
    display: flex;
    width: 100%;
    align-items: center;
    min-height: 23px;
    .fs-editable-dirty {
      border-radius: 100px;
      width: 5px;
      height: 5px;
      margin-left: -5px;
      background: red;
    }
    .fs-editable-input {
      flex: 1;
    }
    .fs-editable-action {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-left: 10px;
      i,
      .anticon {
        width: 20px;
        text-align: center;
        font-size: 16px;
        cursor: pointer;
      }
      .hidden {
        visibility: hidden;
      }
    }

    .fs-editable-icon {
      visibility: hidden;
    }
    &:hover .fs-editable-icon {
      visibility: visible;
    }

    .el-radio {
      margin-right: 5px;
      .el-radio__label {
        padding: 2px;
      }
    }
  }
}
</style>
