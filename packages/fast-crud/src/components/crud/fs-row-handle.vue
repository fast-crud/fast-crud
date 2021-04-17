<template>
  <div class="fs-row-handle">
    <template v-for="(item, index) in computedHandleBtns" :key="index">
      <fs-button v-if="item.show !== false" class="row-handle-btn" v-bind="item" @click.stop="doClick(item)" />
    </template>
    <!-- 下拉按钮菜单 -->
    <span v-if="computedDropdownBtns.length > 0" class="row-handle-btn fs-handle-row-dropdown">
      <component :is="$fsui.dropdown.name" v-bind="$fsui.dropdown.command(doDropdownItemClick)">
        <fs-button v-bind="dropdown" />
        <template #[$fsui.dropdown.slotName]>
          <component :is="$fsui.dropdownMenu.name" v-bind="$fsui.dropdownMenu.command(doDropdownItemClick)">
            <template v-for="(item, index) in computedDropdownBtns" :key="index">
              <component
                :is="$fsui.dropdownItem.name"
                v-if="item.show !== false"
                v-bind="item"
                :[$fsui.dropdownItem.command]="item.key"
              >
                {{ item.text }}
              </component>
            </template>
          </component>
        </template>
      </component>
    </span>
  </div>
</template>
<script>
import { computed, defineComponent } from "vue";
import FsButton from "../basic/fs-button";
import _ from "lodash-es";
import traceUtil from "../../utils/util.trace";
import { useI18n } from "../../local";
import logger from "../../utils/util.log";
export default defineComponent({
  name: "FsRowHandle",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    FsButton
  },
  props: {
    dropdown: {},
    view: {
      type: Object
    },
    edit: {
      type: Object
    },
    remove: {
      type: Object
    },
    custom: {
      type: Array
    },
    scope: {}
  },
  emits: ["handle"],
  setup(props, ctx) {
    traceUtil.trace("fs-row-handler");
    const { t } = useI18n();
    const doClick = (item) => {
      const e = { key: item.key, btn: item, ...props.scope };
      if (item.click) {
        return item.click(e);
      }
      ctx.emit("handle", e);
    };
    const computedAllHandleBtns = computed(() => {
      const defBtns = {
        view: {
          key: "view",
          order: 1,
          text: t("fs.rowHandle.view.text")
        },
        edit: {
          key: "edit",
          type: "primary",
          order: 2,
          text: t("fs.rowHandle.edit.text")
        },
        remove: {
          key: "remove",
          type: "danger",
          order: 3,
          text: t("fs.rowHandle.remove.text")
        }
      };
      const mergedBtns = _.merge(defBtns, {
        view: props.view,
        edit: props.edit,
        remove: props.remove
      });
      const btns = [mergedBtns.view, mergedBtns.edit, mergedBtns.remove];

      if (props.custom && props.custom.length > 0) {
        for (const item of props.custom) {
          btns.push({
            order: 4,
            ...item
          });
        }
      }
      btns.sort((a, b) => {
        return a.order - b.order;
      });
      return btns;
    });

    const computedDropdownAtLeast = computed(() => {
      if (
        props.dropdown == null ||
        props.dropdown.atLeast == null ||
        props.dropdown.atLeast <= 0 ||
        computedAllHandleBtns.value.length <= props.dropdown.atLeast
      ) {
        return 0;
      }
      return props.dropdown.atLeast || 0;
    });
    const computedHandleBtns = computed(() => {
      if (computedDropdownAtLeast.value <= 0) {
        return computedAllHandleBtns.value;
      }
      const handleBtns = computedAllHandleBtns.value.slice(0, computedDropdownAtLeast.value);
      return handleBtns;
    });
    const computedDropdownBtns = computed(() => {
      if (computedDropdownAtLeast.value <= 0) {
        return [];
      }
      const dropdownBtns = computedAllHandleBtns.value.slice(computedDropdownAtLeast.value);
      return dropdownBtns;
    });

    function doDropdownItemClick($event) {
      for (let btn of computedAllHandleBtns.value) {
        if ($event === btn.key) {
          doClick(btn);
          return;
        }
      }
    }

    return {
      computedAllHandleBtns,
      computedHandleBtns,
      computedDropdownBtns,
      doDropdownItemClick,
      computedDropdownAtLeast,
      doClick
    };
  }
});
</script>

<style lang="less">
.fs-row-handle {
  display: flex;
  flex-wrap: wrap;
  .row-handle-btn {
    margin: 2px;
    &.el-button {
      margin: 2px;
    }
  }
  .ant-btn {
    margin-left: 2px;
    margin-right: 2px;
  }
}
</style>
