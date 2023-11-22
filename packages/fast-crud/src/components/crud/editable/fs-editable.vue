<template>
  <div class="fs-editable">
    <div v-if="!editing || disabled" class="fs-editable-inner fs-editable-pointer" v-bind="activeTrigger">
      <div class="fs-editable-input">
        <div v-if="dirty" class="fs-editable-dirty" />
        <slot></slot>
      </div>
      <div v-if="trigger && !disabled" class="fs-editable-action fs-editable-icon">
        <fs-icon :icon="ui.icons.edit" />
      </div>
    </div>
    <div v-else class="fs-editable-inner" :class="{ 'fs-validate-error': hasError() }">
      <div class="fs-editable-input">
        <slot name="edit"></slot>
      </div>
      <div class="fs-editable-action">
        <component :is="ui.tooltip.name">
          <template #[ui.tooltip.content]>
            <span class="error-icon">
              {{ getValidateErrorMessage() }}
            </span>
          </template>
          <template #[ui.tooltip.trigger]>
            <fs-icon :class="{ hidden: !hasError(), 'error-icon': true }" size="mini" :icon="ui.icons.info" />
          </template>
        </component>
        <template v-if="showAction">
          <fs-icon v-if="loading" size="mini" :spin="true" :icon="ui.icons.refresh" />
          <fs-icon v-else size="mini" :icon="ui.icons.check" @click="doSubmit" />
          <fs-icon :class="{ hidden: loading }" size="mini" :icon="ui.icons.close" @click="doCancel" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUi } from "@fast-crud/ui-interface";
import { computed } from "vue";

type FsEditableProps = {
  disabled?: boolean;
  editing: boolean;
  dirty?: boolean;
  trigger?: "onClick" | "onDbClick" | false;
  loading?: boolean;
  showAction?: boolean;
  validateErrors?: any[];
};
const props = withDefaults(defineProps<FsEditableProps>(), {
  disabled: false,
  editing: false,
  dirty: false,
  loading: false,
  showAction: true,
  trigger: "onClick",
  validateErrors: () => {
    return [];
  }
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
function hasError() {
  return props.validateErrors?.length > 0;
}
function getValidateErrorMessage() {
  if (props.validateErrors?.length === 0) {
    return;
  }
  return props.validateErrors?.map((item) => item.message).join(",");
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

    &.fs-validate-error {
      .error-icon {
        color: #ff4d4f;
      }
      .ant-input-affix-wrapper {
        border-color: #ff4d4f;
        box-shadow: 0 0 0 2px rgb(255 38 5 / 6%);
      }
      .el-input__wrapper {
        border-color: #ff4d4f !important;
        box-shadow: 0 0 0 1px #ff4d4f inset !important;
      }
      .n-input .n-input__state-border {
        border-color: #ff4d4f !important;
        box-shadow: 0 0 0 2px rgb(255 38 5 / 6%);
      }
    }
  }
}
</style>
