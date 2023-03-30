<template>
  <div class="fs-search-layout-default" :class="{ 'fs-search-multi-line': computedIsMultiLine }">
    <div class="fs-search-box">
      <div class="fs-search-main">
        <component
          :is="ui.row.name"
          ref="columnsRowRef"
          class="fs-search-columns"
          :class="{ 'fs-search-collapse': collapse }"
          :style="{ height: computedColumnBoxHeight }"
        >
          <!-- 查询字段render -->
          <template v-for="(item, key) of columns" :key="key">
            <component :is="ui.col.name" v-if="item.show" class="fs-search-col" v-bind="item.col">
              <fs-render :render-func="item._cellRender" />
            </component>
          </template>

          <!-- 查询按钮-->
          <component :is="ui.col.name" v-if="!computedIsMultiLine" class="fs-search-col fs-search-buttons-group">
            <component :is="ui.formItem.name">
              <slot name="search-buttons"></slot>
            </component>
          </component>
        </component>
      </div>
      <div v-if="computedIsMultiLine" class="fs-search-buttons-group">
        <!-- 多行模式时的查询按钮-->
        <slot name="search-buttons"></slot>
        <fs-button :icon="collapse ? ui.icons.caretUp : ui.icons.caretDown" @click="toggleCollapse" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { useUi } from "../../use";
import { computed, defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  name: "FsSearchLayoutDefault",
  props: {
    collapse: {
      type: Boolean,
      default: true
    },
    layout: {
      type: String,
      default: "default"
    },
    columns: {
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
        const columnsList = columnsRowRef.value.$el.children;
        if (columnsList && columnsList.length > 1) {
          columnsLineHeightRef.value = columnsList[1].offsetHeight + 10;
        }
      }
    });

    const computedColumnBoxHeight = computed(() => {
      if (!computedIsMultiLine.value) {
        return "auto";
      }
      if (props.collapse) {
        return columnsLineHeightRef.value ? columnsLineHeightRef.value + "px" : "";
      } else {
        return columnsBoxHeightRef.value ? columnsBoxHeightRef.value + "px" : "";
      }
    });

    const columnsBoxHeightRef = ref(0);
    const columnsLineHeightRef = ref(0);

    const toggleCollapse = () => {
      ctx.emit("update:collapse", !props.collapse);
      ctx.emit("collapse", !props.collapse);
    };

    return {
      ui,
      columnsRowRef,
      computedColumnBoxHeight,
      computedIsMultiLine,
      toggleCollapse
    };
  }
});
</script>
<style lang="less">
.fs-search {
  .search-left {
  }

  .search-right {
    flex: 1;
  }

  .fs-search-form {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    //& > * {
    //  margin-bottom: 4px;
    //  margin-top: 4px;
    //  margin-right: 10px;
    //}

    .fs-search-box {
      display: flex;
      flex-direction: column;

      .fs-search-main {
        display: flex;

        .fs-search-columns {
          display: flex;
          flex-wrap: wrap;
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

    .fs-search-multi-line {
      .fs-search-box {
        .fs-search-buttons-group {
          justify-content: end;
          margin-bottom: 10px;
        }

        .fs-search-main {
          flex-direction: column;

          .fs-search-columns {
            height: auto;
            overflow: hidden;
            transition: all 0.1s linear;
            will-change: height;
          }
          .fs-search-collapse {
            overflow: hidden;
          }
        }
      }
    }
  }
}
</style>
