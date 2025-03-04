<template>
  <div class="fs-search-layout-default" :class="{ 'fs-search-multi-line': computedIsMultiLine }">
    <div class="fs-search-box">
      <div
        class="fs-search-main"
        :class="{ 'fs-search-collapse': collapse }"
        :style="{ maxHeight: computedColumnBoxHeight }"
      >
        <component :is="ui.row.name" ref="columnsRowRef" class="fs-search-columns">
          <span class="fs-search-col fs-search-slot">
            <slot name="search-left"></slot>
          </span>
          <!-- 查询字段render，需要定义props.columns -->
          <template v-for="(item, key) of columns" :key="key">
            <component :is="ui.col.name" v-if="item.show" class="fs-search-col" v-bind="mergeCol(item.col)">
              <fs-render :render-func="item._cellRender" :scope="getContextFn()" />
            </component>
          </template>
          <span class="fs-search-col fs-search-slot">
            <slot name="search-middle"></slot>
          </span>
          <component
            :is="ui.col.name"
            v-if="!computedIsMultiLine"
            class="fs-search-col fs-search-buttons-group"
            v-bind="mergeCol(action?.col)"
          >
            <component :is="ui.formItem.name" :[ui.formItem.label]="action?.label">
              <!-- 查询按钮插槽-->
              <slot name="search-buttons" v-bind="getContextFn()"></slot>
            </component>
          </component>
          <span class="fs-search-col fs-search-slot">
            <slot name="search-right" v-bind="getContextFn()"></slot>
          </span>
        </component>
      </div>
      <div v-if="computedIsMultiLine" class="fs-search-buttons-group fs-search-multi-line-buttons">
        <!-- 多行模式时的查询按钮-->
        <slot name="search-buttons"></slot>
        <fs-button
          v-if="collapseButton?.show !== false"
          :icon="collapse ? ui.icons.caretUp : ui.icons.caretDown"
          :text="
            collapse
              ? t('fs.search.container.collapseButton.text.expand')
              : t('fs.search.container.collapseButton.text.collapse')
          "
          v-bind="collapseButton"
          @click="toggleCollapse"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { useUi } from "../../use";
import { computed, defineComponent, onMounted, ref } from "vue";
import { merge } from "lodash-es";
import { useI18n } from "../../locale";

export default defineComponent({
  name: "FsSearchLayoutDefault",
  props: {
    /**
     * 是否收缩
     */
    collapse: {
      type: Boolean,
      default: true
    },
    /**
     * 展开按钮
     */
    collapseButton: {
      type: Object
    },

    action: {
      type: Object
    },
    /**
     * 布局模式
     */
    layout: {
      type: String,
      default: "single-line"
    },
    /**
     * 查询字段列表，可以精细化自定义查询字段布局
     */
    columns: {
      type: Object
    },
    /**
     * 默认的col配置
     */
    col: {
      type: Object
    },

    /**
     * 获取查询上下文
     */
    getContextFn: {
      type: Function
    }
  },
  emits: ["update:collapse", "collapse"],
  setup(props, ctx) {
    const { ui } = useUi();
    const { t } = useI18n();
    const columnsRowRef = ref();
    const computedIsMultiLine = computed(() => {
      return props.layout === "multi-line";
      //不要这个，会死循环， && columnsBoxHeightRef.value > columnsLineHeightRef.value;
    });
    onMounted(() => {
      if (computedIsMultiLine.value && columnsRowRef.value) {
        columnsBoxHeightRef.value = columnsRowRef.value.$el.offsetHeight;
      }
    });

    const computedColumnBoxHeight = computed(() => {
      if (!computedIsMultiLine.value || !props.collapse) {
        return "auto";
      }
      return columnsBoxHeightRef.value ? columnsBoxHeightRef.value + "px" : "";
    });

    const columnsBoxHeightRef = ref(0);

    const toggleCollapse = () => {
      ctx.emit("update:collapse", !props.collapse);
      ctx.emit("collapse", !props.collapse);
    };

    function mergeCol(col: any) {
      return merge({}, props.col, col);
    }

    return {
      ui,
      columnsRowRef,
      computedColumnBoxHeight,
      computedIsMultiLine,
      toggleCollapse,
      mergeCol,
      t
    };
  }
});
</script>
<style lang="less">
.fs-search-layout-default {
  width: 100%;

  .fs-search-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;

    .fs-search-main {
      width: 100%;
      display: flex;
      height: auto;

      .fs-search-columns {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        height: auto;
        padding: 4px 0 4px 0;

        .fs-search-col {
          min-width: 180px;
          &.fs-search-slot {
            min-width: 0;
          }
          & > * {
            margin: 0px 4px;
          }

          margin: 4px 0;

          &:first-child {
            // margin-left: 0;
          }

          .ant-form-item-label {
            max-width: 50%;
          }

          .ant-input-number,
          .ant-picker,
          .el-input-number,
          .el-cascader,
          .el-date-editor,
          .n-select,
          .n-date-picker,
          .n-input-number {
            width: 100%;
          }
          .el-date-editor .el-range__icon {
            margin-left: 10px;
          }
          .el-date-editor .el-range__close-icon {
            margin-right: 10px;
          }
        }
      }
    }
  }

  .fs-search-buttons-group {
    display: flex;
    align-items: center;

    .fs-button {
      margin: 0 2px 0 2px;
    }
  }

  &.fs-search-multi-line {
    .fs-search-box {
      .fs-search-main {
        flex-direction: column;
        overflow: hidden;
        height: auto;
        transition: max-height 0.2s ease;

        &.fs-search-collapse {
          max-height: 42px !important;
        }
      }
    }

    .ant-form-item {
      display: flex;
      .ant-form-row {
        width: 100%;
      }
      .ant-form-item-control {
        flex: 1;
        overflow: hidden;
      }
    }
  }
}
</style>
