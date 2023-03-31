<template>
  <div class="fs-search-layout-default" :class="{ 'fs-search-multi-line': computedIsMultiLine }">
    <div class="fs-search-box">
      <div
        class="fs-search-main"
        :class="{ 'fs-search-collapse': collapse }"
        :style="{ maxHeight: computedColumnBoxHeight }"
      >
        <component :is="ui.row.name" ref="columnsRowRef" class="fs-search-columns">
          <!-- 查询字段render，render可以更精细化的自定义，需要定义props.columns -->
          <template v-for="(item, key) of columns" :key="key">
            <component :is="ui.col.name" v-if="item.show" class="fs-search-col" v-bind="mergeCol(item.col)">
              <fs-render :render-func="item._cellRender" />
            </component>
          </template>
          <!--
            也可以使用search-items插槽，自定义程度不高，比较简单
            <slot name="search-items"></slot>
          -->

          <component
            :is="ui.col.name"
            v-if="!computedIsMultiLine"
            class="fs-search-col fs-search-buttons-group"
            v-bind="mergeCol(action?.col)"
          >
            <component :is="ui.formItem.name" :[ui.formItem.label]="action?.label">
              <!-- 查询按钮插槽-->
              <slot name="search-buttons"></slot>
            </component>
          </component>
        </component>
      </div>
      <div v-if="computedIsMultiLine" class="fs-search-buttons-group fs-search-multi-line-buttons">
        <!-- 多行模式时的查询按钮-->
        <slot name="search-buttons"></slot>
        <fs-button
          :icon="collapse ? ui.icons.caretUp : ui.icons.caretDown"
          text="更多条件"
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
import _ from "lodash-es";
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
    }
  },
  emits: ["update:collapse", "collapse"],
  setup(props, ctx) {
    const { ui } = useUi();
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
      return _.merge({}, props.col, col);
    }

    return {
      ui,
      columnsRowRef,
      computedColumnBoxHeight,
      computedIsMultiLine,
      toggleCollapse,
      mergeCol
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
          & > * {
            margin: 0px 4px;
          }
          margin: 4px 0;
          &:first-child {
            // margin-left: 0;
          }
        }
      }
    }
  }

  .fs-search-buttons-group {
    display: flex;
    align-items: center;
    .fs-button {
      margin: 0 4px 0 4px;
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
  }
}
</style>
